import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  CircleAlert,
  Headphones,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { ConnectionState, Room, RoomEvent, Track } from 'livekit-client';
import { requestVoiceCallToken } from '../../services/voiceAgentService';

const Panel = ({ children, className = '' }) => (
  <section className={`rounded-[8px] border border-[#C8C2DD] bg-white shadow-[0_1px_0_rgba(53,38,110,0.03)] ${className}`}>
    {children}
  </section>
);

const statusStyles = {
  idle: 'bg-[#F0EDFA] text-[#2512D9]',
  requesting: 'bg-[#FFF7E6] text-[#A15A00]',
  connecting: 'bg-[#FFF7E6] text-[#A15A00]',
  connected: 'bg-[#EAF7F0] text-[#0C6B39]',
  disconnected: 'bg-[#F0EDFA] text-[#211B31]',
  error: 'bg-[#FFF0F0] text-[#B41212]',
};

const defaultCallState = {
  status: 'idle',
  label: 'Ready to start',
  roomName: '',
  identity: '',
  remoteCount: 0,
  microphoneEnabled: false,
  error: '',
};

const normalizePhone = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+')) return trimmed;

  const digits = trimmed.replace(/\D/g, '');
  return digits.length === 10 ? `+91${digits}` : trimmed;
};

const getDisplayName = (user) => {
  if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
  return user?.name || user?.first_name || 'Admin';
};

