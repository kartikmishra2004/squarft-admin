import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Battery,
    Bell,
    Building2,
    CheckCircle2,
    ClipboardList,
    FileCheck,
    FileText,
    Gauge,
    Globe2,
    Home,
    Image as ImageIcon,
    IndianRupee,
    Landmark,
    Layers3,
    LocateFixed,
    MapPin,
    MoreVertical,
    Phone,
    Plus,
    Radar,
    RefreshCcw,
    Route,
    Search,
    ShieldCheck,
    Siren,
    Upload,
    UserCheck,
    XCircle,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { fieldOfficerWorkflowData, panelOverviewByStatus, panelWorkflowByStatus, projectPanelFormSubmissionSample, projectPanelProjects } from '../../data/mockData';
import { addTask, updateTaskStatus } from '../../store/tasksSlice';

const statusOrder = ['draft', 'submitted', 'adminApproved', 'live'];
const workflowOrder = ['fieldOfficer', 'projectPanel'];
const kycDocumentFields = [
    { key: 'companyLogo', title: 'Company Logo', icon: ImageIcon },
    { key: 'reraCertificate', title: 'RERA Certificate', icon: FileCheck },
    { key: 'gstPan', title: 'GST & PAN', icon: FileCheck },
];

const formatNumber = (value) => {
    if (value < 1000) return String(value).padStart(2, '0');
    return value.toLocaleString('en-IN');
};

const PanelMetricCard = ({ metric }) => (
    <section className="rounded-[8px] border border-[#D8D2EB] bg-white px-5 py-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#5E5A71]">{metric.title}</p>
        <div className="mt-2 flex items-center gap-2">
            <p className="text-[21px] font-black leading-none tracking-normal" style={{ color: metric.color }}>
                {formatNumber(metric.value)}
            </p>
            <span className="rounded-full bg-[#F4F1FF] px-2 py-0.5 text-[8px] font-black text-[#6E6790]">
                {metric.change}
            </span>
        </div>
        <div className="mt-4 h-[3px] rounded-full bg-[#EFEAF8]">
            <div
                className="h-full rounded-full"
                style={{ width: `${metric.progress}%`, backgroundColor: metric.color }}
            />
        </div>
    </section>
);

