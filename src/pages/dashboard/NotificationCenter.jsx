import { useMemo, useState } from 'react';
import {
    BellRing,
    CheckCircle2,
    Clock3,
    Copy,
  Layers3,
  MessageSquareText,
    Radio,
    ReceiptText,
    Send,
    ShieldCheck,
    Smartphone,
    Users,
} from 'lucide-react';
import Header from '../../components/layout/Header';

const appTargets = [
    {
        key: 'user_app',
        name: 'User App',
        projectId: 'squarft-user',
        audience: 'Customers',
        tokens: 18420,
        active: 16880,
        channelId: 'customer-offers',
        defaultRoute: '/(tabs)/home',
        color: '#2717D7',
    },
    {
        key: 'sales_officer',
        name: 'Sales Officer App',
        projectId: 'sales_officer',
        audience: 'Sales officers',
        tokens: 164,
        active: 151,
        channelId: 'sales-ops',
        defaultRoute: '/(tabs)/leads',
        color: '#04622E',
    },
    {
        key: 'broker_app',
        name: 'Broker App',
        projectId: 'squarft-broker',
        audience: 'Brokers',
        tokens: 2140,
        active: 1986,
        channelId: 'broker-updates',
        defaultRoute: '/(tabs)/inventory',
        color: '#8D3106',
    },
    {
        key: 'project_panel',
        name: 'Project Panel App',
        projectId: 'squarft-project-panel',
        audience: 'Builders',
        tokens: 82,
        active: 74,
        channelId: 'project-panel',
        defaultRoute: '/(tabs)/home',
        color: '#173141',
    },
    {
        key: 'field_officer',
        name: 'Field Officer App',
        projectId: 'squarft-field-officer',
        audience: 'Field officers',
        tokens: 96,
        active: 88,
        channelId: 'field-ops',
        defaultRoute: '/(tabs)/projects',
        color: '#A15A00',
    },
];

const campaignTemplates = [
    {
        key: 'offer',
        label: 'Offer blast',
        title: 'New properties are live',
        body: 'Fresh verified inventory is available in your area. Tap to explore now.',
        categoryId: 'marketing',
    },
    {
        key: 'ops',
        label: 'Ops alert',
        title: 'Action required today',
        body: 'You have pending tasks that need attention before end of day.',
        categoryId: 'operations',
    },
    {
        key: 'kyc',
        label: 'KYC reminder',
        title: 'KYC documents pending',
        body: 'Please upload the remaining documents to keep your account active.',
        categoryId: 'verification',
    },
];

const initialForm = {
    title: campaignTemplates[0].title,
    body: campaignTemplates[0].body,
    priority: 'high',
    ttlHours: '24',
    sound: 'default',
    categoryId: campaignTemplates[0].categoryId,
    collapseId: 'campaign-properties-live',
    imageUrl: '',
    route: '/(tabs)/home',
    extraData: '{\n  "campaignId": "properties-live-001",\n  "source": "admin_custom_notification"\n}',
};

const getTargetMessage = (target, form) => {
    const ttl = Math.max(0, Number(form.ttlHours || 0)) * 60 * 60;
    let parsedData = {};

    try {
        parsedData = JSON.parse(form.extraData || '{}');
    } catch {
        parsedData = { invalidJson: true };
    }

    return {
        to: [`ExponentPushToken[${target.projectId}-sample-token-1]`, `ExponentPushToken[${target.projectId}-sample-token-2]`],
        title: form.title,
        body: form.body,
        sound: form.sound || 'default',
        priority: form.priority,
        ttl,
        channelId: target.channelId,
        categoryId: form.categoryId || undefined,
        collapseId: form.collapseId || undefined,
        richContent: form.imageUrl ? { image: form.imageUrl } : undefined,
        data: {
            app: target.key,
            projectId: target.projectId,
            route: form.route || target.defaultRoute,
            ...parsedData,
        },
    };
};