const VoiceAgentCall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const reminderContext = location.state?.voiceContext || null;
  const returnTo = location.state?.returnTo || '/dashboard/support';
  const roomRef = useRef(null);
  const audioElementsRef = useRef([]);
  const disconnectPromiseRef = useRef(null);
  const [formData, setFormData] = useState(() => ({
    name: reminderContext?.customerName || getDisplayName(user),
    phoneNumber: normalizePhone(reminderContext?.customerPhone || user?.phone || user?.mobile || ''),
  }));
  const [callState, setCallState] = useState(defaultCallState);

  const isBusy = callState.status === 'requesting' || callState.status === 'connecting';
  const isConnected = callState.status === 'connected';
  const canStart = !isBusy && !isConnected && formData.name.trim() && formData.phoneNumber.trim();
  const isReminderCall = reminderContext?.source === 'visit_reminder';
  const isPaymentReminderCall = reminderContext?.source === 'payment_reminder';
  const reminderLabel = isPaymentReminderCall ? 'Payment Reminder Call' : isReminderCall ? 'Visit Reminder Call' : 'Voice Agent Call';
  const returnLabel = isPaymentReminderCall ? 'Payment Milestones' : isReminderCall ? 'Upcoming Visits' : 'Support Center';

  const timeline = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: 'Token API',
        detail: callState.status === 'idle' ? 'Waiting for call details' : 'Request sent to voice backend',
        done: ['connecting', 'connected'].includes(callState.status),
      },
      {
        icon: Radio,
        title: 'LiveKit room',
        detail: callState.roomName || 'Room is created per support call',
        done: isConnected,
      },
      {
        icon: Bot,
        title: 'Voice agent dispatch',
        detail: callState.remoteCount > 0 ? 'Agent joined the room' : 'Waiting for agent audio',
        done: callState.remoteCount > 0,
      },
    ],
    [callState.remoteCount, callState.roomName, callState.status, isConnected]
  );

  const detachRemoteAudio = useCallback(() => {
    audioElementsRef.current.forEach((element) => {
      element.pause();
      element.remove();
    });
    audioElementsRef.current = [];
  }, []);

  const disconnectRoom = useCallback(async () => {
    if (disconnectPromiseRef.current) return disconnectPromiseRef.current;

    const room = roomRef.current;
    roomRef.current = null;

    disconnectPromiseRef.current = Promise.resolve()
      .then(async () => {
        if (room && room.state !== ConnectionState.Disconnected) {
          await room.disconnect(true).catch(() => {});
        }
      })
      .finally(() => {
        detachRemoteAudio();
        disconnectPromiseRef.current = null;
        setCallState((prev) => ({
          ...prev,
          status: prev.status === 'error' ? 'error' : 'disconnected',
          label: prev.status === 'error' ? prev.label : 'Call ended',
          remoteCount: 0,
          microphoneEnabled: false,
        }));
      });

    return disconnectPromiseRef.current;
  }, [detachRemoteAudio]);

  useEffect(() => {
    return () => {
      void disconnectRoom();
    };
  }, [disconnectRoom]);

  const updateRemoteCount = useCallback((room) => {
    setCallState((prev) => ({
      ...prev,
      remoteCount: room.remoteParticipants.size,
    }));
  }, []);

  const startCall = async () => {
    if (!canStart) return;

    setCallState({
      ...defaultCallState,
      status: 'requesting',
      label: 'Requesting LiveKit access',
    });

    try {
      const tokenData = await requestVoiceCallToken({
        phoneNumber: normalizePhone(formData.phoneNumber),
        name: formData.name.trim(),
        context: reminderContext,
      });

      setCallState((prev) => ({
        ...prev,
        status: 'connecting',
        label: 'Connecting to voice room',
        roomName: tokenData.room_name || '',
        identity: tokenData.identity || '',
      }));

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          audioPreset: 'speech',
        },
      });

      roomRef.current = room;

      room
        .on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === Track.Kind.Audio) {
            const audioElement = track.attach();
            audioElement.autoplay = true;
            audioElementsRef.current.push(audioElement);
            document.body.appendChild(audioElement);
          }
        })
        .on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((element) => {
            element.pause();
            element.remove();
            audioElementsRef.current = audioElementsRef.current.filter((item) => item !== element);
          });
        })
        .on(RoomEvent.ParticipantConnected, () => updateRemoteCount(room))
        .on(RoomEvent.ParticipantDisconnected, () => updateRemoteCount(room))
        .on(RoomEvent.Disconnected, () => {
          disconnectRoom();
        });

      await room.connect(tokenData.url, tokenData.token, { autoSubscribe: true });
      await room.startAudio();
      await room.localParticipant.setMicrophoneEnabled(true);

      setCallState((prev) => ({
        ...prev,
        status: 'connected',
        label: 'Connected. Start speaking.',
        remoteCount: room.remoteParticipants.size,
        microphoneEnabled: true,
      }));
    } catch (error) {
      await disconnectRoom();
      setCallState((prev) => ({
        ...prev,
        status: 'error',
        label: 'Connection failed',
        error: error.message || 'Unable to connect to the voice agent',
        microphoneEnabled: false,
      }));
    }
  };

  const toggleMicrophone = async () => {
    const room = roomRef.current;
    if (!room || !isConnected) return;

    const nextValue = !callState.microphoneEnabled;
    await room.localParticipant.setMicrophoneEnabled(nextValue);
    setCallState((prev) => ({
      ...prev,
      microphoneEnabled: nextValue,
      label: nextValue ? 'Connected. Start speaking.' : 'Microphone muted',
    }));
  };

  return (
    <div className="min-h-screen bg-[#FBF8FF] text-[#15111F]">
      <header className="sticky top-0 z-10 border-b border-[#D7D0EA] bg-[#F9F6FF]/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(returnTo)}
              className="mb-3 inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#F0EDFA] px-3 text-xs font-black text-[#2512D9]"
            >
              <ArrowLeft size={16} />
              {returnLabel}
            </button>
            <h1 className="text-[30px] font-black leading-tight tracking-normal text-black md:text-[38px]">{reminderLabel}</h1>
            <p className="mt-1 max-w-[720px] text-sm font-medium text-[#342E45]">
              {isPaymentReminderCall
                ? 'Browser call bridge for reminding a customer about a pending or overdue payment milestone.'
                : isReminderCall
                ? 'Browser call bridge for reminding a customer about their scheduled site visit.'
                : 'Browser call bridge for the Square Fit support voice agent. Keep the token API and agent worker running before starting.'}
            </p>
          </div>

          <div className={`inline-flex h-11 items-center justify-center gap-2 rounded-[8px] px-4 text-xs font-black ${statusStyles[callState.status]}`}>
            {isBusy ? <Loader2 size={16} className="animate-spin" /> : isConnected ? <CheckCircle2 size={16} /> : <Headphones size={16} />}
            {callState.label}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.86fr_1.14fr]">
        <Panel className="p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">{isReminderCall || isPaymentReminderCall ? 'Reminder Recipient' : 'Caller Details'}</h2>
              <p className="mt-1 text-xs font-bold text-[#6F687F]">Used as LiveKit participant metadata for the agent</p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2512D9]">
              <UserRound size={20} />
            </div>
          </div>

          {isReminderCall && (
            <div className="mb-5 rounded-[8px] border border-[#D8D3E6] bg-[#FBFAFF] p-3">
              <p className="text-[10px] font-black uppercase text-[#6F687F]">Visit Reminder Context</p>
              <p className="mt-2 text-sm font-black text-[#15111F]">{reminderContext.propertyName || 'Property visit'}</p>
              <p className="mt-1 text-xs font-bold text-[#524B64]">
                {reminderContext.visitDate || 'Date pending'} at {reminderContext.visitTime || 'time pending'}
              </p>
              <p className="mt-1 text-xs font-bold text-[#524B64]">Officer: {reminderContext.officerName || 'Unassigned'}</p>
            </div>
          )}

          {isPaymentReminderCall && (
            <div className="mb-5 rounded-[8px] border border-[#D8D3E6] bg-[#FBFAFF] p-3">
              <p className="text-[10px] font-black uppercase text-[#6F687F]">Payment Reminder Context</p>
              <p className="mt-2 text-sm font-black text-[#15111F]">{reminderContext.milestoneTitle || 'Payment milestone'}</p>
              <p className="mt-1 text-xs font-bold text-[#524B64]">
                {reminderContext.projectName || 'Project'} / {reminderContext.unit || 'Unit'}
              </p>
              <p className="mt-1 text-xs font-bold text-[#524B64]">
                Due: {reminderContext.dueDate || 'date pending'} / Pending: {reminderContext.pendingAmount || 'amount pending'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase text-[#6F687F]">Name</span>
              <input
                value={formData.name}
                disabled={isBusy || isConnected}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="h-12 w-full rounded-[8px] border border-[#C8C2DD] bg-white px-4 text-sm font-bold text-[#15111F] outline-none focus:border-[#2512D9] disabled:bg-[#F4F1FA]"
                placeholder={isReminderCall || isPaymentReminderCall ? 'Customer name' : 'Admin name'}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase text-[#6F687F]">Phone Number</span>
              <input
                value={formData.phoneNumber}
                disabled={isBusy || isConnected}
                onChange={(event) => setFormData((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                className="h-12 w-full rounded-[8px] border border-[#C8C2DD] bg-white px-4 text-sm font-bold text-[#15111F] outline-none focus:border-[#2512D9] disabled:bg-[#F4F1FA]"
                placeholder="+919876543210"
              />
            </label>
          </div>

          {callState.error && (
            <div className="mt-4 flex gap-3 rounded-[8px] border border-[#F3B2B2] bg-[#FFF0F0] p-3 text-[#B41212]">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{callState.error}</p>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {!isConnected ? (
              <button
                type="button"
                disabled={!canStart}
                onClick={startCall}
                className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#2512D9] px-4 text-sm font-black text-white shadow-[0_4px_12px_rgba(47,28,217,0.25)] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
              >
                {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
                {isReminderCall || isPaymentReminderCall ? 'Start Reminder Call' : 'Start Voice Call'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleMicrophone}
                  className="flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#C8C2DD] bg-white px-4 text-sm font-black text-[#211B31]"
                >
                  {callState.microphoneEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  {callState.microphoneEnabled ? 'Mute Mic' : 'Unmute Mic'}
                </button>
                <button
                  type="button"
                  onClick={disconnectRoom}
                  className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#B41212] px-4 text-sm font-black text-white"
                >
                  <PhoneOff size={18} />
                  End Call
                </button>
              </>
            )}
          </div>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-b border-[#D8D3E6] p-5">
            <h2 className="text-2xl font-black">Live Connection</h2>
            <p className="mt-1 text-xs font-bold text-[#6F687F]">Token request, room connection, and agent audio status</p>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3">
            <div className="rounded-[8px] border border-[#D8D3E6] p-4">
              <p className="text-[10px] font-black uppercase text-[#6F687F]">Room</p>
              <p className="mt-2 break-words text-sm font-black text-[#15111F]">{callState.roomName || 'Not connected'}</p>
            </div>
            <div className="rounded-[8px] border border-[#D8D3E6] p-4">
              <p className="text-[10px] font-black uppercase text-[#6F687F]">Identity</p>
              <p className="mt-2 break-words text-sm font-black text-[#15111F]">{callState.identity || 'Pending'}</p>
            </div>
            <div className="rounded-[8px] border border-[#D8D3E6] p-4">
              <p className="text-[10px] font-black uppercase text-[#6F687F]">Remote Participants</p>
              <p className="mt-2 text-3xl font-black leading-none text-[#15111F]">{callState.remoteCount}</p>
            </div>
          </div>

          <div className="px-5 pb-5">
            <div className={`flex min-h-[180px] items-center justify-center rounded-[8px] border border-[#D8D3E6] bg-[#15111F] p-6 text-white ${isConnected ? 'voice-agent-wave-active' : ''}`}>
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <Bot size={34} />
                </div>
                <p className="text-xl font-black">{isConnected ? 'Connected to Shubh' : 'Voice agent standby'}</p>
                <p className="mt-2 text-sm font-bold text-white/70">
                  {isConnected && callState.remoteCount === 0 ? 'Connected to LiveKit. Waiting for agent audio.' : callState.label}
                </p>
                {isConnected && (
                  <div className="mx-auto mt-6 flex h-12 max-w-[220px] items-center justify-center gap-1.5">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span key={index} className="voice-agent-wave-bar h-2 w-1.5 rounded-full bg-[#64D98A]" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#D8D3E6] p-5">
            {timeline.map(({ icon: Icon, title, detail, done }, index) => (
              <div key={title} className="grid grid-cols-[30px_1fr] gap-3">
                <div className="relative grid h-8 w-8 place-items-center rounded-full border border-[#BDB5FF] bg-white">
                  <Icon size={16} className={done ? 'text-[#0C6B39]' : 'text-[#2512D9]'} />
                  {index < timeline.length - 1 && <span className="absolute top-8 h-6 w-px bg-[#D8D3E6]" />}
                </div>
                <div>
                  <p className="text-sm font-black text-[#15111F]">{title}</p>
                  <p className="text-xs font-bold text-[#6F687F]">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </main>
    </div>
  );
};

export default VoiceAgentCall;