const StageStepper = ({ stages, activeStage, onSelectStage }) => (
    <div className="overflow-x-auto pb-1">
        <div className="grid min-w-[760px] grid-cols-5 gap-0">
            {stages.map((stage, index) => {
                const isActive = activeStage?.title === stage.title;
                const isApprovedStage = stage.title === 'Approved';
                return (
                    <button
                        key={stage.title}
                        type="button"
                        onClick={() => {
                            if (!isApprovedStage) {
                                onSelectStage(stage.title);
                            }
                        }}
                        disabled={isApprovedStage}
                        className={`group relative px-2 py-2 text-left ${isApprovedStage ? 'cursor-default' : ''}`}
                    >
                        {index < stages.length - 1 && (
                            <span className={`absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-7 h-0.5 ${isActive ? 'bg-[#2717D7]' : 'bg-[#D8D2EB]'}`} />
                        )}
                        <span className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border text-xs font-black transition-all ${
                            isActive
                                ? 'border-[#2717D7] bg-[#2717D7] text-white shadow-[0_8px_18px_rgba(39,23,215,0.2)]'
                                : 'border-[#D8D2EB] bg-white text-[#5E5A71] group-hover:border-[#2717D7] group-hover:text-[#2717D7]'
                        }`}>
                            {index + 1}
                        </span>
                        <span className="mt-3 block text-xs font-black text-[#171327]">{stage.title}</span>
                        <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.1em] text-[#6B657A]">
                            {formatNumber(stage.count)} / {stage.status}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);

const StageDetails = ({ stage }) => (
    <div className="rounded-[10px] border border-[#D8D2EB] bg-[#FCFBFF] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">Stage details</p>
                <h3 className="mt-2 text-2xl font-black text-[#171327]">{stage.title}</h3>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#514B63]">{stage.note}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-56">
                <div className="rounded-[8px] border border-[#E1DDF0] bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7B7486]">Items</p>
                    <p className="mt-1 text-2xl font-black text-[#2717D7]">{formatNumber(stage.count)}</p>
                </div>
                <div className="rounded-[8px] border border-[#E1DDF0] bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7B7486]">Status</p>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.1em] text-[#171327]">{stage.status}</p>
                </div>
            </div>
        </div>

        {stage.subStages?.length > 0 && (
            <div className="mt-5 border-t border-[#E1DDF0] pt-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">Sub stages</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {stage.subStages.map((subStage, index) => (
                        <div key={subStage} className="flex items-center gap-3 rounded-[8px] border border-[#E1DDF0] bg-white p-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F0EDFF] text-xs font-black text-[#2717D7]">{index + 1}</span>
                            <span className="text-sm font-black text-[#171327]">{subStage}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const mergeProjectReviewState = (project, override = {}) => ({
    ...project,
    ...override,
    builder: {
        ...project.builder,
        ...(override.builder || {}),
    },
    documents: {
        ...(project.documents || {}),
        ...(override.documents || {}),
    },
});

const getKycTone = (status) => {
    if (status === 'Approved') return 'bg-[#E9F8EF] text-[#04622E] border-[#BFE8CE]';
    if (status === 'Rejected') return 'bg-[#FFF0F0] text-[#B41212] border-[#FFD0D0]';
    if (status === 'Submitted') return 'bg-[#F4F1FF] text-[#2717D7] border-[#D8D2EB]';
    return 'bg-[#FFF7E6] text-[#A15A00] border-[#F2DCA8]';
};

const ProjectStatusFilters = ({ activeStatus, projects = projectPanelProjects, onStatusChange }) => (
    <div className="flex flex-wrap gap-2">
        {statusOrder.map((status) => {
            const isActive = activeStatus === status;
            const tab = panelOverviewByStatus[status];
            const count = projects.filter((project) => project.statusBucket === status).length;

            return (
                <button
                    key={status}
                    type="button"
                    onClick={() => onStatusChange(status)}
                    className={`h-10 rounded-[8px] border px-4 text-xs font-black uppercase tracking-[0.12em] transition-all focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/25 ${
                        isActive
                            ? 'border-[#2717D7] bg-[#2717D7] text-white shadow-[0_8px_18px_rgba(39,23,215,0.16)]'
                            : 'border-[#D8D2EB] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7]'
                    }`}
                >
                    {tab.label} <span className={isActive ? 'text-white/80' : 'text-[#A49DB8]'}>{count}</span>
                </button>
            );
        })}
    </div>
);

const ProjectPanelPropertyCards = ({ activeStatus, projects, allProjects, selectedProject, onStatusChange, onSelectProject }) => (
    <section className="rounded-[10px] border border-[#D8D2EB] bg-[#FBFAFF] p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">Project Panel Properties</p>
                <p className="mt-1 text-sm font-medium text-[#615C71]">Filter by status, then open a property card for KYC and onboarding review.</p>
            </div>
            <ProjectStatusFilters activeStatus={activeStatus} projects={allProjects} onStatusChange={onStatusChange} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                const approvedDocuments = kycDocumentFields.filter((field) => project.documents?.[field.key]?.status === 'Approved').length;

                return (
                    <button
                        key={project.id}
                        type="button"
                        onClick={() => onSelectProject(project.id)}
                        className={`min-h-[168px] rounded-[10px] border p-4 text-left transition-all ${
                            isSelected
                                ? 'border-[#2717D7] bg-white shadow-[0_10px_24px_rgba(39,23,215,0.12)]'
                                : 'border-[#E1DDF0] bg-white hover:border-[#2717D7] hover:shadow-sm'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-base font-black text-[#171327]">{project.projectName}</p>
                                <p className="mt-1 truncate text-xs font-medium text-[#615C71]">{project.projectType}</p>
                            </div>
                            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.1em] ${getKycTone(project.kycStatus)}`}>
                                {project.kycStatus}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#615C71]">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2717D7]" />
                            <span className="truncate">{project.projectLocation}</span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <MiniValue label="Progress" value={`${project.progress}%`} />
                            <MiniValue label="Docs" value={`${approvedDocuments}/${kycDocumentFields.length}`} />
                            <MiniValue label="ID" value={project.id} />
                        </div>

                        <div className="mt-4 h-1.5 rounded-full bg-[#EFEAF8]">
                            <div className="h-full rounded-full bg-[#2717D7]" style={{ width: `${project.progress}%` }} />
                        </div>
                    </button>
                );
            })}
        </div>
    </section>
);

const ProjectPanelKycReview = ({ project, onAccountStatus, onDocumentStatus }) => {
    const approvedDocuments = kycDocumentFields.filter((field) => project.documents?.[field.key]?.status === 'Approved').length;
    const uploadedDocuments = kycDocumentFields.filter((field) => Boolean(project.documents?.[field.key])).length;

    return (
        <div className="space-y-4 rounded-[10px] border border-[#D8D2EB] bg-[#FBFAFF] p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#E8E4FF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Project Panel KYC</span>
                        <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${getKycTone(project.kycStatus)}`}>{project.kycStatus}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-[#171327]">{project.projectName}</h3>
                    <p className="mt-1 text-sm font-medium text-[#615C71]">{project.projectType} / {project.projectLocation} / Submitted {project.submittedAt}</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-end gap-2">
                        {project.kycStatus !== 'Approved' && (
                            <button
                                type="button"
                                onClick={() => onAccountStatus(project.id, 'Approved')}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#04622E] px-4 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(4,98,46,0.16)]"
                            >
                                <CheckCircle2 size={16} /> Approve KYC
                            </button>
                        )}
                        {project.kycStatus !== 'Rejected' && (
                            <button
                                type="button"
                                onClick={() => onAccountStatus(project.id, 'Rejected')}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#B41212] px-4 text-xs font-black uppercase tracking-[0.12em] text-white"
                            >
                                <XCircle size={16} /> Reject
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                    <div className="flex items-center justify-between gap-4 border-b border-[#E1DDF0] pb-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">Builder details</p>
                            <h4 className="mt-1 text-xl font-black text-[#171327]">{project.builder.companyName}</h4>
                        </div>
                        <div className="grid h-12 w-12 place-items-center rounded-[10px] bg-[#F0EDFF] text-[#2717D7]">
                            <Building2 size={22} />
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <BuilderDetail icon={UserCheck} label="Owner / Contact" value={project.builder.fullName} helper={project.builder.companyType} />
                        <BuilderDetail icon={Phone} label="Phone" value={project.builder.phone} helper={project.builder.location} />
                        <BuilderDetail icon={ShieldCheck} label="RERA Number" value={project.builder.reraNumber} helper={project.builder.builderType} />
                        <BuilderDetail icon={Landmark} label="GST / PAN" value={project.builder.gstNumber} helper={project.builder.panNumber} />
                        <BuilderDetail icon={Globe2} label="Brand / Website" value={project.builder.brandName} helper={project.builder.website} />
                        <BuilderDetail icon={UserCheck} label="Admin mapping" value={project.builder.relationshipManager} helper={`Sales: ${project.builder.salesManager}`} />
                    </div>

                    <div className="mt-5 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7B7486]">About builder</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-[#514B63]">{project.builder.about}</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em]">
                            <span className="rounded-full bg-white px-3 py-1.5 text-[#2717D7] ring-1 ring-[#E1DDF0]">Established {project.builder.establishedYear}</span>
                            <span className="rounded-full bg-white px-3 py-1.5 text-[#514B63] ring-1 ring-[#E1DDF0]">{project.builder.onboardingSource}</span>
                            <span className="rounded-full bg-white px-3 py-1.5 text-[#514B63] ring-1 ring-[#E1DDF0]">Progress {project.progress}%</span>
                        </div>
                    </div>
                </section>

                <aside className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">KYC summary</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-[8px] bg-[#F4F1FF] p-4">
                            <p className="text-[10px] font-black uppercase text-[#7B7486]">Uploaded</p>
                            <p className="mt-1 text-2xl font-black text-[#2717D7]">{uploadedDocuments}/{kycDocumentFields.length}</p>
                        </div>
                        <div className="rounded-[8px] bg-[#E9F8EF] p-4">
                            <p className="text-[10px] font-black uppercase text-[#67806F]">Approved</p>
                            <p className="mt-1 text-2xl font-black text-[#04622E]">{approvedDocuments}</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        {project.checklist.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
                                <span className={`grid h-7 w-7 place-items-center rounded-full ${item.done ? 'bg-[#E9F8EF] text-[#04622E]' : 'bg-[#FFF7E6] text-[#A15A00]'}`}>
                                    {item.done ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                                </span>
                                <p className="text-xs font-black text-[#171327]">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            <section className="rounded-[10px] border border-[#D8D2EB] bg-white">
                <div className="flex flex-col gap-2 border-b border-[#E1DDF0] p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 className="font-black text-[#171327]">KYC Documents & Verification</h4>
                        <p className="text-xs font-medium text-[#615C71]">Mirrors dashboard/users approval flow for each project-panel registration.</p>
                    </div>
                    {project.kycStatus === 'Approved' && (
                        <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#E9F8EF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#04622E]">
                            <CheckCircle2 size={14} /> Builder KYC cleared
                        </span>
                    )}
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-3">
                    {kycDocumentFields.map((field) => (
                        <KycDocumentCard
                            key={field.key}
                            field={field}
                            document={project.documents?.[field.key]}
                            onApprove={() => onDocumentStatus(project.id, field.key, 'Approved')}
                            onReject={() => onDocumentStatus(project.id, field.key, 'Rejected')}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

const BuilderDetail = ({ icon: Icon, label, value, helper }) => (
    <div className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
        <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[#2717D7]" />
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        </div>
        <p className="mt-2 truncate text-sm font-black text-[#171327]">{value || '-'}</p>
        <p className="mt-1 truncate text-[11px] font-medium text-[#615C71]">{helper || '-'}</p>
    </div>
);

const KycDocumentCard = ({ field, document, onApprove, onReject }) => {
    const Icon = field.icon;
    const status = document?.status || 'Missing';

    return (
        <article className="overflow-hidden rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF]">
            <div className="flex items-center justify-between border-b border-[#E1DDF0] bg-white p-4">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#2717D7]" />
                    <h5 className="text-[10px] font-black uppercase tracking-[0.12em] text-[#171327]">{field.title}</h5>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.1em] ${getKycTone(status)}`}>{status}</span>
            </div>
            <div className="grid aspect-[4/3] place-items-center bg-[#F4F1FF] p-5 text-center">
                <div>
                    <Upload className="mx-auto h-10 w-10 text-[#A49DB8]" />
                    <p className="mt-3 break-words text-sm font-black text-[#171327]">{document?.fileName || 'No document uploaded'}</p>
                    <p className="mt-1 text-[10px] font-medium text-[#615C71]">{document?.uploadedAt || 'Waiting for builder upload'}</p>
                    {document?.approvedAt && <p className="mt-1 text-[10px] font-black text-[#04622E]">Approved {document.approvedAt}</p>}
                </div>
            </div>
            <div className="flex gap-2 border-t border-[#E1DDF0] bg-white p-3">
                {document && status !== 'Approved' && (
                    <button type="button" onClick={onApprove} className="flex-1 rounded-[8px] bg-[#E9F8EF] px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#04622E]">
                        Approve
                    </button>
                )}
                {document && status !== 'Rejected' && (
                    <button type="button" onClick={onReject} className="flex-1 rounded-[8px] bg-[#FFF0F0] px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#B41212]">
                        Reject
                    </button>
                )}
                {!document && (
                    <span className="w-full rounded-[8px] border border-dashed border-[#D8D2EB] px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.1em] text-[#7B7486]">
                        Upload required
                    </span>
                )}
            </div>
        </article>
    );
};

const ProjectPanelFormReview = ({ project, submission }) => {
    const totalUnits = submission.propertyTypes.reduce((sum, item) => sum + item.units, 0);
    const totalConfigs = submission.propertyDetails.reduce((sum, item) => sum + item.configurations.length, 0);
    const uploadedAssets = submission.mediaAndPrice.images.length + submission.mediaAndPrice.videos.length + submission.mediaAndPrice.documents.length;

    return (
        <div className="space-y-4 rounded-[10px] border border-[#D8D2EB] bg-[#FBFAFF] p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#E8E4FF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Onboarding form data</span>
                        <span className="rounded-full border border-[#D8D2EB] bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#514B63]">{submission.reviewStatus}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-[#171327]">{submission.basicDetails.projectName}</h3>
                    <p className="mt-1 text-sm font-medium text-[#615C71]">
                        Sample dummy payload for {project.projectName}. API can replace this object later.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
                    <ReviewMetric icon={Home} label="Property types" value={submission.propertyTypes.length} />
                    <ReviewMetric icon={Layers3} label="Total units" value={formatNumber(totalUnits)} />
                    <ReviewMetric icon={FileText} label="Uploads" value={uploadedAssets} />
                </div>
            </div>

            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                <SectionTitle icon={ClipboardList} title="Basic Details" helper={`Submitted by ${submission.submittedBy} / ${submission.submittedAt}`} />
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {Object.entries({
                        'Project Name': submission.basicDetails.projectName,
                        Location: submission.basicDetails.location,
                        City: submission.basicDetails.city,
                        State: submission.basicDetails.state,
                        Pincode: submission.basicDetails.pincode,
                        'Sales Officer': submission.basicDetails.salesOfficerName,
                        'Sales Contact': submission.basicDetails.salesOfficerContact,
                        'Responsible Person': submission.basicDetails.responsiblePersonName,
                        'Responsible Contact': submission.basicDetails.responsiblePersonContact,
                    }).map(([label, value]) => (
                        <DataPill key={label} label={label} value={value} />
                    ))}
                </div>
            </section>

            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                <SectionTitle icon={Home} title="Property Type" helper="All property subtypes selected in the project-panel form" />
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {submission.propertyTypes.map((type) => (
                        <article key={type.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{type.mainType}</p>
                                    <h4 className="mt-1 text-base font-black text-[#171327]">{type.subType}</h4>
                                </div>
                                <span className="rounded-full bg-[#F0EDFF] px-3 py-1 text-xs font-black text-[#2717D7]">{type.units}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                                <div className="rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
                                    <p className="text-[9px] font-black uppercase text-[#8B8498]">Sections</p>
                                    <p className="mt-1 text-xs font-black text-[#171327]">{type.sections}</p>
                                </div>
                                <div className="rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
                                    <p className="text-[9px] font-black uppercase text-[#8B8498]">Mode</p>
                                    <p className="mt-1 truncate text-xs font-black text-[#171327]">{type.uploadMode}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                <SectionTitle icon={Layers3} title="Property Detail" helper={`${totalConfigs} configurations with sample mapped units`} />
                <div className="mt-4 space-y-4">
                    {submission.propertyDetails.map((detail) => (
                        <article key={detail.typeId} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h4 className="text-lg font-black text-[#171327]">{detail.title}</h4>
                                    <p className="text-xs font-medium text-[#615C71]">{detail.layout}</p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#2717D7] ring-1 ring-[#D8D2EB]">
                                    {detail.configurations.length} configs
                                </span>
                            </div>
                            <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_360px]">
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {detail.configurations.map((config) => (
                                        <div key={config.name} className="rounded-[8px] border border-[#E1DDF0] bg-white p-3">
                                            <p className="text-sm font-black text-[#171327]">{config.name}</p>
                                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                                <MiniValue label="Area" value={config.area} />
                                                <MiniValue label="Price" value={`Rs. ${config.price}`} />
                                                <MiniValue label="Units" value={config.mappedUnits} />
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {config.amenities.map((amenity) => (
                                                    <span key={amenity} className="rounded-full bg-[#F4F1FF] px-2 py-1 text-[9px] font-black text-[#514B63]">{amenity}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-[8px] border border-[#E1DDF0] bg-white">
                                    <div className="border-b border-[#E1DDF0] px-3 py-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7B7486]">Sample units</p>
                                    </div>
                                    <div className="divide-y divide-[#E1DDF0]">
                                        {detail.sampleUnits.map((unit) => (
                                            <div key={unit.propertyNumber} className="grid grid-cols-[1fr_auto] gap-3 px-3 py-3">
                                                <div>
                                                    <p className="text-xs font-black text-[#171327]">{unit.propertyNumber}</p>
                                                    <p className="text-[10px] font-medium text-[#615C71]">{unit.section} / {unit.floor ? `Floor ${unit.floor}` : `Row ${unit.row}`}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-[#2717D7]">{unit.area}</p>
                                                    <p className="text-[10px] font-medium text-[#615C71]">Rs. {unit.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-2">
                <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                    <SectionTitle icon={ShieldCheck} title="Approvals" helper={submission.approvals.overallApprovalStatus} />
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <DataPill label="Possession Status" value={submission.approvals.possessionStatus} />
                        <DataPill label="Expected Possession" value={submission.approvals.expectedPossessionDate} />
                        <DataPill label="Launch Status" value={submission.approvals.projectLaunchStatus} />
                        <DataPill label="Expected Launch" value={submission.approvals.expectedLaunchDate} />
                        <DataPill label="Development" value={`${submission.approvals.developmentCompletionPercentage}%`} />
                        <DataPill label="Current Stage" value={submission.approvals.currentDevelopmentStage.join(', ')} />
                    </div>
                    <div className="mt-4 space-y-2">
                        {submission.approvals.items.map((item) => (
                            <div key={item.title} className="flex items-center justify-between gap-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
                                <div>
                                    <p className="text-xs font-black text-[#171327]">{item.title}</p>
                                    <p className="text-[10px] font-medium text-[#615C71]">{item.reference || `Expected in ${item.expectedTime}`} / {item.documents} docs</p>
                                </div>
                                <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${item.status === 'Yes' ? 'bg-[#E9F8EF] text-[#04622E]' : 'bg-[#FFF7E6] text-[#A15A00]'}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                    <SectionTitle icon={IndianRupee} title="Finance & Ownership" helper={submission.finance.financialOwnershipRemarks} />
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <DataPill label="Guideline Value" value={`${submission.finance.guidelineValueAmount} ${submission.finance.guidelineValueUnit}`} />
                        <DataPill label="Jurisdiction" value={submission.finance.propertyJurisdictionArea} />
                        <DataPill label="Registry Charges" value={`${submission.finance.registryChargesMaleBuyer} / ${submission.finance.registryChargesFemaleBuyer}`} />
                        <DataPill label="Loan Available" value={submission.finance.loanAvailable} />
                        <DataPill label="Bank Tie-ups" value={submission.finance.tieUpBankName} />
                        <DataPill label="Max Loan" value={submission.finance.maximumLoanPercentage} />
                        <DataPill label="Ownership" value={submission.finance.ownershipType} />
                        <DataPill label="JV Parties" value={`${submission.finance.jvLandOwnerName} / ${submission.finance.jvDeveloperBuilderName}`} />
                        <DataPill label="Title Verification" value={submission.finance.titleVerificationStatus} />
                        <DataPill label="Expected Title Date" value={submission.finance.titleExpectedCompletionDate} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {submission.finance.documents.map((doc) => (
                            <span key={doc} className="rounded-full bg-[#F4F1FF] px-3 py-1.5 text-[10px] font-black text-[#2717D7]">{doc}</span>
                        ))}
                    </div>
                </section>
            </div>

            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
                <SectionTitle icon={ImageIcon} title="Image & Price" helper={submission.mediaAndPrice.agreed ? 'Final declaration accepted by builder' : 'Declaration pending'} />
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <AssetList title="Images" items={submission.mediaAndPrice.images} />
                    <AssetList title="Videos" items={submission.mediaAndPrice.videos} />
                    <AssetList title="Documents" items={submission.mediaAndPrice.documents} />
                </div>
            </section>
        </div>
    );
};

const ReviewMetric = ({ icon: Icon, label, value }) => (
    <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-3">
        <Icon className="h-4 w-4 text-[#2717D7]" />
        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        <p className="mt-1 text-lg font-black text-[#171327]">{value}</p>
    </div>
);

const SectionTitle = ({ icon: Icon, title, helper }) => (
    <div className="flex flex-col gap-3 border-b border-[#E1DDF0] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">{title}</p>
            <p className="mt-1 text-sm font-medium text-[#615C71]">{helper}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={19} />
        </div>
    </div>
);

const DataPill = ({ label, value }) => (
    <div className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF] p-3">
        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7B7486]">{label}</p>
        <p className="mt-1 break-words text-sm font-black text-[#171327]">{value || '-'}</p>
    </div>
);

const MiniValue = ({ label, value }) => (
    <div className="min-w-0 rounded-[7px] bg-[#FCFBFF] p-2 ring-1 ring-[#E1DDF0]">
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
        <p className="mt-1 truncate text-[10px] font-black text-[#171327]">{value}</p>
    </div>
);

const AssetList = ({ title, items }) => (
    <div className="rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF]">
        <div className="border-b border-[#E1DDF0] bg-white px-4 py-3">
            <p className="text-xs font-black text-[#171327]">{title}</p>
        </div>
        <div className="space-y-2 p-3">
            {items.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-[7px] bg-white px-3 py-2 ring-1 ring-[#E1DDF0]">
                    <FileText className="h-4 w-4 shrink-0 text-[#2717D7]" />
                    <p className="truncate text-xs font-black text-[#514B63]">{item}</p>
                </div>
            ))}
        </div>
    </div>
);

const FieldOfficerWorkflowReview = ({ officers, selectedOfficer, selectedProject, approvedOfficers, onSelectOfficer, onSelectProject, activeStage }) => {
    const officerProjects = selectedOfficer?.projects || [];
    const isApproved = Boolean(approvedOfficers[selectedOfficer?.id]);

    return (
        <div className="space-y-4 rounded-[10px] border border-[#D8D2EB] bg-[#FBFAFF] p-4">
            <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-4">
                <div className="flex flex-col gap-2 border-b border-[#E1DDF0] pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">Field Officers</p>
                        <p className="mt-1 text-sm font-medium text-[#615C71]">Select an officer to inspect their leads, meetings, follow-ups, onboarding, and tasks.</p>
                    </div>
                    {selectedOfficer && (
                        <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${isApproved ? 'bg-[#E9F8EF] text-[#04622E]' : 'bg-[#F4F1FF] text-[#2717D7]'}`}>
                            {isApproved ? 'Approved field officer' : `${officerProjects.length} active leads`}
                        </span>
                    )}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {officers.map((officer) => {
                        const selected = selectedOfficer?.id === officer.id;
                        const totalFollowUps = officer.projects.reduce((sum, project) => sum + (project.followUps?.length || 0), 0);
                        const totalMeetings = officer.projects.reduce((sum, project) => sum + (project.meetings?.length || 0), 0);
                        return (
                            <button
                                key={officer.id}
                                type="button"
                                onClick={() => onSelectOfficer(officer.id)}
                                className={`rounded-[10px] border p-4 text-left transition-all ${selected ? 'border-[#2717D7] bg-[#F4F1FF] shadow-sm' : 'border-[#E1DDF0] bg-[#FCFBFF] hover:border-[#2717D7]'}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-base font-black text-[#171327]">{officer.name}</p>
                                        <p className="mt-1 truncate text-xs font-medium text-[#615C71]">{officer.area}</p>
                                    </div>
                                    <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase text-[#2717D7] ring-1 ring-[#D8D2EB]">{officer.zone}</span>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                    <MiniValue label="Leads" value={officer.projects.length} />
                                    <MiniValue label="Follow" value={totalFollowUps} />
                                    <MiniValue label="Meet" value={totalMeetings} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {selectedOfficer && (
                <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-4">
                    <div className="flex flex-col gap-2 border-b border-[#E1DDF0] pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#5E5A71]">Project leads handled by {selectedOfficer.name}</p>
                            <p className="mt-1 text-sm font-medium text-[#615C71]">{selectedOfficer.phone} / {selectedOfficer.zone}</p>
                        </div>
                        <span className="rounded-full bg-[#E8E4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#2717D7]">
                            {activeStage?.title || 'Meeting'}
                        </span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {officerProjects.map((project) => (
                            <button
                                key={project.id}
                                type="button"
                                onClick={() => onSelectProject(project.id)}
                                className={`rounded-[10px] border p-4 text-left transition-all ${selectedProject?.id === project.id ? 'border-[#2717D7] bg-white shadow-[0_10px_24px_rgba(39,23,215,0.1)]' : 'border-[#E1DDF0] bg-[#FCFBFF] hover:border-[#2717D7]'}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-black text-[#171327]">{project.projectName}</p>
                                        <p className="mt-1 truncate text-xs font-medium text-[#615C71]">{project.developerName}</p>
                                    </div>
                                    <span className="rounded-full bg-[#FFF7E6] px-2.5 py-1 text-[9px] font-black uppercase text-[#A15A00]">{project.type}</span>
                                </div>
                                <p className="mt-3 text-xs font-medium text-[#615C71]">{project.projectType}</p>
                                <div className="mt-4 h-1.5 rounded-full bg-[#EFEAF8]">
                                    <div className="h-full rounded-full bg-[#2717D7]" style={{ width: `${project.onboardingProgress || 0}%` }} />
                                </div>
                                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#514B63]">{project.status} / {project.nextAction}</p>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {selectedProject && activeStage?.title !== 'Approved' && (
                <FieldOfficerStageData stageTitle={activeStage?.title} project={selectedProject} />
            )}
        </div>
    );
};

const FieldOfficerStageData = ({ stageTitle, project }) => {
    if (stageTitle === 'Meeting') {
        return (
            <StageDataShell icon={MapPin} title="Meeting scheduled data" helper={`${project.meetings?.length || 0} meetings from field officer app`}>
                <ActivityRows items={project.meetings || []} type="meeting" empty="No meetings scheduled for this lead yet." />
            </StageDataShell>
        );
    }

    if (stageTitle === 'Followup') {
        return (
            <StageDataShell icon={Phone} title="Follow-up data" helper={`${project.followUps?.length || 0} follow-ups from field officer app`}>
                <ActivityRows items={project.followUps || []} type="followUp" empty="No follow-ups saved for this lead yet." />
            </StageDataShell>
        );
    }

    if (stageTitle === 'Onboarding') {
        const onboarding = project.onboardingData;
        return (
            <StageDataShell icon={ClipboardList} title="Onboarding form data" helper={`${project.onboardingProgress || 0}% complete`}>
                {onboarding ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <DataPill label="Property Types" value={(onboarding.propertyTypes || []).map((item) => `${item.mainType} / ${item.subType}`).join(', ')} />
                        <DataPill label="Approval Status" value={onboarding.approvals?.overallApprovalStatus} />
                        <DataPill label="Possession" value={onboarding.approvals?.possessionStatus} />
                        <DataPill label="Development" value={`${onboarding.approvals?.developmentCompletionPercentage || 0}%`} />
                        <DataPill label="Loan Available" value={onboarding.finance?.loanAvailable} />
                        <DataPill label="Ownership" value={onboarding.finance?.ownershipType} />
                        <DataPill label="Images" value={(onboarding.media?.images || []).join(', ')} />
                        <DataPill label="Documents" value={(onboarding.media?.documents || []).join(', ')} />
                    </div>
                ) : (
                    <EmptyStageMessage text="Onboarding form has not been started for this project lead." />
                )}
            </StageDataShell>
        );
    }

    if (stageTitle === 'Task management') {
        return (
            <StageDataShell icon={Route} title="Task management" helper={`${project.tasks?.length || 0} field tasks`}>
                <div className="grid gap-3 md:grid-cols-2">
                    {(project.tasks || []).map((task) => (
                        <article key={task.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black text-[#171327]">{task.title}</p>
                                    <p className="mt-1 text-xs font-medium text-[#615C71]">{task.location}</p>
                                </div>
                                <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase text-[#2717D7] ring-1 ring-[#D8D2EB]">{task.status}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                                <MiniValue label="Due" value={task.due} />
                                <MiniValue label="Priority" value={task.priority} />
                            </div>
                        </article>
                    ))}
                </div>
            </StageDataShell>
        );
    }

    return <StageDataShell icon={ClipboardList} title="Field officer lead overview" helper={project.nextAction}><LeadOverview project={project} /></StageDataShell>;
};

const StageDataShell = ({ icon: Icon, title, helper, children }) => (
    <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-5">
        <SectionTitle icon={Icon} title={title} helper={helper} />
        <div className="mt-4">{children}</div>
    </section>
);

const ActivityRows = ({ items, type, empty }) => {
    if (!items.length) return <EmptyStageMessage text={empty} />;

    return (
        <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
                <article key={item.id} className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-black text-[#171327]">{type === 'meeting' ? item.type : item.meta?.followUpType || 'Follow-up'}</p>
                            <p className="mt-1 text-xs font-medium text-[#615C71]">{type === 'meeting' ? item.location : item.note}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${item.isDone ? 'bg-[#E9F8EF] text-[#04622E]' : 'bg-[#FFF7E6] text-[#A15A00]'}`}>{item.status}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                        <MiniValue label="Time" value={item.time || '-'} />
                        <MiniValue label="Next" value={type === 'meeting' ? item.meta?.reminder || '-' : item.meta?.nextAction || '-'} />
                    </div>
                    {type === 'meeting' && item.meta?.agenda?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.meta.agenda.map((agenda) => <span key={agenda} className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-[#514B63] ring-1 ring-[#E1DDF0]">{agenda}</span>)}
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
};

const EmptyStageMessage = ({ text }) => (
    <div className="rounded-[10px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
        <ClipboardList className="mx-auto h-9 w-9 text-[#A49DB8]" />
        <p className="mt-3 text-sm font-black text-[#171327]">{text}</p>
    </div>
);

const LeadOverview = ({ project }) => (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DataPill label="Project" value={project.projectName} />
        <DataPill label="Developer" value={project.developerName} />
        <DataPill label="Contact" value={`${project.contactPerson} / ${project.phoneNumber}`} />
        <DataPill label="Location" value={`${project.location}, ${project.city}`} />
        <DataPill label="Category" value={project.projectType} />
        <DataPill label="Lead Temperature" value={project.type} />
        <DataPill label="Current Status" value={project.status} />
        <DataPill label="Last Contact" value={project.lastContact} />
    </div>
);

const PanelOverview = () => {
    const [activeStatus, setActiveStatus] = useState('draft');
    const [activeWorkflow, setActiveWorkflow] = useState('fieldOfficer');
    const [activeStageTitle, setActiveStageTitle] = useState('');
    const [approvedWorkflows, setApprovedWorkflows] = useState({});
    const [selectedProjectId, setSelectedProjectId] = useState(projectPanelProjects[0]?.id || '');
    const [projectKycOverrides, setProjectKycOverrides] = useState({});
    const [selectedOfficerId, setSelectedOfficerId] = useState(fieldOfficerWorkflowData[0]?.id || '');
    const [selectedFieldProjectId, setSelectedFieldProjectId] = useState(fieldOfficerWorkflowData[0]?.projects?.[0]?.id || '');
    const [approvedFieldOfficers, setApprovedFieldOfficers] = useState({});

    const activeData = useMemo(() => panelOverviewByStatus[activeStatus], [activeStatus]);
    const workflowData = useMemo(() => panelWorkflowByStatus[activeStatus], [activeStatus]);
    const activeWorkflowData = workflowData[activeWorkflow];
    const activeStage = activeWorkflowData.stages.find((stage) => stage.title === activeStageTitle) || activeWorkflowData.stages[0];
    const allProjectPanelProjects = useMemo(() => (
        projectPanelProjects.map((project) => mergeProjectReviewState(project, projectKycOverrides[project.id]))
    ), [projectKycOverrides]);
    const visibleProjectPanelProjects = useMemo(() => {
        const scopedProjects = allProjectPanelProjects.filter((project) => project.statusBucket === activeStatus);
        return scopedProjects.length ? scopedProjects : allProjectPanelProjects;
    }, [activeStatus, allProjectPanelProjects]);
    const selectedProject = visibleProjectPanelProjects.find((project) => project.id === selectedProjectId) || allProjectPanelProjects.find((project) => project.id === selectedProjectId) || visibleProjectPanelProjects[0];
    const selectedOfficer = fieldOfficerWorkflowData.find((officer) => officer.id === selectedOfficerId) || fieldOfficerWorkflowData[0];
    const selectedFieldProject = selectedOfficer?.projects.find((project) => project.id === selectedFieldProjectId) || selectedOfficer?.projects[0];
    const approvalKey = `${activeStatus}-${activeWorkflow}`;
    const isApproved = activeWorkflow === 'fieldOfficer'
        ? Boolean(approvedFieldOfficers[selectedOfficer?.id])
        : Boolean(approvedWorkflows[approvalKey]);
    const showFieldTaskManagement = activeWorkflow === 'fieldOfficer' && activeStage?.title === 'Task management';
    const showProjectPanelKyc = activeWorkflow === 'projectPanel' && activeStage?.title === 'KYC Approved' && selectedProject;
    const showProjectPanelForm = activeWorkflow === 'projectPanel' && activeStage?.title === 'Onboarding states' && selectedProject;

    const handleApproveProject = () => {
        if (activeWorkflow !== 'fieldOfficer') {
            setApprovedWorkflows((current) => ({
                ...current,
                [approvalKey]: true,
                'adminApproved-projectPanel': activeWorkflow === 'projectPanel' ? true : current['adminApproved-projectPanel'],
            }));
        }
        if (activeWorkflow === 'projectPanel' && selectedProject) {
            setProjectKycOverrides((current) => ({
                ...current,
                [selectedProject.id]: {
                    ...(current[selectedProject.id] || {}),
                    statusBucket: 'adminApproved',
                    kycStatus: 'Approved',
                },
            }));
            setSelectedProjectId(selectedProject.id);
            setActiveStatus('adminApproved');
        }
        if (activeWorkflow === 'fieldOfficer' && selectedOfficer) {
            setApprovedFieldOfficers((current) => ({
                ...current,
                [selectedOfficer.id]: true,
            }));
        }
        const approvedStage = activeWorkflowData.stages.find((stage) => stage.title === 'Approved');
        if (approvedStage) {
            setActiveStageTitle(approvedStage.title);
        }
    };

    const handleProjectKycStatus = (projectId, status) => {
        setProjectKycOverrides((current) => ({
            ...current,
            [projectId]: {
                ...(current[projectId] || {}),
                kycStatus: status,
            },
        }));
    };

    const handleProjectDocumentStatus = (projectId, docKey, status) => {
        const baseProject = projectPanelProjects.find((project) => project.id === projectId);
        const currentProject = mergeProjectReviewState(baseProject, projectKycOverrides[projectId]);
        const document = currentProject.documents?.[docKey];
        if (!document) return;

        setProjectKycOverrides((current) => ({
            ...current,
            [projectId]: {
                ...(current[projectId] || {}),
                documents: {
                    ...(current[projectId]?.documents || {}),
                    [docKey]: {
                        ...document,
                        status,
                        ...(status === 'Approved' ? { approvedAt: new Date().toLocaleString('en-IN') } : {}),
                    },
                },
            },
        }));
    };

    const handleSelectFieldOfficer = (officerId) => {
        const officer = fieldOfficerWorkflowData.find((item) => item.id === officerId);
        setSelectedOfficerId(officerId);
        setSelectedFieldProjectId(officer?.projects?.[0]?.id || '');
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Panel Overview" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1600px] space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {activeData.metrics.map((metric) => (
                            <PanelMetricCard key={metric.key} metric={metric} />
                        ))}
                    </div>

                    <section className="rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_0_rgba(33,24,88,0.03)] sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {workflowOrder.map((workflow) => {
                                    const tab = workflowData[workflow];
                                    const isActive = activeWorkflow === workflow;

                                    return (
                                        <button
                                            key={workflow}
                                            type="button"
                                            onClick={() => setActiveWorkflow(workflow)}
                                            className={`h-10 rounded-[8px] border px-4 text-xs font-black uppercase tracking-[0.12em] transition-all focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/25 ${
                                                isActive
                                                    ? 'border-[#171327] bg-[#171327] text-white'
                                                    : 'border-[#D8D2EB] bg-[#FAFAFF] text-[#5E5A71] hover:border-[#171327] hover:text-[#171327]'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    onClick={handleApproveProject}
                                    disabled={isApproved}
                                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-[8px] px-4 text-xs font-black uppercase tracking-[0.12em] transition-all focus:outline-none focus:ring-2 focus:ring-[#04622E]/20 ${
                                        isApproved
                                            ? 'bg-[#E9F8EF] text-[#04622E]'
                                            : 'bg-[#04622E] text-white shadow-[0_8px_18px_rgba(4,98,46,0.16)] hover:bg-[#034f25]'
                                    }`}
                                >
                                    <CheckCircle2 size={16} />
                                    {isApproved
                                        ? activeWorkflow === 'fieldOfficer' ? 'Field officer approved' : 'Project approved'
                                        : activeWorkflow === 'fieldOfficer' ? 'Approve field officer' : activeWorkflowData.approveLabel}
                                </button>
                            </div>
                        </div>

                        {activeWorkflow === 'projectPanel' && (
                            <div className="mt-5">
                                <ProjectPanelPropertyCards
                                    activeStatus={activeStatus}
                                    projects={visibleProjectPanelProjects}
                                    allProjects={allProjectPanelProjects}
                                    selectedProject={selectedProject}
                                    onStatusChange={setActiveStatus}
                                    onSelectProject={setSelectedProjectId}
                                />
                            </div>
                        )}

                        <div className="mt-5">
                            <StageStepper stages={activeWorkflowData.stages} activeStage={activeStage} onSelectStage={setActiveStageTitle} />
                        </div>

                        <div className="mt-5">
                            {activeWorkflow === 'fieldOfficer' ? (
                                <FieldOfficerWorkflowReview
                                    officers={fieldOfficerWorkflowData}
                                    selectedOfficer={selectedOfficer}
                                    selectedProject={selectedFieldProject}
                                    approvedOfficers={approvedFieldOfficers}
                                    onSelectOfficer={handleSelectFieldOfficer}
                                    onSelectProject={setSelectedFieldProjectId}
                                    activeStage={activeStage}
                                />
                            ) : showFieldTaskManagement ? (
                                <FieldTaskManagement />
                            ) : showProjectPanelKyc ? (
                                <ProjectPanelKycReview
                                    project={selectedProject}
                                    onAccountStatus={handleProjectKycStatus}
                                    onDocumentStatus={handleProjectDocumentStatus}
                                />
                            ) : showProjectPanelForm ? (
                                <ProjectPanelFormReview project={selectedProject} submission={projectPanelFormSubmissionSample} />
                            ) : activeStage?.title === 'Approved' ? (
                                null
                            ) : (
                                <StageDetails stage={activeStage} />
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const getOfficerInitials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'FO';

const enrichOfficer = (officer, index, assignedTasks) => {
    const markerPositions = [
        { left: '62%', top: '36%' },
        { left: '67%', top: '56%' },
        { left: '44%', top: '64%' },
        { left: '74%', top: '28%' },
        { left: '28%', top: '33%' },
        { left: '52%', top: '76%' },
        { left: '36%', top: '52%' },
        { left: '82%', top: '68%' },
    ];
    const fallbackLat = 22.7196 + index * 0.012;
    const fallbackLng = 75.8577 + index * 0.014;
    return {
        ...officer,
        zone: officer.zone || 'Zone A-1',
        area: officer.area || 'Field Area',
        latitude: officer.latitude ?? fallbackLat,
        longitude: officer.longitude ?? fallbackLng,
        currentLocation: officer.currentLocation || `${officer.area || 'Field Area'} site`,
        markerPosition: markerPositions[index % markerPositions.length],
        speed: officer.speed ?? 0,
        distance: officer.distanceToday ?? 0,
        battery: officer.battery ?? 0,
        lastSync: officer.lastSync || 'Pending sync',
        score: officer.score ?? 0,
        activeTasks: assignedTasks.filter((task) => task.assigneeId === officer.id || task.assignee === officer.name).length,
    };
};

const getGoogleMapsEmbedUrl = (officer) => {
    if (!officer) return '';
    return `https://www.google.com/maps?q=${officer.latitude},${officer.longitude}&z=14&output=embed`;
};

const FieldTaskManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const tasks = useSelector((state) => state.tasks.tasks);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOfficerId, setSelectedOfficerId] = useState('');
    const [taskForm, setTaskForm] = useState({
        title: '',
        due: 'Today',
        priority: 'High',
        area: 'Zone A-1',
        location: 'South District site visit',
    });

    const fieldOfficers = useMemo(() => {
        const fieldUsers = users.filter((user) => String(user.type).toLowerCase() === 'field_officer');
        return fieldUsers.map((officer, index) => enrichOfficer(officer, index, tasks));
    }, [tasks, users]);

    useEffect(() => {
        if (!selectedOfficerId && fieldOfficers[0]) {
            setSelectedOfficerId(fieldOfficers[0].id);
        }
        if (selectedOfficerId && !fieldOfficers.some((officer) => officer.id === selectedOfficerId)) {
            setSelectedOfficerId(fieldOfficers[0]?.id || '');
        }
    }, [fieldOfficers, selectedOfficerId]);

    const selectedOfficer = fieldOfficers.find((officer) => officer.id === selectedOfficerId) || fieldOfficers[0];
    const selectedMapUrl = getGoogleMapsEmbedUrl(selectedOfficer);
    const allLocationsUrl = `https://www.google.com/maps/dir/${fieldOfficers.map((officer) => `${officer.latitude},${officer.longitude}`).join('/')}`;
    const selectedOfficerTasks = useMemo(() => {
        if (!selectedOfficer) return [];
        return tasks.filter((task) => task.assigneeId === selectedOfficer.id || task.assignee === selectedOfficer.name);
    }, [selectedOfficer, tasks]);
    const selectedOpenTasks = selectedOfficerTasks.filter((task) => String(task.status).toLowerCase() !== 'completed').length;

    useEffect(() => {
        if (!selectedOfficer) return;
        setTaskForm((current) => ({
            ...current,
            area: selectedOfficer.zone,
            location: selectedOfficer.currentLocation,
        }));
    }, [selectedOfficer]);

    const filteredOfficers = fieldOfficers.filter((officer) => {
        const query = searchQuery.trim().toLowerCase();
        return !query || [officer.name, officer.phone, officer.area, officer.zone].some((value) => String(value).toLowerCase().includes(query));
    });
    const totalDistance = fieldOfficers.reduce((sum, officer) => sum + officer.distance, 0);
    const activeSiteVisits = tasks.filter((task) => String(task.status).toLowerCase() !== 'completed').length;

    const handleAssignTask = (event) => {
        event.preventDefault();
        if (!selectedOfficer || !taskForm.title.trim()) return;

        dispatch(addTask({
            title: taskForm.title.trim(),
            assignee: selectedOfficer.name,
            assigneeId: selectedOfficer.id,
            due: taskForm.due,
            priority: taskForm.priority,
            area: taskForm.area,
            location: taskForm.location,
            tracking: {
                zone: selectedOfficer.zone,
                lastKnownLocation: taskForm.location,
                latitude: selectedOfficer.latitude,
                longitude: selectedOfficer.longitude,
                distanceToday: selectedOfficer.distance,
                battery: selectedOfficer.battery,
            },
        }));

        setTaskForm((current) => ({ ...current, title: '' }));
    };

    if (!fieldOfficers.length) {
        return (
            <div className="rounded-[10px] border border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                <UserCheck className="mx-auto h-10 w-10 text-[#A49DB8]" />
                <p className="mt-3 text-lg font-black text-[#171327]">No field officers found</p>
                <p className="mt-1 text-sm font-medium text-[#615C71]">Add users with type Field_officer to assign field tasks and track locations.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 rounded-[10px] border border-[#D8D2EB] bg-[#FBFAFF] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-[#171327]">Live Field Tracking</h3>
                    <span className="rounded-full bg-[#E8E4FF] px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#2717D7]">Live system</span>
                </div>
                <div className="flex items-center gap-3">
                    <label className="relative block w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B657A]" />
                        <input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search officers..."
                            className="h-10 w-full rounded-[8px] border border-[#D8D2EB] bg-white pl-9 pr-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2717D7]/20"
                        />
                    </label>
                    <button className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#D8D2EB] bg-white text-[#171327]" aria-label="Alerts">
                        <Bell size={16} />
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <TrackingMetric icon={ShieldCheck} label="Total officers online" value={fieldOfficers.length} helper={`${fieldOfficers.length} active`} />
                <TrackingMetric icon={Route} label="Distance covered today" value={`${totalDistance.toFixed(1)} km`} helper="Synced route logs" />
                <TrackingMetric icon={MapPin} label="Active site visits" value={activeSiteVisits} helper="In progress" />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
                <div className="relative min-h-[380px] overflow-hidden rounded-[10px] border border-[#D8D2EB] bg-[#F0EDFF]">
                    <iframe
                        key={selectedOfficer?.id}
                        title={selectedOfficer ? `${selectedOfficer.name} Google Maps location` : 'Field officer map'}
                        src={selectedMapUrl}
                        className="h-[380px] w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                        <span className="rounded-[6px] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#171327] shadow">{selectedOfficer?.zone || 'Zone A-1'}</span>
                        <span className="rounded-[6px] bg-white px-3 py-2 text-[10px] font-black text-[#615C71] shadow">{fieldOfficers.length} Active</span>
                        <span className="rounded-[6px] bg-white px-3 py-2 text-[10px] font-black text-[#2717D7] shadow">
                            {selectedOfficer?.latitude.toFixed(4)}, {selectedOfficer?.longitude.toFixed(4)}
                        </span>
                    </div>
                    {selectedOfficer && (
                        <div className="absolute bottom-5 left-5 max-w-[280px] rounded-[10px] border border-[#D8D2EB] bg-white/95 p-4 shadow-xl">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">Selected officer</p>
                            <p className="mt-1 text-lg font-black text-[#171327]">{selectedOfficer.name}</p>
                            <p className="text-xs font-medium text-[#615C71]">{selectedOfficer.currentLocation} / {selectedOfficer.zone}</p>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-[7px] bg-[#F4F1FF] p-2"><p className="text-xs font-black">{selectedOfficer.distance.toFixed(1)} km</p><p className="text-[8px] font-black uppercase text-[#7B7486]">Distance</p></div>
                                <div className="rounded-[7px] bg-[#F4F1FF] p-2"><p className="text-xs font-black">{selectedOfficer.battery}%</p><p className="text-[8px] font-black uppercase text-[#7B7486]">Battery</p></div>
                                <div className="rounded-[7px] bg-[#F4F1FF] p-2"><p className="text-xs font-black">{selectedOfficerTasks.length}</p><p className="text-[8px] font-black uppercase text-[#7B7486]">Tasks</p></div>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-5 right-5 grid gap-2">
                        <a
                            href={allLocationsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-9 w-9 place-items-center rounded-[8px] bg-white text-[#2717D7] shadow"
                            aria-label="Open all field officer locations in Google Maps"
                        >
                            <Route size={17} />
                        </a>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${selectedOfficer?.latitude},${selectedOfficer?.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-9 w-9 place-items-center rounded-[8px] bg-[#2717D7] text-white shadow"
                            aria-label="Open selected officer in Google Maps"
                        >
                            <LocateFixed size={17} />
                        </a>
                    </div>
                </div>

                <aside className="rounded-[10px] border border-[#D8D2EB] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E1DDF0] p-4">
                        <h4 className="font-black text-[#171327]">Officer Metrics</h4>
                        <MoreVertical size={18} />
                    </div>
                    <div className="max-h-[445px] space-y-3 overflow-y-auto p-3">
                        {filteredOfficers.map((officer) => (
                            <button
                                key={officer.id}
                                type="button"
                                onClick={() => setSelectedOfficerId(officer.id)}
                                className={`w-full rounded-[10px] border p-3 text-left transition-all ${selectedOfficer?.id === officer.id ? 'border-[#2717D7] bg-white shadow-sm' : 'border-[#E1DDF0] bg-[#FCFBFF]'}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#173141] text-xs font-black text-white">{getOfficerInitials(officer.name)}</span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-black text-[#171327]">{officer.name}</p>
                                            <p className="truncate text-[10px] font-medium text-[#615C71]">{officer.currentLocation} - {officer.zone}</p>
                                        </div>
                                    </div>
                                    <p className="text-right text-sm font-black text-[#2717D7]">{officer.score}<span className="block text-[8px] uppercase text-[#6B657A]">Score</span></p>
                                </div>
                                <div className="mt-4 grid grid-cols-3 divide-x divide-[#E1DDF0] text-center">
                                    <MiniTrack icon={Gauge} value={`${officer.speed.toFixed(1)} km/h`} label="Speed" />
                                    <MiniTrack icon={Battery} value={`${officer.battery}%`} label="Battery" />
                                    <MiniTrack icon={RefreshCcw} value={officer.lastSync} label="Last sync" />
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <div className="overflow-hidden rounded-[10px] border border-[#D8D2EB] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E1DDF0] p-4">
                        <h4 className="font-black text-[#171327]">Officer Roster</h4>
                        <button className="rounded-[8px] bg-[#2717D7] px-4 py-2 text-xs font-black text-white">Broadcast Alert</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#F4F1FF] text-[10px] font-black uppercase tracking-[0.12em] text-[#2A2535]">
                                <tr>
                                    <th className="px-4 py-3">Name & status</th>
                                    <th className="px-4 py-3">Assigned area</th>
                                    <th className="px-4 py-3">Contact info</th>
                                    <th className="px-4 py-3">Today's dist.</th>
                                    <th className="px-4 py-3">Performance</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOfficers.map((officer) => {
                                    const isSelected = selectedOfficer?.id === officer.id;
                                    return (
                                    <tr
                                        key={officer.id}
                                        onClick={() => setSelectedOfficerId(officer.id)}
                                        className={`cursor-pointer border-t border-[#E1DDF0] transition-colors ${isSelected ? 'bg-[#F4F1FF]' : 'hover:bg-[#FCFBFF]'}`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-[#173141] text-[10px] font-black text-white">{getOfficerInitials(officer.name)}</span>
                                                <div>
                                                    <p className="text-sm font-black text-[#171327]">{officer.name}</p>
                                                    <p className="text-[9px] font-black uppercase text-[#059447]">Active</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-medium text-[#514B63]">{officer.area}<br />{officer.zone}</td>
                                        <td className="px-4 py-3 text-xs font-medium text-[#514B63]">{officer.phone}<br />{officer.id.toLowerCase()}@squarft.com</td>
                                        <td className="px-4 py-3 text-sm font-black text-[#171327]">{officer.distance.toFixed(1)} km</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 rounded-full bg-[#E1DDF0]"><div className="h-full rounded-full bg-[#22C55E]" style={{ width: `${officer.score}%` }} /></div>
                                                <span className="text-xs font-black">{(officer.score / 10).toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setSelectedOfficerId(officer.id)} className="grid h-10 w-10 place-items-center rounded-full bg-[#2717D7] text-white">
                                                <Radar size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <form onSubmit={handleAssignTask} className="rounded-[10px] border border-[#D8D2EB] bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h4 className="font-black text-[#171327]">Assign field task</h4>
                            <p className="text-xs font-medium text-[#615C71]">Task goes into the shared task store.</p>
                        </div>
                        <Plus className="text-[#2717D7]" size={18} />
                    </div>
                    <div className="space-y-3">
                        <FieldInput label="Task" value={taskForm.title} onChange={(value) => setTaskForm({ ...taskForm, title: value })} placeholder="Verify project location" />
                        <FieldSelect label="Field officer" value={selectedOfficerId} onChange={setSelectedOfficerId} options={fieldOfficers.map((officer) => ({ label: officer.name, value: officer.id }))} />
                        <FieldInput label="Location" value={taskForm.location} onChange={(value) => setTaskForm({ ...taskForm, location: value })} placeholder="Enter site or meeting location" />
                        <div className="grid grid-cols-2 gap-3">
                            <FieldSelect label="Due" value={taskForm.due} onChange={(value) => setTaskForm({ ...taskForm, due: value })} options={['Today', 'Tomorrow', 'This week'].map((item) => ({ label: item, value: item }))} />
                            <FieldSelect label="Priority" value={taskForm.priority} onChange={(value) => setTaskForm({ ...taskForm, priority: value })} options={['High', 'Medium', 'Low'].map((item) => ({ label: item, value: item }))} />
                        </div>
                    </div>
                    <button type="submit" className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2717D7] text-xs font-black uppercase tracking-[0.12em] text-white">
                        <Siren size={15} /> Assign task
                    </button>
                </form>
            </div>

            <section className="rounded-[10px] border border-[#D8D2EB] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#E1DDF0] p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 className="font-black text-[#171327]">Tasks for {selectedOfficer?.name}</h4>
                        <p className="text-xs font-medium text-[#615C71]">
                            {selectedOfficerTasks.length} total tasks / {selectedOpenTasks} open / {selectedOfficer?.currentLocation}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em]">
                        <span className="rounded-full bg-[#F4F1FF] px-3 py-1.5 text-[#2717D7]">{selectedOfficer?.zone}</span>
                        <span className="rounded-full bg-[#F4F1FF] px-3 py-1.5 text-[#514B63]">{selectedOfficer?.latitude.toFixed(4)}, {selectedOfficer?.longitude.toFixed(4)}</span>
                    </div>
                </div>

                {selectedOfficerTasks.length ? (
                    <div className="grid gap-3 p-4 lg:grid-cols-2">
                        {selectedOfficerTasks.map((task) => (
                            <OfficerTaskCard
                                key={task.id}
                                task={task}
                                onStatusChange={(status) => dispatch(updateTaskStatus({ id: task.id, status }))}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <ListChecksEmpty />
                        <p className="mt-3 text-lg font-black text-[#171327]">No tasks assigned yet</p>
                        <p className="mt-1 text-sm font-medium text-[#615C71]">Use the assign task form above to create one for this officer.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

const OfficerTaskCard = ({ task, onStatusChange }) => {
    const isComplete = String(task.status).toLowerCase() === 'completed';

    return (
        <article className="rounded-[10px] border border-[#E1DDF0] bg-[#FCFBFF] p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-black text-[#171327]">{task.title}</p>
                    <p className="mt-1 text-xs font-medium text-[#615C71]">{task.location || task.tracking?.lastKnownLocation || 'No location added'}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${isComplete ? 'bg-[#E9F8EF] text-[#04622E]' : 'bg-[#F4F1FF] text-[#2717D7]'}`}>
                    {task.status}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
                    <p className="text-[9px] font-black uppercase text-[#8B8498]">Due</p>
                    <p className="mt-1 text-xs font-black text-[#171327]">{task.due}</p>
                </div>
                <div className="rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
                    <p className="text-[9px] font-black uppercase text-[#8B8498]">Priority</p>
                    <p className="mt-1 text-xs font-black text-[#171327]">{task.priority}</p>
                </div>
                <div className="rounded-[7px] bg-white p-2 ring-1 ring-[#E1DDF0]">
                    <p className="text-[9px] font-black uppercase text-[#8B8498]">Zone</p>
                    <p className="mt-1 text-xs font-black text-[#171327]">{task.area || task.tracking?.zone || '-'}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onStatusChange('In Progress')}
                    className="rounded-[8px] border border-[#D8D2EB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#514B63] hover:border-[#2717D7] hover:text-[#2717D7]"
                >
                    In progress
                </button>
                <button
                    type="button"
                    onClick={() => onStatusChange('Completed')}
                    className="rounded-[8px] bg-[#04622E] px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white"
                >
                    Mark complete
                </button>
                {task.tracking?.latitude && task.tracking?.longitude && (
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${task.tracking.latitude},${task.tracking.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[8px] border border-[#D8D2EB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#2717D7]"
                    >
                        Map
                    </a>
                )}
            </div>
        </article>
    );
};

const ListChecksEmpty = () => (
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-[10px] bg-[#F4F1FF] text-[#2717D7]">
        <CheckCircle2 size={22} />
    </div>
);

const TrackingMetric = ({ icon: Icon, label, value, helper }) => (
    <div className="flex items-center gap-4 rounded-[10px] border border-[#D8D2EB] bg-white p-5">
        <div className="grid h-12 w-12 place-items-center rounded-[10px] bg-[#F0EDFF] text-[#2717D7]">
            <Icon size={21} />
        </div>
        <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5E5A71]">{label}</p>
            <p className="mt-1 text-lg font-black text-[#171327]">{value}</p>
            <p className="text-[10px] font-black text-[#2717D7]">{helper}</p>
        </div>
    </div>
);

const MiniTrack = ({ icon: Icon, value, label }) => (
    <div className="px-2">
        <Icon className="mx-auto mb-1 h-4 w-4 text-[#514B63]" />
        <p className="text-[10px] font-black text-[#171327]">{value}</p>
        <p className="text-[8px] font-black uppercase text-[#8B8498]">{label}</p>
    </div>
);

const FieldInput = ({ label, value, onChange, placeholder }) => (
    <label className="block">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">{label}</span>
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="mt-1 h-10 w-full rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2717D7]/20"
            required
        />
    </label>
);

const FieldSelect = ({ label, value, onChange, options }) => (
    <label className="block">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6B657A]">{label}</span>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-1 h-10 w-full rounded-[8px] border border-[#D8D2EB] bg-[#FCFBFF] px-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#2717D7]/20"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </label>
);

export default PanelOverview;