const NotificationCenter = () => {
    const [selectedApps, setSelectedApps] = useState(appTargets.map((app) => app.key));
    const [form, setForm] = useState(initialForm);
    const [sendLog, setSendLog] = useState([]);

    const selectedTargets = useMemo(
        () => appTargets.filter((app) => selectedApps.includes(app.key)),
        [selectedApps],
    );

    const totalActiveTokens = selectedTargets.reduce((sum, app) => sum + app.active, 0);
    const batchCount = Math.max(1, Math.ceil(totalActiveTokens / 100));
    const payloadPreview = selectedTargets.map((target) => getTargetMessage(target, form));
    const hasInvalidJson = payloadPreview.some((message) => message.data.invalidJson);

    const toggleApp = (key) => {
        setSelectedApps((current) => (
            current.includes(key)
                ? current.filter((item) => item !== key)
                : [...current, key]
        ));
    };

    const applyTemplate = (template) => {
        setForm((current) => ({
            ...current,
            title: template.title,
            body: template.body,
            categoryId: template.categoryId,
        }));
    };

    const handleSendSimulation = () => {
        if (!selectedTargets.length || !form.title.trim() || !form.body.trim() || hasInvalidJson) return;

        setSendLog((current) => [
            {
                id: `NTF-${String(current.length + 1).padStart(3, '0')}`,
                title: form.title,
                apps: selectedTargets.map((app) => app.name).join(', '),
                tokens: totalActiveTokens,
                batches: batchCount,
                status: 'Ready for backend send',
                createdAt: new Date().toLocaleString('en-IN'),
            },
            ...current,
        ]);
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Custom Notifications" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1600px] space-y-5">
                    <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-[#E8E4FF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Expo push service aligned</span>
                                    <span className="rounded-full bg-[#E9F8EF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#04622E]">Admin + Super admin</span>
                                </div>
                                <h2 className="mt-3 text-2xl font-black text-[#171327]">Send custom notifications to every SquarFT app</h2>
                                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-[#615C71]">
                                    Compose campaign-style push notifications, target one or more apps, preview the Expo message payload, and hand it to the backend sender.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
                                <MetricTile icon={Smartphone} label="Apps" value={selectedTargets.length} />
                                <MetricTile icon={Users} label="Tokens" value={totalActiveTokens.toLocaleString('en-IN')} />
                                <MetricTile icon={Layers3} label="Batches" value={batchCount} />
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
                        <section className="space-y-5">
                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <SectionHeader icon={Radio} title="Target apps" helper="Each selected app maps to its own Expo project, channel, and route metadata." />
                                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {appTargets.map((app) => {
                                        const selected = selectedApps.includes(app.key);
                                        return (
                                            <button
                                                key={app.key}
                                                type="button"
                                                onClick={() => toggleApp(app.key)}
                                                className={`rounded-[10px] border p-4 text-left transition-all ${selected ? 'border-[#2717D7] bg-[#F4F1FF] shadow-sm' : 'border-[#E1DDF0] bg-[#FCFBFF] hover:border-[#2717D7]'}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-black text-[#171327]">{app.name}</p>
                                                        <p className="mt-1 text-xs font-medium text-[#615C71]">{app.audience}</p>
                                                    </div>
                                                    <span className="grid h-8 w-8 place-items-center rounded-[8px] text-white" style={{ backgroundColor: app.color }}>
                                                        {selected ? <CheckCircle2 size={16} /> : <BellRing size={16} />}
                                                    </span>
                                                </div>
                                                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                                                    <MiniStat label="Active" value={app.active.toLocaleString('en-IN')} />
                                                    <MiniStat label="Channel" value={app.channelId} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <SectionHeader icon={MessageSquareText} title="Notification content" helper="Keep title and body short so Android and iOS notification trays display cleanly." />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {campaignTemplates.map((template) => (
                                        <button
                                            key={template.key}
                                            type="button"
                                            onClick={() => applyTemplate(template)}
                                            className="rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#514B63] hover:border-[#2717D7] hover:text-[#2717D7]"
                                        >
                                            {template.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    <Field label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
                                    <Field label="Category ID" value={form.categoryId} onChange={(value) => setForm({ ...form, categoryId: value })} />
                                    <label className="block md:col-span-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">Body</span>
                                        <textarea
                                            value={form.body}
                                            onChange={(event) => setForm({ ...form, body: event.target.value })}
                                            rows={4}
                                            className="mt-1 w-full rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                                        />
                                    </label>
                                    <Field label="Deep link route" value={form.route} onChange={(value) => setForm({ ...form, route: value })} />
                                    <Field label="Rich image URL" value={form.imageUrl} onChange={(value) => setForm({ ...form, imageUrl: value })} placeholder="https://..." />
                                </div>
                            </div>

                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <SectionHeader icon={ShieldCheck} title="Expo delivery options" helper="These fields line up with Expo push message fields and should be sent server-side." />
                                <div className="mt-4 grid gap-4 md:grid-cols-3">
                                    <SelectField label="Priority" value={form.priority} onChange={(value) => setForm({ ...form, priority: value })} options={['default', 'normal', 'high']} />
                                    <SelectField label="Sound" value={form.sound} onChange={(value) => setForm({ ...form, sound: value })} options={['default', '']} />
                                    <Field label="TTL hours" value={form.ttlHours} onChange={(value) => setForm({ ...form, ttlHours: value })} />
                                    <Field label="Collapse ID" value={form.collapseId} onChange={(value) => setForm({ ...form, collapseId: value })} />
                                    <div className="md:col-span-2">
                                        <label className="block">
                                            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">Data JSON</span>
                                            <textarea
                                                value={form.extraData}
                                                onChange={(event) => setForm({ ...form, extraData: event.target.value })}
                                                rows={5}
                                                className={`mt-1 w-full rounded-[8px] border bg-[#FCFBFF] px-3 py-3 font-mono text-xs outline-none focus:ring-2 ${hasInvalidJson ? 'border-[#B41212] focus:ring-[#B41212]/20' : 'border-[#D8D2EB] focus:ring-[#2717D7]/20'}`}
                                            />
                                        </label>
                                        {hasInvalidJson && <p className="mt-2 text-xs font-black text-[#B41212]">Data JSON is invalid. Fix this before sending.</p>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <aside className="space-y-5">
                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <SectionHeader icon={Smartphone} title="Phone preview" helper="Approximate notification tray view" />
                                <div className="mx-auto mt-5 max-w-[320px] rounded-[28px] border border-[#D8D2EB] bg-[#171327] p-3 shadow-xl">
                                    <div className="rounded-[22px] bg-[#F4F1FF] p-4">
                                        <div className="rounded-[16px] bg-white p-4 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#2717D7] text-white"><BellRing size={16} /></span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-black text-[#171327]">SquarFT</p>
                                                    <p className="text-[10px] font-medium text-[#7B7486]">now</p>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm font-black text-[#171327]">{form.title || 'Notification title'}</p>
                                            <p className="mt-1 text-xs font-medium leading-5 text-[#514B63]">{form.body || 'Notification body'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                                <SectionHeader icon={Copy} title="Expo payload preview" helper="Backend should chunk real tokens into arrays of 100 messages per request." />
                                <pre className="mt-4 max-h-[360px] overflow-auto rounded-[8px] bg-[#171327] p-4 text-[11px] leading-5 text-white">
                                    {JSON.stringify(payloadPreview, null, 2)}
                                </pre>
                                <button
                                    type="button"
                                    onClick={handleSendSimulation}
                                    disabled={!selectedTargets.length || !form.title.trim() || !form.body.trim() || hasInvalidJson}
                                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2717D7] px-4 text-xs font-black uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:bg-[#C8C2E8]"
                                >
                                    <Send size={16} /> Queue notification
                                </button>
                            </div>
                        </aside>
                    </div>

                    <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                        <SectionHeader icon={ReceiptText} title="Send log" helper="Tracks queued admin campaigns and the Expo receipt follow-up your backend should complete." />
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead className="bg-[#F4F1FF] text-[10px] font-black uppercase tracking-[0.12em] text-[#2A2535]">
                                    <tr>
                                        <th className="px-4 py-3">Campaign</th>
                                        <th className="px-4 py-3">Apps</th>
                                        <th className="px-4 py-3">Tokens</th>
                                        <th className="px-4 py-3">Expo batches</th>
                                        <th className="px-4 py-3">Receipt status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(sendLog.length ? sendLog : seedSendLog).map((item) => (
                                        <tr key={item.id} className="border-t border-[#E1DDF0]">
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-black text-[#171327]">{item.title}</p>
                                                <p className="text-[10px] font-medium text-[#615C71]">{item.id} / {item.createdAt}</p>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-[#514B63]">{item.apps}</td>
                                            <td className="px-4 py-4 text-sm font-black text-[#171327]">{item.tokens.toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-4 text-sm font-black text-[#2717D7]">{item.batches}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF7E6] px-3 py-1.5 text-[10px] font-black uppercase text-[#A15A00]">
                                                    <Clock3 size={13} /> {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const seedSendLog = [
    {
        id: 'NTF-000',
        title: 'Weekend inventory reminder',
        apps: 'User App, Broker App',
        tokens: 18866,
        batches: 189,
        status: 'Receipt check pending',
        createdAt: '14/06/2026, 10:15:00',
    },
];

const MetricTile = ({ icon: Icon, label, value }) => (
    <div className="rounded-[10px] border border-[#D8D2EB] bg-[#FCFBFF] p-3">
        <Icon className="h-4 w-4 text-[#2717D7]" />
        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        <p className="mt-1 text-lg font-black text-[#171327]">{value}</p>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div className="min-w-0 rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className="mt-1 truncate text-[10px] font-black text-[#171327]">{value}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, helper }) => (
    <div className="flex items-start justify-between gap-4 border-b border-[#E1DDF0] pb-4">
        <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">{title}</p>
            <p className="mt-1 text-sm font-medium text-[#615C71]">{helper}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={19} />
        </div>
    </div>
);

const Field = ({ label, value, onChange, placeholder }) => (
    <label className="block">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">{label}</span>
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="mt-1 h-11 w-full rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2717D7]/20"
        />
    </label>
);

const SelectField = ({ label, value, onChange, options }) => (
    <label className="block">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">{label}</span>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-1 h-11 w-full rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
        >
            {options.map((option) => (
                <option key={option || 'none'} value={option}>{option || 'none'}</option>
            ))}
        </select>
    </label>
);

export default NotificationCenter;
