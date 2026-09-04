import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  UserRound,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LocationPickerModal from '../../components/dashboard/LocationPickerModal';
import {
  assignFieldOfficerTask,
  fetchAssignableFieldOfficers,
  fetchFieldOfficerTasks,
} from '../../services/fieldOfficerTaskService';

const STATUS_FILTERS = ['ALL', 'ASSIGNED', 'IN_PROGRESS', 'OVERDUE', 'COMPLETED', 'CANCELLED'];

const STATUS_LABELS = {
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In progress',
  OVERDUE: 'Overdue',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const PRIORITY_LABELS = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
};

const statusVariant = (status) => {
  if (status === 'COMPLETED') return 'green';
  if (status === 'CANCELLED' || status === 'OVERDUE') return 'red';
  if (status === 'IN_PROGRESS') return 'yellow';
  return 'purple';
};

const defaultTimeline = () => {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const createEmptyForm = () => ({
  fieldOfficerId: '',
  title: '',
  description: '',
  timeline: defaultTimeline(),
  priority: 'NORMAL',
  location: null,
});

const formatTimeline = (value) => {
  if (!value) return 'No deadline';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid deadline';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignOpen, setAssignOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [form, setForm] = useState(createEmptyForm);

  const loadData = useCallback(async ({ quiet = false } = {}) => {
    quiet ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const [taskResponse, officerResponse] = await Promise.all([
        fetchFieldOfficerTasks(),
        fetchAssignableFieldOfficers(),
      ]);
      setTasks(taskResponse.data?.tasks || []);
      const nextOfficers = officerResponse.data?.fieldOfficers || [];
      setOfficers(nextOfficers);
      setForm((current) => ({
        ...current,
        fieldOfficerId: current.fieldOfficerId || nextOfficers[0]?.id || '',
      }));
    } catch (requestError) {
      setError(requestError.message || 'Could not load Field Officer tasks.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial page synchronization with the task APIs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
      if (!query) return true;
      return [
        task.title,
        task.description,
        task.location,
        task.assignedTo?.name,
      ].some((value) => String(value || '').toLowerCase().includes(query));
    });
  }, [search, statusFilter, tasks]);

  const summary = useMemo(() => ({
    open: tasks.filter((task) => !['COMPLETED', 'CANCELLED'].includes(task.status)).length,
    overdue: tasks.filter((task) => task.status === 'OVERDUE').length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
  }), [tasks]);

  const closeAssignModal = () => {
    setAssignOpen(false);
    setLocationOpen(false);
    setForm({ ...createEmptyForm(), fieldOfficerId: officers[0]?.id || '' });
  };

  const submitTask = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!form.location) {
      setError('Select the task location on the map before assigning it.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await assignFieldOfficerTask({
        fieldOfficerId: form.fieldOfficerId,
        title: form.title.trim(),
        description: form.description.trim(),
        timeline: new Date(form.timeline).toISOString(),
        priority: form.priority,
        location: form.location.address || `${form.location.latitude}, ${form.location.longitude}`,
        area: form.location.city || '',
        latitude: form.location.latitude,
        longitude: form.location.longitude,
      });
      const createdTask = response.data?.task;
      if (createdTask) setTasks((current) => [createdTask, ...current]);
      setSuccess('Task assigned successfully. It is now available in the Field Officer app.');
      closeAssignModal();
    } catch (requestError) {
      const validationMessage = requestError.errors?.[0]?.message;
      setError(validationMessage || requestError.message || 'Could not assign task.');
    } finally {
      setSubmitting(false);
    }
  };

  const openTaskLocation = (task) => {
    if (task.latitude === null || task.longitude === null) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${task.latitude},${task.longitude}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#F5F6FA] text-gray-900">
      <Header title="Field Officer Tasks" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-800">Field Officer Tasks</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">Assign location-based work and monitor completion from the mobile app.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" icon={RefreshCw} disabled={refreshing} onClick={() => loadData({ quiet: true })}>
                Refresh
              </Button>
              <Button icon={Plus} onClick={() => { setError(''); setAssignOpen(true); }}>Assign task</Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />{success}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Open tasks', value: summary.open, icon: ClipboardList, color: 'text-[#6F4BFF]', bg: 'bg-[#6F4BFF]/10' },
              { label: 'Overdue', value: summary.overdue, icon: CalendarClock, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Completed', value: summary.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}><Icon className="h-5 w-5" /></div>
                <div><p className="text-2xl font-black text-gray-900">{value}</p><p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p></div>
              </Card>
            ))}
          </div>

          <Card noPadding className="overflow-hidden border-gray-100">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, officer, description or location" className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm font-medium outline-none focus:border-[#6F4BFF] focus:ring-2 focus:ring-[#6F4BFF]/20" />
              </div>
              <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 lg:max-w-[60%]">
                {STATUS_FILTERS.map((status) => (
                  <button key={status} onClick={() => setStatusFilter(status)} className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider ${statusFilter === status ? 'bg-[#6F4BFF] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {status === 'ALL' ? 'All' : STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-[#6F4BFF]" /></div>
            ) : visibleTasks.length === 0 ? (
              <div className="py-20 text-center"><ClipboardList className="mx-auto h-9 w-9 text-gray-300" /><p className="mt-3 font-bold text-gray-600">No tasks found</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] table-fixed text-left">
                  <colgroup>
                    <col className="w-[27%]" />
                    <col className="w-[16%]" />
                    <col className="w-[23%]" />
                    <col className="w-[17%]" />
                    <col className="w-[8%]" />
                    <col className="w-[9%]" />
                  </colgroup>
                  <thead><tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-4">Task</th><th className="px-5 py-4">Field Officer</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Deadline</th><th className="px-5 py-4 text-center">Priority</th><th className="px-5 py-4 text-center">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {visibleTasks.map((task) => (
                      <tr key={task.id} className="align-middle hover:bg-gray-50/70">
                        <td className="px-5 py-5"><p className="break-words font-black leading-snug text-gray-900">{task.title}</p><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{task.description || 'No description'}</p></td>
                        <td className="px-5 py-5"><div className="flex min-w-0 items-center gap-2"><UserRound className="h-4 w-4 shrink-0 text-[#6F4BFF]" /><div className="min-w-0"><p className="break-words text-sm font-bold leading-snug text-gray-800">{task.assignedTo?.name || 'Unknown'}</p><p className="mt-1 break-words text-[11px] text-gray-400">{task.assignedTo?.branchName || 'No branch'}</p></div></div></td>
                        <td className="px-5 py-5"><button type="button" onClick={() => openTaskLocation(task)} disabled={task.latitude === null || task.longitude === null} className="flex min-w-0 items-start gap-2 text-left text-xs font-bold leading-relaxed text-[#6F4BFF] disabled:cursor-default disabled:text-gray-400"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-words">{task.location || 'Coordinates unavailable'}</span></button></td>
                        <td className="px-5 py-5 text-xs font-bold leading-relaxed text-gray-600">{formatTimeline(task.timeline)}</td>
                        <td className="px-5 py-5 text-center text-xs font-black text-gray-700">{PRIORITY_LABELS[task.priority] || task.priority}</td>
                        <td className="px-5 py-5 text-center"><Badge variant={statusVariant(task.status)} className="inline-block whitespace-nowrap">{STATUS_LABELS[task.status] || task.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Modal isOpen={assignOpen} onClose={closeAssignModal} title="Assign Field Officer Task" size="lg">
        <form onSubmit={submitTask} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
          <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Field officer</label><select required value={form.fieldOfficerId} onChange={(event) => setForm({ ...form, fieldOfficerId: event.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-bold outline-none focus:border-[#6F4BFF]"><option value="">Select Field Officer</option>{officers.map((officer) => <option key={officer.id} value={officer.id}>{officer.name}{officer.branchName ? ` — ${officer.branchName}` : ''}</option>)}</select></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Task title</label><input required minLength={3} maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Verify the site entrance and access road" className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-bold outline-none focus:border-[#6F4BFF]" /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Description</label><textarea required maxLength={3000} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Explain exactly what the officer must complete" className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium outline-none focus:border-[#6F4BFF]" /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Deadline</label><input required type="datetime-local" min={defaultTimeline()} value={form.timeline} onChange={(event) => setForm({ ...form, timeline: event.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-bold outline-none focus:border-[#6F4BFF]" /></div><div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Priority</label><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-bold outline-none focus:border-[#6F4BFF]"><option value="LOW">Low</option><option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Task location</label><button type="button" onClick={() => setLocationOpen(true)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${form.location ? 'border-[#6F4BFF]/30 bg-[#6F4BFF]/5' : 'border-dashed border-gray-300 bg-gray-50 hover:border-[#6F4BFF]'}`}><MapPin className="h-5 w-5 shrink-0 text-[#6F4BFF]" /><span className="text-sm font-bold text-gray-700">{form.location?.address || (form.location ? `${form.location.latitude}, ${form.location.longitude}` : 'Choose location on map')}</span></button></div>
          <div className="flex justify-end gap-3 pt-2"><Button variant="secondary" onClick={closeAssignModal}>Cancel</Button><Button type="submit" icon={submitting ? Loader2 : Plus} disabled={submitting || !officers.length}>{submitting ? 'Assigning…' : 'Assign task'}</Button></div>
        </form>
      </Modal>

      <LocationPickerModal isOpen={locationOpen} onClose={() => setLocationOpen(false)} title="Select Task Location" initial={form.location} onConfirm={(location) => { setForm((current) => ({ ...current, location })); setLocationOpen(false); }} />
    </div>
  );
};

export default Tasks;
