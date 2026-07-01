import { useState, useRef, useEffect, useCallback } from 'react';
import { 
    Calendar, 
    Phone, 
    MapPin, 
    Clock, 
    Compass,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Download,
    CheckCircle2,
    AlertCircle,
    Building2,
    Coins,
    FileText,
    Image as ImageIcon,
    Check,
    Layers,
    Lock,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import Header from '../../components/layout/Header';
import {
    fetchPanelStats,
    fetchBuilderKycList,
    fetchBuilderKycDetails,
    updateBuilderKycStatus,
    fetchOnboardingProjects,
    fetchProjectOnboardingDetails,
    decideProjectOnboarding,
    fetchLiveProjects,
    fetchRejectedProjects,
    fetchFieldOfficersDropdown,
    fetchOfficerDetails,
    fetchOfficerBuilderLeads,
    fetchBuilderLeadDetails,
    assignFieldTask,
    fetchAllBranchFieldTasks,
    completeFieldTask,
    deleteFieldTask,
} from '../../services/panelOverviewService';

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

// Maps API builder KYC record to the shape expected by KYC UI
const mapBuilderKyc = (b) => ({
    id: b.id,
    firstName: b.name?.split(' ')[0] || '',
    lastName: b.name?.split(' ').slice(1).join(' ') || '',
    companyName: b.company_name || 'N/A',
    companyType: 'Builder',
    reraNumber: b.rera_number || 'N/A',
    mobile: b.phone || 'N/A',
    location: b.location || 'N/A',
    kycStatus: (b.document_status || 'PENDING').toLowerCase(),
    rejectionReason: b.rejection_reason || '',
    kycDocuments: [],
});

// Maps API project onboarding record to the shape expected by onboarding UI
const mapOnboardingProject = (p) => ({
    id: p.id,
    projectName: p.project_name || 'Unnamed Project',
    builderName: p.builder_name || 'Unknown Builder',
    currentStep: p.step || 1,
    isCompleted: p.display_status === 'LIVE' || p.display_status === 'REJECTED' || (p.progress_percentage || 0) >= 100,
    isLive: p.display_status === 'LIVE' || p.status === 'published',
    isRejected: p.display_status === 'REJECTED' || p.status === 'rejected',
    rejectionReason: p.rejection_reason || '',
    form: {},
});

const DetailField = ({ label, value }) => {
    const isValEmpty = value === null || value === undefined || String(value).trim() === '';
    return (
        <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">{label}</p>
            {isValEmpty ? (
                <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 mt-0.5">
                    [Pending]
                </span>
            ) : (
                <p className="text-xs font-black text-[#171327] mt-0.5 tracking-wide">
                    {value}
                </p>
            )}
        </div>
    );
};

const EmptyStepMessage = ({ message }) => (
    <div className="p-8 border border-dashed border-[#D8D2EB] rounded-[8px] bg-[#FCFBFF] text-center">
        <p className="text-xs font-bold text-[#797298]">{message}</p>
    </div>
);

const complianceDocumentLabels = {
    rera: 'RERA Certification',
    tncp: 'TNCP Approval',
    buildingPermission: 'Building Permission',
    developmentPermission: 'Development Permission'
};

const complianceDocumentAliases = {
    rera: ['rera'],
    tncp: ['tncp'],
    buildingPermission: ['building', 'permission', 'bp'],
    developmentPermission: ['development', 'layout', 'dp']
};

const getComplianceDocumentLabel = (key) => (
    complianceDocumentLabels[key] || key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())
);

const getDocumentName = (doc) => doc?.name || doc?.fileName || doc?.title || 'Uploaded document';
const getDocumentUri = (doc) => doc?.uri || doc?.url || doc?.fileUrl || '';

const matchesComplianceDocument = (doc, key) => {
    const haystack = getDocumentName(doc).toLowerCase();
    return (complianceDocumentAliases[key] || [key.toLowerCase()]).some((alias) => haystack.includes(alias));
};

const Step1View = ({ form }) => (
    <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
            <Building2 size={14} className="text-[#2717D7]" /> Project & Developer Identity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] border border-[#E1DDF0] rounded-[8px] p-4">
            <DetailField label="Project Name" value={form.step1?.projectName} />
            <DetailField label="Location / Landmark" value={form.step1?.location} />
            <DetailField label="City" value={form.step1?.city} />
            <DetailField label="State" value={form.step1?.state} />
            <DetailField label="Pincode" value={form.step1?.pincode} />
        </div>
        <hr className="border-[#EFEAF8] my-4" />
        <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
            <Phone size={14} className="text-[#2717D7]" /> Responsible Contacts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FCFBFF] border border-[#E1DDF0] rounded-[8px] p-4">
            <DetailField label="Sales Officer Name" value={form.step1?.salesOfficerName} />
            <DetailField label="Sales Officer Contact" value={form.step1?.salesOfficerContact} />
            <DetailField label="Responsible Person" value={form.step1?.responsiblePersonName} />
            <DetailField label="Responsible Contact" value={form.step1?.responsiblePersonContact} />
        </div>
    </div>
);

const Step2View = ({ form }) => {
    const selectedTypes = form.step2?.selectedTypes || [];
    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
                <Layers size={14} className="text-[#2717D7]" /> Property Classifications
            </h4>
            {selectedTypes.length === 0 ? (
                <EmptyStepMessage message="No property classifications configured yet." />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTypes.map((type, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-[8px] bg-[#F8F9FF] border border-[#E1DDF0]">
                            <div className="h-9 w-9 rounded-full bg-[#F4F1FF] flex items-center justify-center text-[#2717D7] font-black text-xs shrink-0">
                                {type.mainType?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-[#797298]">{type.mainType}</p>
                                <p className="text-xs font-black text-[#171327]">{type.subType}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Step3View = ({ form }) => {
    const unitConfigs = form.step3?.unitConfigs || {};
    const hasUnits = Object.values(unitConfigs).some(configs => configs && configs.length > 0);

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
                <Building2 size={14} className="text-[#2717D7]" /> Unit Configurations
            </h4>
            {!hasUnits ? (
                <EmptyStepMessage message="No specific unit configurations uploaded yet." />
            ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {Object.entries(unitConfigs).map(([typeId, configs]) => {
                        if (!configs || configs.length === 0) return null;
                        return (
                            <div key={typeId} className="border border-[#E1DDF0] rounded-[8px] overflow-hidden">
                                <div className="bg-[#F8F9FF] border-b border-[#E1DDF0] px-3 py-2">
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#F4F1FF] text-[#2717D7] px-2 py-0.5 rounded border border-[#D8D2EB]">
                                        {typeId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#E1DDF0] bg-white text-[8px] font-black uppercase tracking-wider text-[#797298]">
                                                <th className="px-3 py-2">Unit No</th>
                                                <th className="px-3 py-2">Tower/Block</th>
                                                <th className="px-3 py-2">Floor</th>
                                                <th className="px-3 py-2">BHK/Type</th>
                                                <th className="px-3 py-2">Area</th>
                                                <th className="px-3 py-2 text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[10px] font-bold text-[#171327] divide-y divide-[#EFEAF8]">
                                            {configs.map((config, idx) => (
                                                <tr key={idx} className="hover:bg-[#FCFBFF]">
                                                    <td className="px-3 py-2 font-mono font-black text-[#2717D7]">{config.propertyNumber || '-'}</td>
                                                    <td className="px-3 py-2">{config.tower || '-'}</td>
                                                    <td className="px-3 py-2">{config.floor || '-'}</td>
                                                    <td className="px-3 py-2">{config.bhk || config.officeType || '-'}</td>
                                                    <td className="px-3 py-2">{config.area || '-'}</td>
                                                    <td className="px-3 py-2 text-right font-black text-emerald-600">₹{config.price || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Step4View = ({ form }) => {
    const approvals = form.step4?.approvals || {};
    const stages = form.step4?.currentDevelopmentStage || [];
    
    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-[#2717D7]" /> Project Timeline & Development Progress
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] border border-[#E1DDF0] rounded-[8px] p-4">
                <DetailField label="Possession Status" value={form.step4?.possessionStatus} />
                <DetailField label="Expected Possession Date" value={form.step4?.expectedPossessionDate} />
                <DetailField label="Launch Status" value={form.step4?.projectLaunchStatus} />
                <DetailField label="Launch / Expected Date" value={form.step4?.projectLaunchDate || form.step4?.expectedLaunchDate} />
            </div>

            <div className="space-y-2 mt-2">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Development Completion</p>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-[#EFEAF8] overflow-hidden border border-[#E1DDF0]">
                        <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                            style={{ width: `${form.step4?.developmentCompletionPercentage || 0}%` }}
                        />
                    </div>
                    <span className="text-xs font-black text-[#171327]">{form.step4?.developmentCompletionPercentage || 0}%</span>
                </div>
                {stages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {stages.map((stg) => (
                            <span key={stg} className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wide">
                                ✓ {stg}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <hr className="border-[#EFEAF8] my-4" />
            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" /> Compliance & Approvals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(approvals).map(([key, val]) => {
                    const value = val || {};
                    return (
                        <div key={key} className="p-3 border border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-black uppercase tracking-wider text-[#797298]">
                                    {key.toUpperCase() === 'RERA' ? 'RERA Certification' : 
                                     key === 'buildingPermission' ? 'Building Permission' : 
                                     key === 'developmentPermission' ? 'Development Permission' : 
                                     key === 'tncp' ? 'TNCP Approval' : key}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    value.status === 'Yes' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                    value.status === 'No' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {value.status || 'Pending'}
                                </span>
                            </div>
                            {value.status === 'Yes' && value.registrationNumber && (
                                <p className="text-[10px] font-mono font-black text-[#171327] mt-1 break-all bg-white p-1 rounded border border-[#E1DDF0]">
                                    {value.registrationNumber}
                                </p>
                            )}
                            {value.status === 'No' && value.expectedTime && (
                                <p className="text-[10px] text-rose-600 font-bold mt-1">Expected: {value.expectedTime}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Step5View = ({ form }) => (
    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
        <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
            <Coins size={14} className="text-[#2717D7]" /> Guideline Value & Registry Charges
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8F9FF] border border-[#E1DDF0] rounded-[8px] p-4">
            <DetailField label="Guideline Value" value={form.step5?.guidelineValueAmount ? `${form.step5.guidelineValueAmount} ${form.step5.guidelineValueUnit || ''}` : null} />
            <DetailField label="Registry (Male)" value={form.step5?.registryChargesMaleBuyer} />
            <DetailField label="Registry (Female)" value={form.step5?.registryChargesFemaleBuyer} />
            <DetailField label="Jurisdiction" value={form.step5?.propertyJurisdictionArea} />
            <DetailField label="Guideline Year" value={form.step5?.guidelineYear} />
            <DetailField label="Other Government Charges" value={form.step5?.otherGovernmentCharges} />
        </div>

        <hr className="border-[#EFEAF8] my-4" />
        <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#2717D7]" /> Loan Availability & Tie-ups
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FCFBFF] border border-[#E1DDF0] rounded-[8px] p-4">
            <DetailField label="Bank Loan Available" value={form.step5?.loanAvailable} />
            <DetailField label="Tie-up with Banks" value={form.step5?.tieUpBankName || form.step5?.bankNameList} />
            <DetailField label="Maximum Loan %" value={form.step5?.maximumLoanPercentage} />
            <DetailField label="Loan Approval Status" value={form.step5?.loanApprovalStatus} />
            <div className="col-span-1 md:col-span-2">
                <DetailField label="Required Documents" value={form.step5?.requiredLoanDocuments} />
            </div>
        </div>

        <hr className="border-[#EFEAF8] my-4" />
        <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
            <Building2 size={14} className="text-[#2717D7]" /> Land Ownership & JV details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] border border-[#E1DDF0] rounded-[8px] p-4">
            <DetailField label="Ownership Type" value={form.step5?.ownershipType} />
            <DetailField label="Title Verification" value={form.step5?.titleVerificationStatus} />
            {form.step5?.ownershipType === 'Joint Venture Project' && (
                <>
                    <DetailField label="JV Land Owner Name" value={form.step5?.jvLandOwnerName} />
                    <DetailField label="JV Developer Name" value={form.step5?.jvDeveloperBuilderName} />
                    <div className="col-span-1 md:col-span-2">
                        <DetailField label="JV Share Details" value={form.step5?.jvRevenueAreaSharingDetails} />
                    </div>
                </>
            )}
            {form.step5?.titleVerificationStatus !== 'Clear Title' && form.step5?.titleExpectedCompletionDate && (
                <DetailField label="Expected Title Date" value={form.step5?.titleExpectedCompletionDate} />
            )}
        </div>
    </div>
);

const Step6View = ({ form }) => {
    const images = form.step6?.images || [];
    const documents = form.step6?.documents || [];
    const approvals = form.step4?.approvals || {};
    const agreed = form.step6?.agreed;
    const complianceDocuments = Object.entries(approvals)
        .map(([key, value]) => {
            const approval = value || {};
            const matchedDocument = documents.find((doc) => matchesComplianceDocument(doc, key));
            return {
                key,
                label: getComplianceDocumentLabel(key),
                number: approval.registrationNumber || approval.documentNumber || approval.approvalNumber || approval.number || '',
                status: approval.status || 'Pending',
                document: matchedDocument
            };
        })
        .filter((item) => item.status === 'Yes' || item.number || item.document);
    const standaloneDocuments = documents.filter((doc) => (
        !Object.keys(approvals).some((key) => matchesComplianceDocument(doc, key))
    ));
    const hasDocumentSectionContent = complianceDocuments.length > 0 || standaloneDocuments.length > 0;

    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#2717D7]" /> Project Media Gallery
            </h4>
            {images.length === 0 ? (
                <EmptyStepMessage message="No photos uploaded yet." />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-[8px] overflow-hidden border border-[#E1DDF0] bg-gray-100 group">
                            <img src={img.uri} alt={img.fileName} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                <p className="text-[8px] font-mono text-white truncate">{img.fileName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <hr className="border-[#EFEAF8] my-4" />
            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-[#2717D7]" /> Project Brochures & Compliance Documents
            </h4>
            {!hasDocumentSectionContent ? (
                <EmptyStepMessage message="No brochures, compliance document numbers, or PDFs uploaded yet." />
            ) : (
                <div className="space-y-3">
                    {complianceDocuments.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {complianceDocuments.map((item) => {
                                const uri = getDocumentUri(item.document);
                                const docName = item.document ? getDocumentName(item.document) : '';

                                return (
                                    <div key={item.key} className="p-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF]">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">{item.label}</p>
                                                <p className="mt-1 break-all rounded border border-[#E1DDF0] bg-white px-2 py-1 font-mono text-[10px] font-black text-[#171327]">
                                                    {item.number || '[Number Pending]'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-[8px] font-black uppercase border px-2 py-0.5 rounded ${
                                                    uri
                                                        ? 'bg-[#F4F1FF] text-[#2717D7] border-[#D8D2EB]'
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {uri ? 'PDF' : 'No PDF'}
                                                </span>
                                                {uri && (
                                                    <a
                                                        href={uri}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center p-1 rounded bg-[#EFEAF8] hover:bg-[#E1DDF0] text-[#2717D7] border border-[#D8D2EB] transition-colors"
                                                        title="Download or open PDF"
                                                    >
                                                        <Download size={12} strokeWidth={2.5} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {docName && (
                                            <p className="mt-2 truncate text-[10px] font-bold text-[#5E5A71]">
                                                {docName}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {standaloneDocuments.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {standaloneDocuments.map((doc, idx) => {
                                const uri = getDocumentUri(doc);

                                return (
                                    <div key={`${getDocumentName(doc)}-${idx}`} className="flex items-center justify-between p-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF]">
                                        <div className="flex items-center gap-2 truncate mr-2">
                                            <FileText size={16} className="text-indigo-600 shrink-0" />
                                            <div className="min-w-0">
                                                <span className="block truncate text-xs font-black text-[#171327]">{getDocumentName(doc)}</span>
                                                {(doc.documentNumber || doc.registrationNumber || doc.approvalNumber || doc.number) && (
                                                    <span className="mt-1 block truncate font-mono text-[10px] font-black text-[#5E5A71]">
                                                        {doc.documentNumber || doc.registrationNumber || doc.approvalNumber || doc.number}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[8px] font-black uppercase bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] px-2 py-0.5 rounded">PDF</span>
                                            {uri && uri !== '#' && (
                                                <a
                                                    href={uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center p-1 rounded bg-[#EFEAF8] hover:bg-[#E1DDF0] text-[#2717D7] border border-[#D8D2EB] transition-colors"
                                                    title="Download or open PDF"
                                                >
                                                    <Download size={12} strokeWidth={2.5} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <hr className="border-[#EFEAF8] my-4" />
            <div className="flex items-center gap-3 p-4 rounded-[8px] border border-emerald-100 bg-emerald-50">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <div>
                    <h5 className="text-xs font-black text-[#04622E]">Onboarding Agreement Status</h5>
                    <p className="text-[10px] font-bold text-emerald-700/80 mt-0.5">
                        {agreed 
                            ? 'The builder / field officer has verified and agreed to all registration terms.' 
                            : 'Agreement signature is pending builder acceptance.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

const OnboardingDetailViewer = ({ data, activeStep, setActiveStep, onApprove, onReject }) => {
    if (!data) return null;
    const form = data.form || {};

    const steps = [
        { id: 1, title: 'Basic Details' },
        { id: 2, title: 'Property Type' },
        { id: 3, title: 'Property Detail' },
        { id: 4, title: 'Approvals' },
        { id: 5, title: 'Finance' },
        { id: 6, title: 'Image & Price' },
    ];

    const isStepCompleted = (stepId) => {
        if (data.isCompleted) return true;
        return stepId < data.currentStep;
    };

    const isStepActive = (stepId) => {
        return stepId === activeStep;
    };

    return (
        <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            {/* Horizontal Stepper */}
            <div className="flex justify-between items-center border-b border-[#EFEAF8] pb-4 overflow-x-auto scrollbar-none gap-2">
                {steps.map((step) => {
                    const completed = isStepCompleted(step.id);
                    const active = isStepActive(step.id);
                    
                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => setActiveStep(step.id)}
                            className="flex flex-col items-center min-w-[70px] focus:outline-none group relative"
                        >
                            <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                                completed 
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                                    : active 
                                        ? 'border-[#2717D7] bg-[#F4F1FF] text-[#2717D7] font-black' 
                                        : 'border-[#D8D2EB] bg-white text-[#797298] group-hover:border-[#2717D7]'
                            }`}>
                                {completed ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px] font-black">{step.id}</span>}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider text-center mt-1.5 transition-colors ${
                                active ? 'text-[#2717D7]' : 'text-[#797298] group-hover:text-[#2717D7]'
                            }`}>
                                {step.title}
                            </span>
                            {active && (
                                <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Stepped Details Form Container */}
            <div className="pt-2 min-h-[300px]">
                {activeStep === 1 && <Step1View form={form} />}
                {activeStep === 2 && <Step2View form={form} />}
                {activeStep === 3 && <Step3View form={form} />}
                {activeStep === 4 && <Step4View form={form} />}
                {activeStep === 5 && <Step5View form={form} />}
                {activeStep === 6 && <Step6View form={form} />}
            </div>

            {/* Approval / Rejection Action Panel */}
            {data.isCompleted && (
                <div className="flex flex-col gap-3 pt-4 border-t border-[#EFEAF8] mt-4">
                    {data.isRejected ? (
                        <>
                        <div className="flex items-center justify-center p-3 rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider">
                            ✗ This application has been rejected by the admin.
                        </div>
                        {data.rejectionReason && (
                            <div className="rounded-[8px] border border-rose-100 bg-rose-50 p-3">
                                <p className="text-[9px] font-black uppercase tracking-wider text-rose-500">Rejection Reason</p>
                                <p className="mt-1 text-xs font-bold text-rose-700">{data.rejectionReason}</p>
                            </div>
                        )}
                        </>
                    ) : data.isLive ? (
                        <div className="flex items-center justify-center p-3 rounded-[8px] border border-emerald-100 bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider">
                            ✓ This application is approved and live!
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-4 bg-[#F8F9FF] border border-[#E1DDF0] rounded-[8px] p-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#797298]">Admin Compliance Action</span>
                                <span className="text-xs font-bold text-[#171327] mt-0.5">Please review all 6 steps before decisioning.</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onReject(data.id)}
                                    className="h-9 px-4 rounded-[6px] border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-black uppercase tracking-wider transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onApprove(data.id)}
                                    className="h-9 px-4 rounded-[6px] bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                                >
                                    Approve & Go Live
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const PanelOverview = () => {
    // API-driven stats
    const [stats, setStats] = useState({ pending_kyc: 0, active_panel_users: 0, in_onboarding: 0, field_meetings: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    const metrics = [
        { key: 'pending_kyc', title: 'Pending KYC', value: stats.pending_kyc, color: '#F59E0B', progress: Math.min(stats.pending_kyc, 100), change: 'KYC' },
        { key: 'active_panel_users', title: 'Active Panel Users', value: stats.active_panel_users, color: '#10B981', progress: Math.min(stats.active_panel_users, 100), change: 'APPROVED' },
        { key: 'in_onboarding', title: 'In Onboarding', value: stats.in_onboarding, color: '#2717D7', progress: Math.min(stats.in_onboarding, 100), change: 'REVIEW' },
        { key: 'field_meetings', title: "Today's Meetings", value: stats.field_meetings, color: '#8B5CF6', progress: Math.min(stats.field_meetings * 10, 100), change: 'TODAY' },
    ];

    // Main layout tabs
    const [activeTab, setActiveTab] = useState('project'); // 'project' | 'fieldOfficer'
    const [activeProjectSubTab, setActiveProjectSubTab] = useState('approveKyc'); // 'approveKyc' | 'onboardingProgress' | 'live' | 'rejected'
    const [activeOfficerSubTab, setActiveOfficerSubTab] = useState('newAquisition');

    // Builder KYC state (API-driven)
    const [kycRecords, setKycRecords] = useState([]);
    const [kycLoading, setKycLoading] = useState(false);
    const [kycSubTab, setKycSubTab] = useState('pending');
    const [selectedKycBuilderId, setSelectedKycBuilderId] = useState('');
    const [kycDetails, setKycDetails] = useState(null);
    const [kycDetailsLoading, setKycDetailsLoading] = useState(false);

    const kycFilteredRecords = kycRecords.filter(b => b.kycStatus === kycSubTab);
    const selectedKycBuilder = kycFilteredRecords.find(b => b.id === selectedKycBuilderId) || kycFilteredRecords[0] || null;

    // Field Officers state (API-driven)
    const [fieldOfficers, setFieldOfficers] = useState([]);
    const [selectedOfficerId, setSelectedOfficerId] = useState('');
    const [officerDetails, setOfficerDetails] = useState(null);
    const [officerLeads, setOfficerLeads] = useState([]);
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);

    const selectedOfficer = officerDetails;
    const selectedLead = selectedLeadDetails;

    const [activeActivityTab, setActiveActivityTab] = useState('meetings');

    // Onboarding projects state (API-driven)
    const [projectOnboarding, setProjectOnboarding] = useState([]);
    const [onboardingLoading, setOnboardingLoading] = useState(false);
    const [projectOnboardTab, setProjectOnboardTab] = useState('drafted');
    const [selectedProjectOnboardId, setSelectedProjectOnboardId] = useState('');
    const [projectActiveStep, setProjectActiveStep] = useState(1);
    const [projectOnboardDetails, setProjectOnboardDetails] = useState(null);
    const [projectOnboardDetailsLoading, setProjectOnboardDetailsLoading] = useState(false);

    // Live / Rejected projects (API-driven)
    const [liveProjects, setLiveProjects] = useState([]);
    const [rejectedProjects, setRejectedProjects] = useState([]);
    const [liveLoading, setLiveLoading] = useState(false);
    const [rejectedLoading, setRejectedLoading] = useState(false);

    // Tasks (API-driven)
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskProject, setTaskProject] = useState('');
    const [taskLocation, setTaskLocation] = useState('');
    const [taskPriority, setTaskPriority] = useState('Medium');
    const [taskDue, setTaskDue] = useState('Today');
    const [taskTime, setTaskTime] = useState('12:00 PM');
    const [taskNote, setTaskNote] = useState('');
    const [taskOfficerId, setTaskOfficerId] = useState('');
    const [taskActiveFilter, setTaskActiveFilter] = useState('all');

    // Live tracking map locations
    const [officerLocations, setOfficerLocations] = useState({});

    // --- API fetch helpers ---
    const loadStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const res = await fetchPanelStats();
            if (res?.success) setStats(res.data);
        } catch (e) {
            console.error('Failed to load panel stats', e);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const loadKycList = useCallback(async (status = kycSubTab) => {
        try {
            setKycLoading(true);
            const res = await fetchBuilderKycList({ status });
            if (res?.success) {
                const mapped = (res.data || []).map(mapBuilderKyc);
                setKycRecords(prev => {
                    // Replace records for this status, keep others
                    const others = prev.filter(r => r.kycStatus !== status);
                    return [...others, ...mapped];
                });
                if (mapped.length > 0) setSelectedKycBuilderId(mapped[0].id);
            }
        } catch (e) {
            console.error('Failed to load KYC list', e);
        } finally {
            setKycLoading(false);
        }
    }, [kycSubTab]);

    const loadKycDetails = useCallback(async (id) => {
        if (!id) return;
        try {
            setKycDetailsLoading(true);
            const res = await fetchBuilderKycDetails(id);
            if (res?.success && res.data) {
                const { profile, documents } = res.data;
                const docEntries = Object.entries(documents || {});
                const kycDocuments = docEntries
                    .filter(([, url]) => url)
                    .map(([key, url], idx) => ({
                        id: `${id}-${idx}`,
                        label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                        image: url,
                    }));
                setKycDetails({ ...mapBuilderKyc({ ...profile, name: profile.name }), kycDocuments });
            }
        } catch (e) {
            console.error('Failed to load KYC details', e);
        } finally {
            setKycDetailsLoading(false);
        }
    }, []);

    const loadFieldOfficers = useCallback(async () => {
        try {
            const res = await fetchFieldOfficersDropdown();
            if (res?.success) {
                setFieldOfficers(res.data || []);
                if (res.data?.length > 0) {
                    setSelectedOfficerId(res.data[0].id);
                    setTaskOfficerId(res.data[0].id);
                }
            }
        } catch (e) {
            console.error('Failed to load field officers', e);
        }
    }, []);

    const loadOfficerDetails = useCallback(async (officerId) => {
        if (!officerId) return;
        try {
            const res = await fetchOfficerDetails(officerId);
            if (res?.success && res.data) {
                setOfficerDetails(res.data);
                setOfficerLocations(prev => ({
                    ...prev,
                    [officerId]: {
                        name: res.data.full_name,
                        lat: 22.7196 + Math.random() * 0.05,
                        lng: 75.8577 + Math.random() * 0.05,
                        status: res.data.active_duty ? 'Online' : 'Offline',
                    },
                }));
            }
        } catch (e) {
            console.error('Failed to load officer details', e);
        }
    }, []);

    const loadOfficerLeads = useCallback(async (officerId) => {
        if (!officerId) return;
        try {
            const res = await fetchOfficerBuilderLeads(officerId);
            if (res?.success) {
                setOfficerLeads(res.data || []);
                if (res.data?.length > 0) setSelectedLeadId(res.data[0].id);
                else setSelectedLeadId('');
            }
        } catch (e) {
            console.error('Failed to load officer leads', e);
        }
    }, []);

    const loadLeadDetails = useCallback(async (leadId) => {
        if (!leadId) return;
        try {
            const res = await fetchBuilderLeadDetails(leadId);
            if (res?.success && res.data) setSelectedLeadDetails(res.data);
        } catch (e) {
            console.error('Failed to load lead details', e);
        }
    }, []);

    const loadOnboardingProjects = useCallback(async (tab = projectOnboardTab) => {
        try {
            setOnboardingLoading(true);
            const res = await fetchOnboardingProjects({ tab });
            if (res?.success) {
                const mapped = (res.data || []).map(mapOnboardingProject);
                setProjectOnboarding(mapped);
                if (mapped.length > 0) {
                    setSelectedProjectOnboardId(mapped[0].id);
                    setProjectActiveStep(mapped[0].currentStep || 1);
                }
            }
        } catch (e) {
            console.error('Failed to load onboarding projects', e);
        } finally {
            setOnboardingLoading(false);
        }
    }, [projectOnboardTab]);

    const loadProjectOnboardDetails = useCallback(async (id) => {
        if (!id) return;
        try {
            setProjectOnboardDetailsLoading(true);
            const res = await fetchProjectOnboardingDetails(id);
            if (res?.success && res.data) setProjectOnboardDetails(res.data);
        } catch (e) {
            console.error('Failed to load project onboard details', e);
        } finally {
            setProjectOnboardDetailsLoading(false);
        }
    }, []);

    const loadLiveProjects = useCallback(async () => {
        try {
            setLiveLoading(true);
            const res = await fetchLiveProjects();
            if (res?.success) setLiveProjects(res.data || []);
        } catch (e) {
            console.error('Failed to load live projects', e);
        } finally {
            setLiveLoading(false);
        }
    }, []);

    const loadRejectedProjects = useCallback(async () => {
        try {
            setRejectedLoading(true);
            const res = await fetchRejectedProjects();
            if (res?.success) setRejectedProjects(res.data || []);
        } catch (e) {
            console.error('Failed to load rejected projects', e);
        } finally {
            setRejectedLoading(false);
        }
    }, []);

    const loadTasks = useCallback(async () => {
        try {
            setTasksLoading(true);
            const res = await fetchAllBranchFieldTasks();
            if (res?.success) setTasks(res.data || []);
        } catch (e) {
            console.error('Failed to load tasks', e);
        } finally {
            setTasksLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => { loadStats(); }, [loadStats]);
    useEffect(() => { loadKycList('pending'); loadKycList('approved'); loadKycList('rejected'); }, []);
    useEffect(() => { loadFieldOfficers(); }, [loadFieldOfficers]);

    // Load officer details + leads when officer changes
    useEffect(() => {
        if (selectedOfficerId) {
            loadOfficerDetails(selectedOfficerId);
            loadOfficerLeads(selectedOfficerId);
        }
    }, [selectedOfficerId, loadOfficerDetails, loadOfficerLeads]);

    // Load lead details when lead changes
    useEffect(() => {
        if (selectedLeadId) loadLeadDetails(selectedLeadId);
    }, [selectedLeadId, loadLeadDetails]);

    // Load KYC details when selected builder changes
    useEffect(() => {
        if (selectedKycBuilderId) loadKycDetails(selectedKycBuilderId);
    }, [selectedKycBuilderId, loadKycDetails]);

    // Load onboarding when tab changes
    useEffect(() => { loadOnboardingProjects(projectOnboardTab); }, [projectOnboardTab]);

    // Load project onboard details when selection changes
    useEffect(() => {
        if (selectedProjectOnboardId) loadProjectOnboardDetails(selectedProjectOnboardId);
    }, [selectedProjectOnboardId, loadProjectOnboardDetails]);

    // Load live/rejected when those sub-tabs become active
    useEffect(() => {
        if (activeProjectSubTab === 'live') loadLiveProjects();
        if (activeProjectSubTab === 'rejected') loadRejectedProjects();
    }, [activeProjectSubTab]);

    // Load tasks when tasks tab becomes active
    useEffect(() => {
        if (activeOfficerSubTab === 'tasks') loadTasks();
    }, [activeOfficerSubTab]);

    // Keep kycFilteredRecords in sync when kycSubTab changes
    useEffect(() => {
        const current = kycRecords.filter(r => r.kycStatus === kycSubTab);
        if (current.length > 0) setSelectedKycBuilderId(current[0].id);
        else setSelectedKycBuilderId('');
    }, [kycSubTab]);

    const handleAssignTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !taskProject.trim() || !taskLocation.trim()) return;

        const assignedOfficer = fieldOfficers.find(fo => fo.id === taskOfficerId) || fieldOfficers[0];
        const body = {
            title: taskTitle,
            project_name: taskProject,
            location: taskLocation,
            due: taskDue,
            time: taskTime,
            priority: taskPriority,
            officer_id: taskOfficerId,
            officer_name: assignedOfficer?.name || '',
            note: taskNote,
        };

        try {
            await assignFieldTask(body);
            await loadTasks();
        } catch (e) {
            console.error('Failed to assign task', e);
        }

        setTaskTitle('');
        setTaskProject('');
        setTaskLocation('');
        setTaskPriority('Medium');
        setTaskDue('Today');
        setTaskTime('12:00 PM');
        setTaskNote('');
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await completeFieldTask(taskId);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
        } catch (e) {
            console.error('Failed to complete task', e);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteFieldTask(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (e) {
            console.error('Failed to delete task', e);
        }
    };

    const handleProjectOnboardTabChange = (tab) => {
        setProjectOnboardTab(tab);
        setProjectActiveStep(1);
        loadOnboardingProjects(tab);
    };

    const handleOfficerOnboardTabChange = () => {};

    // Approval / Rejection Handlers
    const handleApproveProject = async (id) => {
        try {
            await decideProjectOnboarding(id, { action: 'approve' });
            setProjectOnboarding(prev => prev.map(item =>
                item.id === id ? { ...item, isLive: true, isRejected: false, rejectionReason: '' } : item
            ));
        } catch (e) {
            console.error('Failed to approve project', e);
        }
    };

    const handleRejectProject = async (id) => {
        const reason = window.prompt('Enter rejection reason for this project onboarding');
        if (!reason?.trim()) return;
        try {
            await decideProjectOnboarding(id, { action: 'reject', reason });
            setProjectOnboarding(prev => prev.map(item =>
                item.id === id ? { ...item, isLive: false, isRejected: true, rejectionReason: reason.trim() } : item
            ));
        } catch (e) {
            console.error('Failed to reject project', e);
        }
    };

    const handleApproveKycBuilder = async (id) => {
        try {
            await updateBuilderKycStatus(id, { document_status: 'approved' });
            setKycRecords(prev => prev.map(item =>
                item.id === id ? { ...item, kycStatus: 'approved', rejectionReason: '' } : item
            ));
            setKycSubTab('approved');
            setSelectedKycBuilderId(id);
        } catch (e) {
            console.error('Failed to approve KYC', e);
        }
    };

    const handleRejectKycBuilder = async (id) => {
        const reason = window.prompt('Enter rejection reason for this builder KYC');
        if (!reason?.trim()) return;
        try {
            await updateBuilderKycStatus(id, { document_status: 'rejected', rejection_reason: reason.trim() });
            setKycRecords(prev => prev.map(item =>
                item.id === id ? { ...item, kycStatus: 'rejected', rejectionReason: reason.trim() } : item
            ));
            setKycSubTab('rejected');
            setSelectedKycBuilderId(id);
        } catch (e) {
            console.error('Failed to reject KYC', e);
        }
    };

    const handleApproveOfficer = () => {};
    const handleRejectOfficer = () => {};

    // Pagination states
    const [meetingPage, setMeetingPage] = useState(1);
    const [followupPage, setFollowupPage] = useState(1);
    
    const ITEMS_PER_PAGE = 5;

    const handleOfficerSelect = (id) => {
        setSelectedOfficerId(id);
        setMeetingPage(1);
        setFollowupPage(1);
    };

    // Filtered Onboarding calculations
    const projectOnboardFiltered = projectOnboarding.filter(p => 
        projectOnboardTab === 'done' ? p.isCompleted : !p.isCompleted
    );
    const selectedProjectOnboardItem = projectOnboardFiltered.find(p => p.id === selectedProjectOnboardId) || projectOnboardFiltered[0];

    // Field officer onboarding (not used - officer onboarding driven by project onboarding for now)
    const officerOnboardFiltered = [];
    const selectedOfficerOnboardItem = null;

    const handleLeadSelect = (id) => {
        setSelectedLeadId(id);
        setMeetingPage(1);
        setFollowupPage(1);
    };

    const handleActivityTabSelect = (tab) => {
        setActiveActivityTab(tab);
        setMeetingPage(1);
        setFollowupPage(1);
    };

    // Paginated Meetings calculations
    const leadMeetings = selectedLead?.meetings || [];
    const totalMeetingsPages = Math.ceil(leadMeetings.length / ITEMS_PER_PAGE) || 1;
    const paginatedMeetings = leadMeetings.slice(
        (meetingPage - 1) * ITEMS_PER_PAGE,
        meetingPage * ITEMS_PER_PAGE
    );

    // Paginated Followups calculations
    const leadFollowUps = selectedLead?.followups || [];
    const totalFollowupsPages = Math.ceil(leadFollowUps.length / ITEMS_PER_PAGE) || 1;
    const paginatedFollowups = leadFollowUps.slice(
        (followupPage - 1) * ITEMS_PER_PAGE,
        followupPage * ITEMS_PER_PAGE
    );

    // Audio Playback State & Handlers
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});
    const [leafletLoaded, setLeafletLoaded] = useState(!!window.L);

    useEffect(() => {
        if (window.L) {
            setLeafletLoaded(true);
            return;
        }

        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);

        // Inject custom animations CSS
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse {
                0% { transform: scale(0.9); opacity: 0.9; }
                50% { transform: scale(1.15); opacity: 0.3; }
                100% { transform: scale(1.4); opacity: 0; }
            }
            .custom-officer-icon {
                background: none !important;
                border: none !important;
            }
        `;
        document.head.appendChild(style);

        script.onload = () => {
            setLeafletLoaded(true);
        };

        return () => {
            if (link.parentNode) link.parentNode.removeChild(link);
            if (script.parentNode) script.parentNode.removeChild(script);
            if (style.parentNode) style.parentNode.removeChild(style);
        };
    }, []);

    useEffect(() => {
        const L = window.L;
        if (activeTab === 'fieldOfficer' && activeOfficerSubTab === 'tasks' && L && mapRef.current && !mapInstance.current) {
            const selectedLoc = officerLocations[selectedOfficerId];
            const initialView = selectedLoc ? [selectedLoc.lat, selectedLoc.lng] : [22.7196, 75.8577];
            const initialZoom = selectedLoc ? 13 : 12;

            const map = L.map(mapRef.current).setView(initialView, initialZoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            mapInstance.current = map;

            setTimeout(() => {
                map.invalidateSize();
            }, 200);
            
            // Render initial markers
            Object.entries(officerLocations).forEach(([id, fo]) => {
                const color = id === 'FO-001' ? '#2717D7' : id === 'FO-002' ? '#10B981' : '#F59E0B';
                const initial = fo.name.split(' ').map(n => n[0]).join('');
                
                const customIcon = L.divIcon({
                    className: 'custom-officer-icon',
                    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: 900; position: relative;">
                             <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; border: 2px solid ${color}; top: -6px; left: -6px; opacity: 0.4; animation: pulse 2s infinite;"></span>
                             ${initial}
                           </div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                const marker = L.marker([fo.lat, fo.lng], { icon: customIcon }).addTo(map)
                    .bindPopup(`<b>${fo.name}</b><br/>Status: ${fo.status}<br/>Coordinates: ${fo.lat}, ${fo.lng}`);
                markersRef.current[id] = marker;
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markersRef.current = {};
            }
        };
    }, [activeTab, activeOfficerSubTab, leafletLoaded]);

    useEffect(() => {
        const L = window.L;
        if (!L || !mapInstance.current) return;

        const selectedLoc = officerLocations[selectedOfficerId];
        if (selectedLoc) {
            mapInstance.current.panTo([selectedLoc.lat, selectedLoc.lng]);
        }
    }, [selectedOfficerId]);

    useEffect(() => {
        const L = window.L;
        if (!L || !mapInstance.current) return;

        Object.entries(officerLocations).forEach(([id, fo]) => {
            const color = id === 'FO-001' ? '#2717D7' : id === 'FO-002' ? '#10B981' : '#F59E0B';
            const initial = fo.name.split(' ').map(n => n[0]).join('');
            
            const customIcon = L.divIcon({
                className: 'custom-officer-icon',
                html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: 900; position: relative;">
                         <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; border: 2px solid ${color}; top: -6px; left: -6px; opacity: 0.4; animation: pulse 2s infinite;"></span>
                         ${initial}
                       </div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            if (markersRef.current[id]) {
                markersRef.current[id].setLatLng([fo.lat, fo.lng]);
                markersRef.current[id].setIcon(customIcon);
                markersRef.current[id].getPopup().setContent(`<b>${fo.name}</b><br/>Status: ${fo.status}<br/>Coordinates: ${fo.lat}, ${fo.lng}`);
            } else {
                const marker = L.marker([fo.lat, fo.lng], { icon: customIcon }).addTo(mapInstance.current)
                    .bindPopup(`<b>${fo.name}</b><br/>Status: ${fo.status}<br/>Coordinates: ${fo.lat}, ${fo.lng}`);
                markersRef.current[id] = marker;
            }
        });
    }, [officerLocations]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handlePlayPause = (id, url) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play().catch(err => {
                console.error("Audio playback failed:", err);
                setPlayingId(null);
            });
            setPlayingId(id);
            audio.onended = () => {
                setPlayingId(null);
            };
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.warn("Direct download failed due to CORS or network error, opening file in new tab:", error);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-[#F5F6FA] text-[#15121F]">
            <Header title="Panel Overview" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-[1600px] space-y-6">
                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {statsLoading ? (
                            <div className="col-span-4 flex items-center justify-center py-8">
                                <Loader2 size={20} className="animate-spin text-[#2717D7]" />
                            </div>
                        ) : metrics.map((metric) => (
                            <PanelMetricCard key={metric.key} metric={metric} />
                        ))}
                    </div>

                    {/* Tabs Section */}
                    <div className="space-y-4 rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_0_rgba(33,24,88,0.03)]">
                        {/* Main Tabs */}
                        <div className="flex border-b border-[#EFEAF8] pb-1">
                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('project')}
                                    className={`pb-2 text-sm font-black uppercase tracking-[0.12em] transition-all relative ${
                                        activeTab === 'project'
                                            ? 'text-[#2717D7]'
                                            : 'text-[#5E5A71] hover:text-[#2717D7]'
                                    }`}
                                >
                                    Project
                                    {activeTab === 'project' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('fieldOfficer')}
                                    className={`pb-2 text-sm font-black uppercase tracking-[0.12em] transition-all relative ${
                                        activeTab === 'fieldOfficer'
                                            ? 'text-[#2717D7]'
                                            : 'text-[#5E5A71] hover:text-[#2717D7]'
                                    }`}
                                >
                                    Field Officer
                                    {activeTab === 'fieldOfficer' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Selected Builder Basic Details (Signup Data) */}
                        {activeTab === 'project' && (
                            <div className="space-y-4 pb-4 border-b border-[#EFEAF8]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div />
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Online & Verified</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-[8px] bg-[#F8F9FF] border border-[#E1DDF0]">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">First Name</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{(kycDetails || kycFilteredRecords[0])?.firstName || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Last Name</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{(kycDetails || kycFilteredRecords[0])?.lastName || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Phone Number</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{(kycDetails || kycFilteredRecords[0])?.mobile || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Company Type</p>
                                        <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB]">
                                            {(kycDetails || kycFilteredRecords[0])?.companyType || 'Builder'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">RERA Number</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5 tracking-wide">{(kycDetails || kycFilteredRecords[0])?.reraNumber || '—'}</p>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Location</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5 truncate">{(kycDetails || kycFilteredRecords[0])?.location || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Selected Field Officer Basic Details (Signup Data) */}
                        {activeTab === 'fieldOfficer' && (
                            <div className="space-y-4 pb-4 border-b border-[#EFEAF8]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71]">Select Field Officer:</span>
                                        <select
                                            value={selectedOfficerId}
                                            onChange={(e) => handleOfficerSelect(e.target.value)}
                                            className="h-9 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all shadow-sm"
                                        >
                                            {fieldOfficers.map((fo) => (
                                                <option key={fo.id} value={fo.id}>
                                                    {fo.name} ({fo.area || 'Unassigned'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Active Duty</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-[8px] bg-[#F8F9FF] border border-[#E1DDF0]">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Full Name</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedOfficer?.full_name || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Mobile Number</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedOfficer?.mobile_number || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Assigned Area</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5 truncate">{selectedOfficer?.assigned_area || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Zone</p>
                                        <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB]">
                                            {selectedOfficer?.zone || 'Zone A-1'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Status</p>
                                        <p className="text-xs font-black text-emerald-600 mt-0.5">{selectedOfficer?.status || 'Active'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sub Tabs */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {activeTab === 'project' ? (
                                <>
                                    {[
                                        { id: 'approveKyc', label: 'Approve KYC' },
                                        { id: 'onboardingProgress', label: 'Onboarding progress' },
                                        { id: 'live', label: 'Live' },
                                        { id: 'rejected', label: 'Rejected' },
                                    ].map((subTab) => {
                                        const isActive = activeProjectSubTab === subTab.id;
                                        return (
                                            <button
                                                key={subTab.id}
                                                type="button"
                                                onClick={() => setActiveProjectSubTab(subTab.id)}
                                                className={`h-9 rounded-[6px] border px-3.5 text-xs font-black uppercase tracking-[0.1em] transition-all ${
                                                    isActive
                                                        ? 'border-[#2717D7] bg-[#2717D7] text-white shadow-sm'
                                                        : 'border-[#D8D2EB] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                }`}
                                            >
                                                {subTab.label}
                                            </button>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    {[
                                        { id: 'newAquisition', label: 'New Aquisition' },
                                        { id: 'onboardingProgress', label: 'Onboarding progress' },
                                        { id: 'live', label: 'Live' },
                                        { id: 'tasks', label: 'Tasks' },
                                        { id: 'rejected', label: 'Rejected' },
                                    ].map((subTab) => {
                                        const isActive = activeOfficerSubTab === subTab.id;
                                        return (
                                            <button
                                                key={subTab.id}
                                                type="button"
                                                onClick={() => setActiveOfficerSubTab(subTab.id)}
                                                className={`h-9 rounded-[6px] border px-3.5 text-xs font-black uppercase tracking-[0.1em] transition-all ${
                                                    isActive
                                                        ? 'border-[#2717D7] bg-[#2717D7] text-white shadow-sm'
                                                        : 'border-[#D8D2EB] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                }`}
                                            >
                                                {subTab.label}
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="mt-4">
                            {activeTab === 'project' && (
                                <>
                                    {activeProjectSubTab === 'onboardingProgress' ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                            {/* Left Column: Projects lists */}
                                            <div className="lg:col-span-1 space-y-4">
                                                <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    {/* Nested Tabs drafted & done */}
                                                    <div className="flex border-b border-[#EFEAF8] pb-1 mb-3">
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleProjectOnboardTabChange('drafted')}
                                                                className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                    projectOnboardTab === 'drafted'
                                                                        ? 'text-[#2717D7]'
                                                                        : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                                }`}
                                                            >
                                                                Drafted ({projectOnboarding.filter(p => !p.isCompleted).length})
                                                                {projectOnboardTab === 'drafted' && (
                                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleProjectOnboardTabChange('done')}
                                                                className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                    projectOnboardTab === 'done'
                                                                        ? 'text-[#2717D7]'
                                                                        : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                                }`}
                                                            >
                                                                Done ({projectOnboarding.filter(p => p.isCompleted).length})
                                                                {projectOnboardTab === 'done' && (
                                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* List of items */}
                                                    {projectOnboardFiltered.length === 0 ? (
                                                        <div className="text-center py-8 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                            <p className="text-xs font-bold text-[#5E5A71]">No projects in this stage.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                                            {projectOnboardFiltered.map((proj) => {
                                                                const isSelected = selectedProjectOnboardId === proj.id;
                                                                const progressPct = proj.isCompleted ? 100 : Math.round(((proj.currentStep - 1) / 6) * 100);
                                                                return (
                                                                    <button
                                                                        key={proj.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedProjectOnboardId(proj.id);
                                                                            setProjectActiveStep(proj.isCompleted ? 1 : proj.currentStep);
                                                                        }}
                                                                        className={`w-full text-left p-3 rounded-[8px] border transition-all ${
                                                                            isSelected
                                                                                ? 'border-[#2717D7] bg-[#F4F1FF] text-[#2717D7]'
                                                                                : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]/40 text-[#171327]'
                                                                        }`}
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <p className="text-xs font-black truncate max-w-[120px]">{proj.projectName}</p>
                                                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                                                proj.isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                                            }`}>
                                                                                {proj.isCompleted ? 'Completed' : `Step ${proj.currentStep}`}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-[#5E5A71] mt-0.5 truncate">{proj.builderName}</p>
                                                                        
                                                                        {/* Progress Bar */}
                                                                        <div className="mt-3 flex items-center gap-2">
                                                                            <div className="flex-1 h-1 rounded-full bg-[#EFEAF8] overflow-hidden">
                                                                                <div 
                                                                                    className={`h-full rounded-full ${proj.isCompleted ? 'bg-emerald-500' : 'bg-[#2717D7]'}`}
                                                                                    style={{ width: `${progressPct}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-[8px] font-black text-[#5E5A71]">{progressPct}%</span>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Column: Step-wise Form Detail View */}
                                            <div className="lg:col-span-2">
                                                {selectedProjectOnboardItem ? (
                                                    <OnboardingDetailViewer 
                                                        data={selectedProjectOnboardItem} 
                                                        activeStep={projectActiveStep} 
                                                        setActiveStep={setProjectActiveStep} 
                                                        onApprove={handleApproveProject}
                                                        onReject={handleRejectProject}
                                                    />
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center rounded-[10px] border border-[#D8D2EB] bg-white p-8 text-center min-h-[350px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                        <Compass className="h-10 w-10 text-[#A49DB8] mb-3 animate-pulse" />
                                                        <p className="text-sm font-black text-[#171327]">No Project Selected</p>
                                                        <p className="text-xs font-bold text-[#5E5A71] mt-1">Select a draft or completed onboarding progress record to view its step-wise data.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : activeProjectSubTab === 'live' ? (
                                        <div className="pt-2">
                                            {projectOnboarding.filter(p => p.isLive).length === 0 ? (
                                                <div className="text-center py-12 px-4 border border-dashed border-[#D8D2EB] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    <CheckCircle2 className="mx-auto h-12 w-12 text-[#A49DB8] mb-3 stroke-[1.5]" />
                                                    <h4 className="text-sm font-black text-[#171327] uppercase tracking-wider">No Live Projects</h4>
                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1.5 max-w-md mx-auto">
                                                        Go to the "Onboarding progress" sub-tab and select the "Done" list to review and approve completed builder applications.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {projectOnboarding.filter(p => p.isLive).map((proj) => {
                                                        const selectedTypes = proj.form?.step2?.selectedTypes || [];
                                                        const city = proj.form?.step1?.city || '';
                                                        const location = proj.form?.step1?.location || '';
                                                        return (
                                                            <div key={proj.id} className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_2px_4px_rgba(33,24,88,0.02)] hover:shadow-[0_4px_12px_rgba(33,24,88,0.06)] transition-all flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <h4 className="text-sm font-black text-[#171327] leading-snug">{proj.projectName}</h4>
                                                                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-600 tracking-wider shrink-0">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                            Live
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1">{proj.builderName}</p>
                                                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#5E5A71]">
                                                                        <MapPin size={13} className="text-[#2717D7]" />
                                                                        <span className="truncate">{location ? `${location}, ` : ''}{city}</span>
                                                                    </div>
                                                                    {selectedTypes.length > 0 && (
                                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                                            {selectedTypes.map((type, idx) => (
                                                                                <span key={idx} className="bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                                                                    {type.subType || type.mainType}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {proj.rejectionReason && (
                                                                        <div className="mt-3 rounded-[8px] border border-rose-100 bg-rose-50 p-2.5">
                                                                            <p className="text-[8px] font-black uppercase tracking-wider text-rose-500">Rejection Reason</p>
                                                                            <p className="mt-1 text-[10px] font-bold leading-relaxed text-rose-700">{proj.rejectionReason}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-5 pt-3 border-t border-[#EFEAF8] flex items-center justify-between">
                                                                    <span className="text-[10px] text-[#A49DB8] font-bold">Updated {proj.lastUpdated || 'recently'}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setActiveProjectSubTab('onboardingProgress');
                                                                            setProjectOnboardTab('done');
                                                                            setSelectedProjectOnboardId(proj.id);
                                                                            setProjectActiveStep(1);
                                                                        }}
                                                                        className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#2717D7] hover:text-[#1a0fa3] transition-colors"
                                                                    >
                                                                        View Details
                                                                        <ChevronRight size={14} strokeWidth={2.5} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : activeProjectSubTab === 'rejected' ? (
                                        <div className="pt-2">
                                            {projectOnboarding.filter(p => p.isRejected).length === 0 ? (
                                                <div className="text-center py-12 px-4 border border-dashed border-[#D8D2EB] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    <ShieldAlert className="mx-auto h-12 w-12 text-[#A49DB8] mb-3 stroke-[1.5]" />
                                                    <h4 className="text-sm font-black text-[#171327] uppercase tracking-wider">No Rejected Projects</h4>
                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1.5 max-w-md mx-auto">
                                                        No projects have been rejected by the admin. Completed submissions can be rejected during review.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {projectOnboarding.filter(p => p.isRejected).map((proj) => {
                                                        const selectedTypes = proj.form?.step2?.selectedTypes || [];
                                                        const city = proj.form?.step1?.city || '';
                                                        const location = proj.form?.step1?.location || '';
                                                        return (
                                                            <div key={proj.id} className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_2px_4px_rgba(33,24,88,0.02)] hover:shadow-[0_4px_12px_rgba(33,24,88,0.06)] transition-all flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <h4 className="text-sm font-black text-[#171327] leading-snug">{proj.projectName}</h4>
                                                                        <span className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-rose-600 tracking-wider shrink-0">
                                                                            Rejected
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1">{proj.builderName}</p>
                                                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#5E5A71]">
                                                                        <MapPin size={13} className="text-[#2717D7]" />
                                                                        <span className="truncate">{location ? `${location}, ` : ''}{city}</span>
                                                                    </div>
                                                                    {selectedTypes.length > 0 && (
                                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                                            {selectedTypes.map((type, idx) => (
                                                                                <span key={idx} className="bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                                                                    {type.subType || type.mainType}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {proj.rejectionReason && (
                                                                        <div className="mt-3 rounded-[8px] border border-rose-100 bg-rose-50 p-2.5">
                                                                            <p className="text-[8px] font-black uppercase tracking-wider text-rose-500">Rejection Reason</p>
                                                                            <p className="mt-1 text-[10px] font-bold leading-relaxed text-rose-700">{proj.rejectionReason}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-5 pt-3 border-t border-[#EFEAF8] flex items-center justify-between">
                                                                    <span className="text-[10px] text-[#A49DB8] font-bold">Updated {proj.lastUpdated || 'recently'}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setActiveProjectSubTab('onboardingProgress');
                                                                            setProjectOnboardTab('done');
                                                                            setSelectedProjectOnboardId(proj.id);
                                                                            setProjectActiveStep(1);
                                                                        }}
                                                                        className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#2717D7] hover:text-[#1a0fa3] transition-colors"
                                                                    >
                                                                        View Details
                                                                        <ChevronRight size={14} strokeWidth={2.5} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                            <div className="lg:col-span-1 rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                <div className="flex items-center justify-between border-b border-[#EFEAF8] pb-3">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#171327]">Builder KYC</h4>
                                                        <p className="text-[10px] font-bold text-[#5E5A71] mt-0.5">Signup records grouped by review status</p>
                                                    </div>
                                                    <span className="rounded-full bg-[#F4F1FF] px-2 py-0.5 text-[9px] font-black text-[#2717D7] border border-[#D8D2EB]">
                                                        {kycFilteredRecords.length}
                                                    </span>
                                                </div>

                                                <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-[8px] bg-[#F8F9FF] p-1 border border-[#E1DDF0]">
                                                    {[
                                                        { id: 'pending', label: 'Pending' },
                                                        { id: 'approved', label: 'Approved' },
                                                        { id: 'rejected', label: 'Rejected' },
                                                    ].map((tab) => {
                                                        const isActive = kycSubTab === tab.id;
                                                        const count = kycRecords.filter((builder) => builder.kycStatus === tab.id).length;
                                                        return (
                                                            <button
                                                                key={tab.id}
                                                                type="button"
                                                                onClick={() => setKycSubTab(tab.id)}
                                                                className={`rounded-[6px] px-2 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${
                                                                    isActive
                                                                        ? 'bg-[#2717D7] text-white shadow-sm'
                                                                        : 'text-[#5E5A71] hover:bg-white hover:text-[#2717D7]'
                                                                }`}
                                                            >
                                                                {tab.label} ({count})
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <div className="mt-3 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                                    {kycFilteredRecords.length === 0 ? (
                                                        <div className="rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-6 text-center">
                                                            <p className="text-xs font-bold text-[#797298]">No builders in this KYC stage.</p>
                                                        </div>
                                                    ) : kycFilteredRecords.map((builder) => {
                                                        const isSelected = selectedKycBuilder?.id === builder.id;
                                                        return (
                                                            <button
                                                                key={builder.id}
                                                                type="button"
                                                                onClick={() => setSelectedKycBuilderId(builder.id)}
                                                                className={`w-full text-left rounded-[8px] border p-3 transition-all ${
                                                                    isSelected
                                                                        ? 'border-[#2717D7] bg-[#F4F1FF]'
                                                                        : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]/40'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="min-w-0">
                                                                        <p className={`truncate text-xs font-black ${isSelected ? 'text-[#2717D7]' : 'text-[#171327]'}`}>
                                                                            {builder.companyName}
                                                                        </p>
                                                                        <p className="mt-0.5 truncate text-[10px] font-bold text-[#5E5A71]">
                                                                            {builder.firstName} {builder.lastName}
                                                                        </p>
                                                                    </div>
                                                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                                                                        builder.kycStatus === 'approved'
                                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                            : builder.kycStatus === 'rejected'
                                                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                                                    }`}>
                                                                        {builder.kycStatus}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-2 truncate font-mono text-[10px] font-black text-[#5E5A71]">
                                                                    {builder.reraNumber}
                                                                </p>
                                                                {builder.kycStatus === 'rejected' && builder.rejectionReason && (
                                                                    <p className="mt-2 line-clamp-2 text-[10px] font-bold text-rose-600">
                                                                        {builder.rejectionReason}
                                                                    </p>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2 rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#EFEAF8] pb-4">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#797298]">Project panel signup</p>
                                                        <h3 className="mt-1 text-lg font-black text-[#171327]">{selectedKycBuilder?.companyName}</h3>
                                                        <p className="mt-1 text-xs font-bold text-[#5E5A71]">
                                                            Basic details collected from the project-panel registration form.
                                                        </p>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${
                                                        selectedKycBuilder?.kycStatus === 'approved'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : selectedKycBuilder?.kycStatus === 'rejected'
                                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                        {selectedKycBuilder?.kycStatus === 'approved' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                                        {selectedKycBuilder?.kycStatus || 'Pending'} KYC
                                                    </div>
                                                </div>

                                                {!selectedKycBuilder ? (
                                                    <div className="mt-5 rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                                                        <p className="text-xs font-bold text-[#797298]">Select a builder KYC record to review details.</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <DetailField label="First Name" value={selectedKycBuilder?.firstName} />
                                                            <DetailField label="Last Name" value={selectedKycBuilder?.lastName} />
                                                            <DetailField label="Company Name" value={selectedKycBuilder?.companyName} />
                                                            <DetailField label="Company Type" value={selectedKycBuilder?.companyType} />
                                                            <DetailField label="RERA Number" value={selectedKycBuilder?.reraNumber} />
                                                            <DetailField label="Phone Number" value={selectedKycBuilder?.mobile} />
                                                            <div className="sm:col-span-2">
                                                                <DetailField label="Location" value={selectedKycBuilder?.location} />
                                                            </div>
                                                        </div>

                                                        <div className="mt-5 border-t border-[#EFEAF8] pt-4">
                                                            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71] mb-3 flex items-center gap-1.5">
                                                                <ImageIcon size={14} className="text-[#2717D7]" /> Uploaded KYC Documents
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                                                {selectedKycBuilder.kycDocuments.map((document) => (
                                                                    <div key={document.id} className="overflow-hidden rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF]">
                                                                        <img src={document.image} alt={document.label} className="h-32 w-full object-cover" />
                                                                        <div className="border-t border-[#E1DDF0] bg-white px-3 py-2">
                                                                            <p className="text-[10px] font-black uppercase tracking-wider text-[#171327]">{document.label}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {selectedKycBuilder.kycStatus === 'rejected' && selectedKycBuilder.rejectionReason && (
                                                            <div className="mt-4 rounded-[8px] border border-rose-100 bg-rose-50 p-3">
                                                                <p className="text-[9px] font-black uppercase tracking-wider text-rose-500">Rejection Reason</p>
                                                                <p className="mt-1 text-xs font-bold text-rose-700">{selectedKycBuilder.rejectionReason}</p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {selectedKycBuilder?.kycStatus === 'pending' && (
                                                    <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-[#EFEAF8] pt-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRejectKycBuilder(selectedKycBuilder.id)}
                                                            className="h-9 rounded-[6px] border border-rose-100 bg-rose-50 px-4 text-xs font-black uppercase tracking-wider text-rose-600 hover:bg-rose-100 transition-colors"
                                                        >
                                                            Reject KYC
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApproveKycBuilder(selectedKycBuilder.id)}
                                                            className="h-9 rounded-[6px] bg-emerald-500 px-4 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-emerald-600 transition-colors"
                                                        >
                                                            Approve KYC
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'fieldOfficer' && activeOfficerSubTab !== 'newAquisition' && (
                                <>
                                    {activeOfficerSubTab === 'onboardingProgress' ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                            {/* Left Column: Onboarding lists */}
                                            <div className="lg:col-span-1 space-y-4">
                                                <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    {/* Nested Tabs drafted & done */}
                                                    <div className="flex border-b border-[#EFEAF8] pb-1 mb-3">
                                                        <div className="flex gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOfficerOnboardTabChange('drafted')}
                                                                className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                    officerOnboardTab === 'drafted'
                                                                        ? 'text-[#2717D7]'
                                                                        : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                                }`}
                                                            >
                                                                Drafted ({fieldOfficerOnboarding.filter(o => o.officerId === selectedOfficerId && !o.isCompleted).length})
                                                                {officerOnboardTab === 'drafted' && (
                                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOfficerOnboardTabChange('done')}
                                                                className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                    officerOnboardTab === 'done'
                                                                        ? 'text-[#2717D7]'
                                                                        : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                                }`}
                                                            >
                                                                Done ({fieldOfficerOnboarding.filter(o => o.officerId === selectedOfficerId && o.isCompleted).length})
                                                                {officerOnboardTab === 'done' && (
                                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* List of items */}
                                                    {officerOnboardFiltered.length === 0 ? (
                                                        <div className="text-center py-8 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                            <p className="text-xs font-bold text-[#5E5A71]">No projects in this stage.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                                            {officerOnboardFiltered.map((proj) => {
                                                                const isSelected = selectedOfficerOnboardId === proj.id;
                                                                const progressPct = proj.isCompleted ? 100 : Math.round(((proj.currentStep - 1) / 6) * 100);
                                                                return (
                                                                    <button
                                                                        key={proj.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedOfficerOnboardId(proj.id);
                                                                            setOfficerActiveStep(proj.isCompleted ? 1 : proj.currentStep);
                                                                        }}
                                                                        className={`w-full text-left p-3 rounded-[8px] border transition-all ${
                                                                            isSelected
                                                                                ? 'border-[#2717D7] bg-[#F4F1FF] text-[#2717D7]'
                                                                                : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]/40 text-[#171327]'
                                                                        }`}
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <p className="text-xs font-black truncate max-w-[150px]">{proj.projectName}</p>
                                                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                                                proj.isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                                            }`}>
                                                                                {proj.isCompleted ? 'Completed' : `Step ${proj.currentStep}`}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        {/* Progress Bar */}
                                                                        <div className="mt-3 flex items-center gap-2">
                                                                            <div className="flex-1 h-1 rounded-full bg-[#EFEAF8] overflow-hidden">
                                                                                <div 
                                                                                    className={`h-full rounded-full ${proj.isCompleted ? 'bg-emerald-500' : 'bg-[#2717D7]'}`}
                                                                                    style={{ width: `${progressPct}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-[8px] font-black text-[#5E5A71]">{progressPct}%</span>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Column: Step-wise Form Detail View */}
                                            <div className="lg:col-span-2">
                                                {selectedOfficerOnboardItem ? (
                                                    <OnboardingDetailViewer 
                                                        data={selectedOfficerOnboardItem} 
                                                        activeStep={officerActiveStep} 
                                                        setActiveStep={setOfficerActiveStep} 
                                                        onApprove={handleApproveOfficer}
                                                        onReject={handleRejectOfficer}
                                                    />
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center rounded-[10px] border border-[#D8D2EB] bg-white p-8 text-center min-h-[350px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                        <Compass className="h-10 w-10 text-[#A49DB8] mb-3 animate-pulse" />
                                                        <p className="text-sm font-black text-[#171327]">No Project Selected</p>
                                                        <p className="text-xs font-bold text-[#5E5A71] mt-1">Select a draft or completed onboarding progress record to view its step-wise data.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : activeOfficerSubTab === 'live' ? (
                                        <div className="pt-2">
                                            {fieldOfficerOnboarding.filter(o => o.isLive && o.officerId === selectedOfficerId).length === 0 ? (
                                                <div className="text-center py-12 px-4 border border-dashed border-[#D8D2EB] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    <CheckCircle2 className="mx-auto h-12 w-12 text-[#A49DB8] mb-3 stroke-[1.5]" />
                                                    <h4 className="text-sm font-black text-[#171327] uppercase tracking-wider">No Live Projects for {selectedOfficer?.full_name}</h4>
                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1.5 max-w-md mx-auto">
                                                        Go to the "Onboarding progress" sub-tab and select the "Done" list under {selectedOfficer?.full_name || 'officer'} to review and approve completed submissions.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {fieldOfficerOnboarding.filter(o => o.isLive && o.officerId === selectedOfficerId).map((proj) => {
                                                        const selectedTypes = proj.form?.step2?.selectedTypes || [];
                                                        const city = proj.form?.step1?.city || '';
                                                        const location = proj.form?.step1?.location || '';
                                                        return (
                                                            <div key={proj.id} className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_2px_4px_rgba(33,24,88,0.02)] hover:shadow-[0_4px_12px_rgba(33,24,88,0.06)] transition-all flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <h4 className="text-sm font-black text-[#171327] leading-snug">{proj.projectName}</h4>
                                                                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-600 tracking-wider shrink-0">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                            Live
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-[#5E5A71] mt-1">Submitted by: <span className="text-[#2717D7]">{selectedOfficer?.full_name}</span></p>
                                                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#5E5A71]">
                                                                        <MapPin size={13} className="text-[#2717D7]" />
                                                                        <span className="truncate">{location ? `${location}, ` : ''}{city}</span>
                                                                    </div>
                                                                    {selectedTypes.length > 0 && (
                                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                                            {selectedTypes.map((type, idx) => (
                                                                                <span key={idx} className="bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                                                                    {type.subType || type.mainType}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {proj.rejectionReason && (
                                                                        <div className="mt-3 rounded-[8px] border border-rose-100 bg-rose-50 p-2.5">
                                                                            <p className="text-[8px] font-black uppercase tracking-wider text-rose-500">Rejection Reason</p>
                                                                            <p className="mt-1 text-[10px] font-bold leading-relaxed text-rose-700">{proj.rejectionReason}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-5 pt-3 border-t border-[#EFEAF8] flex items-center justify-between">
                                                                    <span className="text-[10px] text-[#A49DB8] font-bold">{proj.lastUpdated || 'recently'}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setActiveOfficerSubTab('onboardingProgress');
                                                                        }}
                                                                        className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#2717D7] hover:text-[#1a0fa3] transition-colors"
                                                                    >
                                                                        View Details
                                                                        <ChevronRight size={14} strokeWidth={2.5} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : activeOfficerSubTab === 'rejected' ? (
                                        <div className="pt-2">
                                            {projectOnboarding.filter(p => p.isRejected).length === 0 ? (
                                                <div className="text-center py-12 px-4 border border-dashed border-[#D8D2EB] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    <ShieldAlert className="mx-auto h-12 w-12 text-[#A49DB8] mb-3 stroke-[1.5]" />
                                                    <h4 className="text-sm font-black text-[#171327] uppercase tracking-wider">No Rejected Projects for {selectedOfficer?.full_name}</h4>
                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1.5 max-w-md mx-auto">
                                                        No projects submitted by {selectedOfficer?.full_name || 'officer'} have been rejected.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {projectOnboarding.filter(p => p.isRejected).map((proj) => {
                                                        const selectedTypes = proj.form?.step2?.selectedTypes || [];
                                                        const city = proj.form?.step1?.city || proj.location || '';
                                                        const location = '';
                                                        return (
                                                            <div key={proj.id} className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_2px_4px_rgba(33,24,88,0.02)] hover:shadow-[0_4px_12px_rgba(33,24,88,0.06)] transition-all flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <h4 className="text-sm font-black text-[#171327] leading-snug">{proj.projectName}</h4>
                                                                        <span className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-[9px] font-black uppercase text-rose-600 tracking-wider shrink-0">
                                                                            Rejected
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-[#5E5A71] mt-1">Submitted by: <span className="text-[#2717D7]">{selectedOfficer?.full_name}</span></p>
                                                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#5E5A71]">
                                                                        <MapPin size={13} className="text-[#2717D7]" />
                                                                        <span className="truncate">{location ? `${location}, ` : ''}{city}</span>
                                                                    </div>
                                                                    {selectedTypes.length > 0 && (
                                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                                            {selectedTypes.map((type, idx) => (
                                                                                <span key={idx} className="bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                                                                    {type.subType || type.mainType}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-5 pt-3 border-t border-[#EFEAF8] flex items-center justify-between">
                                                                    <span className="text-[10px] text-[#A49DB8] font-bold">{proj.lastUpdated || 'recently'}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setActiveOfficerSubTab('onboardingProgress');
                                                                            setOfficerOnboardTab('done');
                                                                            setSelectedOfficerOnboardId(proj.id);
                                                                            setOfficerActiveStep(1);
                                                                        }}
                                                                        className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#2717D7] hover:text-[#1a0fa3] transition-colors"
                                                                    >
                                                                        View Details
                                                                        <ChevronRight size={14} strokeWidth={2.5} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : activeOfficerSubTab === 'tasks' ? (
                                        <div className="space-y-6 pt-2">
                                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                                                {/* Left Column: Form (2 cols) */}
                                                <div className="xl:col-span-2 rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                                                    <div>
                                                        <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#2717D7]">Assign New Task</h3>
                                                        <p className="text-[10px] text-[#5E5A71] font-bold mt-0.5">Assign site visits and compliance checks to field officers.</p>
                                                    </div>
                                                    
                                                    <form onSubmit={handleAssignTask} className="space-y-3">
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Task Title</label>
                                                            <input 
                                                                type="text" 
                                                                value={taskTitle}
                                                                onChange={(e) => setTaskTitle(e.target.value)}
                                                                placeholder="e.g. Verify property boundaries" 
                                                                className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Project Name</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={taskProject}
                                                                    onChange={(e) => setTaskProject(e.target.value)}
                                                                    placeholder="e.g. Skyline Residency" 
                                                                    className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Location</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={taskLocation}
                                                                    onChange={(e) => setTaskLocation(e.target.value)}
                                                                    placeholder="e.g. Vijay Nagar, Indore" 
                                                                    className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Select Field Officer</label>
                                                                <select 
                                                                    value={taskOfficerId}
                                                                    onChange={(e) => setTaskOfficerId(e.target.value)}
                                                                    className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                >
                                                                    {fieldOfficers.map((fo) => (
                                                                        <option key={fo.id} value={fo.id}>{fo.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Priority</label>
                                                                <select 
                                                                    value={taskPriority}
                                                                    onChange={(e) => setTaskPriority(e.target.value)}
                                                                    className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                >
                                                                    <option value="High">High</option>
                                                                    <option value="Medium">Medium</option>
                                                                    <option value="Low">Low</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Due Date</label>
                                                                <select 
                                                                    value={taskDue}
                                                                    onChange={(e) => setTaskDue(e.target.value)}
                                                                    className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                >
                                                                    <option value="Today">Today</option>
                                                                    <option value="Tomorrow">Tomorrow</option>
                                                                    <option value="This week">This Week</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Time</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={taskTime}
                                                                    onChange={(e) => setTaskTime(e.target.value)}
                                                                    placeholder="e.g. 10:30 AM" 
                                                                    className="w-full h-9 mt-1 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Task Notes</label>
                                                            <textarea 
                                                                rows="2"
                                                                value={taskNote}
                                                                onChange={(e) => setTaskNote(e.target.value)}
                                                                placeholder="e.g. Collect copy of original RERA certificate..." 
                                                                className="w-full mt-1 rounded-[6px] border border-[#D8D2EB] bg-white p-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all"
                                                            />
                                                        </div>

                                                        <button 
                                                            type="submit" 
                                                            className="w-full h-9 mt-2 rounded-[6px] bg-[#2717D7] hover:bg-[#1a0fa3] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                                                        >
                                                            Assign Task
                                                        </button>
                                                    </form>
                                                </div>

                                                {/* Right Column: Google Maps & Live Tracking (3 cols) */}
                                                <div className="xl:col-span-3 rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#2717D7]">GPS Live Tracking Map</h3>
                                                            <p className="text-[10px] text-[#5E5A71] font-bold mt-0.5">Coordinates and locations of active field officers.</p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">GPS Signal Active</span>
                                                        </div>
                                                    </div>

                                                    {/* Real Interactive Leaflet Live Map */}
                                                    <div className="relative w-full h-[280px] rounded-[8px] overflow-hidden border border-[#E1DDF0] bg-gray-50 flex-1">
                                                        <div ref={mapRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />
                                                        {/* GPS Coordinates Overlay Overlay */}
                                                        <div className="absolute top-2 left-2 bg-[#171327]/90 text-white rounded p-3 text-[10px] font-mono border border-white/10 space-y-1.5 shadow-lg backdrop-blur-xs max-w-[240px]" style={{ zIndex: 10 }}>
                                                            <p className="font-bold text-amber-400 uppercase tracking-wide pb-1 border-b border-white/10">Active Positions</p>
                                                            {Object.entries(officerLocations).map(([id, fo]) => (
                                                                <div key={id} className="flex justify-between items-center gap-4">
                                                                    <span className="font-bold text-white/90">{fo.name}:</span>
                                                                    <span className="text-emerald-400">{fo.lat}, {fo.lng}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Legend / Status details */}
                                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#EFEAF8] text-center">
                                                        {Object.entries(officerLocations).map(([id, fo]) => (
                                                            <div key={id} className="bg-[#F8F9FF] border border-[#E1DDF0] rounded p-2 flex flex-col items-center">
                                                                <span className="text-[10px] font-black text-[#171327]">{fo.name}</span>
                                                                <span className="text-[8px] font-mono text-[#797298] mt-0.5">({fo.lat.toFixed(4)}, {fo.lng.toFixed(4)})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Task List */}
                                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFEAF8] pb-3">
                                                    <div>
                                                        <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#2717D7]">All Active Field Tasks</h3>
                                                        <p className="text-[10px] text-[#5E5A71] font-bold mt-0.5">Track execution and completion metrics for all assigned tasks.</p>
                                                    </div>
                                                    
                                                    {/* Filter Button Tabs */}
                                                    <div className="flex gap-1.5 bg-[#F8F9FF] border border-[#E1DDF0] rounded-lg p-1">
                                                        {['all', 'Pending', 'In Progress', 'Completed'].map((filter) => (
                                                            <button
                                                                key={filter}
                                                                type="button"
                                                                onClick={() => setTaskActiveFilter(filter)}
                                                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                                                                    taskActiveFilter === filter
                                                                        ? 'bg-white border border-[#D8D2EB] text-[#2717D7] shadow-xs'
                                                                        : 'text-[#797298] hover:text-[#2717D7]'
                                                                }`}
                                                            >
                                                                {filter}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Tasks List */}
                                                {tasks.filter(t => taskActiveFilter === 'all' ? true : t.status === taskActiveFilter).length === 0 ? (
                                                    <div className="text-center py-10 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                        <CheckCircle2 className="mx-auto h-8 w-8 text-[#A49DB8]" />
                                                        <p className="text-xs font-black text-[#171327] mt-3">No tasks found</p>
                                                        <p className="text-[10px] text-[#5E5A71] mt-1">Try switching status filters or assigning a new task.</p>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto border border-[#E1DDF0] rounded-[8px]">
                                                        <table className="w-full text-left border-collapse">
                                                            <thead>
                                                                <tr className="bg-[#F8F9FF] border-b border-[#E1DDF0] text-[9px] font-black uppercase tracking-[0.1em] text-[#5E5A71]">
                                                                    <th className="px-4 py-3">Task ID</th>
                                                                    <th className="px-4 py-3">Title / Details</th>
                                                                    <th className="px-4 py-3">Project & Location</th>
                                                                    <th className="px-4 py-3">Assigned To</th>
                                                                    <th className="px-4 py-3">Due Schedule</th>
                                                                    <th className="px-4 py-3 text-center">Priority</th>
                                                                    <th className="px-4 py-3 text-center">Status</th>
                                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-[#EFEAF8] text-xs font-bold text-[#171327]">
                                                                {tasks.filter(t => taskActiveFilter === 'all' ? true : t.status === taskActiveFilter).map((task) => (
                                                                    <tr key={task.id} className="hover:bg-[#FCFBFF] transition-colors">
                                                                        <td className="px-4 py-3.5 font-mono font-black text-[#2717D7]">{task.id}</td>
                                                                        <td className="px-4 py-3.5 max-w-[220px]">
                                                                            <div>
                                                                                <p className="text-xs font-black text-[#171327]">{task.title}</p>
                                                                                {task.note && <p className="text-[10px] font-normal text-[#5E5A71] mt-0.5 truncate">{task.note}</p>}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-3.5">
                                                                            <div>
                                                                                <p className="text-xs font-black text-[#171327]">{task.projectName}</p>
                                                                                <p className="text-[10px] text-[#5E5A71] mt-0.5 font-normal">{task.location}</p>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-3.5">
                                                                            <span className="inline-flex items-center bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] rounded px-2 py-0.5 text-[10px] font-black">
                                                                                {task.officerName}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-[#5E5A71]">
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="h-3.5 w-3.5 shrink-0 text-[#797298]" />
                                                                                {task.due}, {task.time}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-center">
                                                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                                                task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                                                'bg-blue-50 text-blue-600 border border-blue-100'
                                                                            }`}>
                                                                                {task.priority}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-center">
                                                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                                                task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                                                task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                                                'bg-blue-50 text-blue-600 border border-blue-100'
                                                                            }`}>
                                                                                {task.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-right">
                                                                            <div className="flex items-center justify-end gap-1.5">
                                                                                {task.status !== 'Completed' && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleCompleteTask(task.id)}
                                                                                        className="h-7 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                                                                        title="Complete Task"
                                                                                    >
                                                                                        Complete
                                                                                    </button>
                                                                                )}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                                    className="h-7 px-2.5 rounded border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                                                                    title="Delete Task"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                                            <p className="text-sm font-black text-[#5E5A71]">
                                                {activeOfficerSubTab === 'live' ? 'Live Content (Empty)' : 'Unsupported Subtab'}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'fieldOfficer' && activeOfficerSubTab === 'newAquisition' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                    
                                    {/* Left Column: Leads */}
                                    <div className="lg:col-span-1 space-y-4">
                                        {/* Leads List */}
                                        <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                            <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#5E5A71] mb-3">
                                                Leads for {selectedOfficer?.full_name || 'Officer'}
                                            </h3>
                                            {!officerLeads.length ? (
                                                <div className="text-center py-6 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                    <p className="text-xs font-bold text-[#5E5A71]">No active leads.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                                    {officerLeads.map((proj) => {
                                                        const isSelected = selectedLeadId === proj.id;
                                                        return (
                                                            <button
                                                                key={proj.id}
                                                                type="button"
                                                                onClick={() => handleLeadSelect(proj.id)}
                                                                className={`w-full text-left p-3 rounded-[8px] border transition-all ${
                                                                    isSelected
                                                                        ? 'border-[#2717D7] bg-[#F4F1FF] text-[#2717D7]'
                                                                        : 'border-[#E1DDF0] bg-white hover:border-[#2717D7]/40 text-[#171327]'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start gap-1">
                                                                    <p className="text-xs font-black truncate max-w-[120px]">{proj.project_name || proj.projectName}</p>
                                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                                        proj.temperature === 'HOT' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                                    }`}>
                                                                        {proj.temperature || 'WARM'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] text-[#5E5A71] mt-1 truncate">{proj.builder_name || proj.developerName}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Leads Activities Details (Table List Form + Pagination) */}
                                    <div className="lg:col-span-2">
                                        {!selectedLead ? (
                                            <div className="h-full flex flex-col items-center justify-center rounded-[10px] border border-[#D8D2EB] bg-white p-8 text-center min-h-[350px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                <Compass className="h-10 w-10 text-[#A49DB8] mb-3" />
                                                <p className="text-sm font-black text-[#171327]">No Lead Selected</p>
                                                <p className="text-xs font-bold text-[#5E5A71] mt-1">Select an officer and lead from the sidebar to inspect meeting & follow-up schedules.</p>
                                            </div>
                                        ) : (
                                            <div className="rounded-[10px] border border-[#D8D2EB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                
                                                {/* Selected Lead Info */}
                                                <div className="border-b border-[#EFEAF8] pb-4">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div>
                                                            <h3 className="text-base font-black text-[#171327]">{selectedLead.projectName}</h3>
                                                            <p className="text-xs font-semibold text-[#5E5A71] mt-0.5">
                                                                Developer: {selectedLead.developerName} | Location: {selectedLead.location}, {selectedLead.city}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-[#171327]">{selectedLead.contactPerson}</p>
                                                            <p className="text-[10px] text-[#5E5A71] mt-0.5">{selectedLead.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nested Activity Sub-tabs Selector */}
                                                <div className="flex border-b border-[#EFEAF8] pb-1">
                                                    <div className="flex gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleActivityTabSelect('meetings')}
                                                            className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                activeActivityTab === 'meetings'
                                                                    ? 'text-[#2717D7]'
                                                                    : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                            }`}
                                                        >
                                                            Meetings ({leadMeetings.length})
                                                            {activeActivityTab === 'meetings' && (
                                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleActivityTabSelect('followups')}
                                                            className={`pb-1.5 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${
                                                                activeActivityTab === 'followups'
                                                                    ? 'text-[#2717D7]'
                                                                    : 'text-[#5E5A71] hover:text-[#2717D7]'
                                                            }`}
                                                        >
                                                            Followups ({leadFollowUps.length})
                                                            {activeActivityTab === 'followups' && (
                                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2717D7] rounded-full" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tab Content in List/Table Form */}
                                                <div className="pt-2 min-h-[300px] flex flex-col justify-between">
                                                    {activeActivityTab === 'meetings' ? (
                                                        <div className="space-y-4">
                                                            {!leadMeetings.length ? (
                                                                <div className="text-center py-10 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                                    <Calendar className="mx-auto h-8 w-8 text-[#A49DB8]" />
                                                                    <p className="text-xs font-black text-[#171327] mt-3">No scheduled meetings</p>
                                                                    <p className="text-[10px] text-[#5E5A71] mt-1">This lead has no meetings registered by the field officer.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="overflow-x-auto border border-[#E1DDF0] rounded-[8px]">
                                                                    <table className="w-full text-left border-collapse">
                                                                        <thead>
                                                                            <tr className="bg-[#F8F9FF] border-b border-[#E1DDF0] text-[9px] font-black uppercase tracking-[0.1em] text-[#5E5A71]">
                                                                                <th className="px-4 py-3">Type</th>
                                                                                <th className="px-4 py-3">Time</th>
                                                                                <th className="px-4 py-3">Location</th>
                                                                                <th className="px-4 py-3">Agenda / Prep Notes</th>
                                                                                <th className="px-4 py-3">Voice Note</th>
                                                                                <th className="px-4 py-3 text-center">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#EFEAF8] text-xs font-bold text-[#171327]">
                                                                            {paginatedMeetings.map((meeting) => (
                                                                                <tr key={meeting.id} className="hover:bg-[#FCFBFF] transition-colors">
                                                                                    <td className="px-4 py-3.5 font-black flex items-center gap-1.5">
                                                                                        <Compass className="h-3.5 w-3.5 text-[#2717D7] shrink-0" />
                                                                                        {meeting.type}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-[#5E5A71] whitespace-nowrap">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Clock className="h-3.5 w-3.5 shrink-0" />
                                                                                            {meeting.time}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[150px] truncate">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <MapPin className="h-3.5 w-3.5 text-[#2717D7] shrink-0" />
                                                                                            {meeting.location}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[200px]">
                                                                                        <div className="space-y-1">
                                                                                            {meeting.meta?.agenda?.length > 0 && (
                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                    {meeting.meta.agenda.map((agenda) => (
                                                                                                        <span key={agenda} className="bg-[#F4F1FF] text-[#2717D7] px-1.5 py-0.5 rounded text-[8px] font-black">
                                                                                                            {agenda}
                                                                                                        </span>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                            {meeting.meta?.notes && (
                                                                                                <p className="text-[10px] text-[#5E5A71] italic mt-1">"{meeting.meta.notes}"</p>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                                                        {meeting.voiceNoteUrl ? (
                                                                                            <div className="flex items-center gap-2">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handlePlayPause(meeting.id, meeting.voiceNoteUrl)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F1FF] text-[#2717D7] hover:bg-[#2717D7] hover:text-white transition-all shadow-sm cursor-pointer"
                                                                                                    title={playingId === meeting.id ? "Pause" : "Play"}
                                                                                                >
                                                                                                    {playingId === meeting.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                                                                                                </button>
                                                                                                <span className="text-[10px] text-[#5E5A71] font-mono">{meeting.voiceNoteDuration || '0:00'}</span>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleDownload(meeting.voiceNoteUrl, `meeting-voice-${meeting.id}.mp3`)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E1DDF0] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7] transition-all shadow-sm cursor-pointer"
                                                                                                    title="Download Audio"
                                                                                                >
                                                                                                    <Download size={12} />
                                                                                                </button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-[#A49DB8] font-normal">-</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                                                            meeting.status === 'Completed' || meeting.status === 'Done'
                                                                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                                                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                                                        }`}>
                                                                                            {meeting.status}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {!leadFollowUps.length ? (
                                                                <div className="text-center py-10 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                                    <Phone className="mx-auto h-8 w-8 text-[#A49DB8]" />
                                                                    <p className="text-xs font-black text-[#171327] mt-3">No follow-ups recorded</p>
                                                                    <p className="text-[10px] text-[#5E5A71] mt-1">This lead has no follow-ups registered by the field officer.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="overflow-x-auto border border-[#E1DDF0] rounded-[8px]">
                                                                    <table className="w-full text-left border-collapse">
                                                                        <thead>
                                                                            <tr className="bg-[#F8F9FF] border-b border-[#E1DDF0] text-[9px] font-black uppercase tracking-[0.1em] text-[#5E5A71]">
                                                                                <th className="px-4 py-3">Type</th>
                                                                                <th className="px-4 py-3">Scheduled Time</th>
                                                                                <th className="px-4 py-3 text-center">Status</th>
                                                                                <th className="px-4 py-3">Voice Note</th>
                                                                                <th className="px-4 py-3">Remarks / Note</th>
                                                                                <th className="px-4 py-3">Next Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#EFEAF8] text-xs font-bold text-[#171327]">
                                                                            {paginatedFollowups.map((follow) => (
                                                                                <tr key={follow.id} className="hover:bg-[#FCFBFF] transition-colors">
                                                                                    <td className="px-4 py-3.5 font-black flex items-center gap-1.5">
                                                                                        <Phone className="h-3.5 w-3.5 text-[#2717D7] shrink-0" />
                                                                                        {follow.meta?.followUpType || 'Call'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-[#5E5A71] whitespace-nowrap">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Clock className="h-3.5 w-3.5 shrink-0" />
                                                                                            {follow.time || 'Time pending'}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                                                        <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-50 text-amber-600 border border-amber-100">
                                                                                            {follow.status}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                                                        {follow.voiceNoteUrl ? (
                                                                                            <div className="flex items-center gap-2">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handlePlayPause(follow.id, follow.voiceNoteUrl)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F1FF] text-[#2717D7] hover:bg-[#2717D7] hover:text-white transition-all shadow-sm cursor-pointer"
                                                                                                    title={playingId === follow.id ? "Pause" : "Play"}
                                                                                                >
                                                                                                    {playingId === follow.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                                                                                                </button>
                                                                                                <span className="text-[10px] text-[#5E5A71] font-mono">{follow.voiceNoteDuration || '0:00'}</span>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => handleDownload(follow.voiceNoteUrl, `follow-voice-${follow.id}.mp3`)}
                                                                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E1DDF0] bg-white text-[#5E5A71] hover:border-[#2717D7] hover:text-[#2717D7] transition-all shadow-sm cursor-pointer"
                                                                                                    title="Download Audio"
                                                                                                >
                                                                                                    <Download size={12} />
                                                                                                </button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-[#A49DB8] font-normal">-</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[200px] text-[#5E5A71] italic">
                                                                                        "{follow.note}"
                                                                                    </td>
                                                                                    <td className="px-4 py-3.5 max-w-[150px] text-[#2717D7] truncate">
                                                                                        {follow.meta?.nextAction || '-'}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Pagination Controls */}
                                                    {activeActivityTab === 'meetings' && leadMeetings.length > ITEMS_PER_PAGE && (
                                                        <div className="flex items-center justify-between border-t border-[#EFEAF8] pt-4 mt-4 text-xs font-bold text-[#5E5A71]">
                                                            <span>
                                                                Showing {Math.min((meetingPage - 1) * ITEMS_PER_PAGE + 1, leadMeetings.length)} to {Math.min(meetingPage * ITEMS_PER_PAGE, leadMeetings.length)} of {leadMeetings.length} meetings
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={meetingPage === 1}
                                                                    onClick={() => setMeetingPage(p => p - 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Previous Page"
                                                                >
                                                                    <ChevronLeft size={16} />
                                                                </button>
                                                                {Array.from({ length: totalMeetingsPages }, (_, i) => i + 1).map((pg) => (
                                                                    <button
                                                                        key={pg}
                                                                        type="button"
                                                                        onClick={() => setMeetingPage(pg)}
                                                                        className={`h-8 w-8 grid place-items-center rounded-md border text-xs ${
                                                                            meetingPage === pg
                                                                                ? 'border-[#2717D7] bg-[#2717D7] text-white'
                                                                                : 'border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                                        }`}
                                                                    >
                                                                        {pg}
                                                                    </button>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    disabled={meetingPage === totalMeetingsPages}
                                                                    onClick={() => setMeetingPage(p => p + 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Next Page"
                                                                >
                                                                    <ChevronRight size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeActivityTab === 'followups' && leadFollowUps.length > ITEMS_PER_PAGE && (
                                                        <div className="flex items-center justify-between border-t border-[#EFEAF8] pt-4 mt-4 text-xs font-bold text-[#5E5A71]">
                                                            <span>
                                                                Showing {Math.min((followupPage - 1) * ITEMS_PER_PAGE + 1, leadFollowUps.length)} to {Math.min(followupPage * ITEMS_PER_PAGE, leadFollowUps.length)} of {leadFollowUps.length} follow-ups
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={followupPage === 1}
                                                                    onClick={() => setFollowupPage(p => p - 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Previous Page"
                                                                >
                                                                    <ChevronLeft size={16} />
                                                                </button>
                                                                {Array.from({ length: totalFollowupsPages }, (_, i) => i + 1).map((pg) => (
                                                                    <button
                                                                        key={pg}
                                                                        type="button"
                                                                        onClick={() => setFollowupPage(pg)}
                                                                        className={`h-8 w-8 grid place-items-center rounded-md border text-xs ${
                                                                            followupPage === pg
                                                                                ? 'border-[#2717D7] bg-[#2717D7] text-white'
                                                                                : 'border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7]'
                                                                        }`}
                                                                    >
                                                                        {pg}
                                                                    </button>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    disabled={followupPage === totalFollowupsPages}
                                                                    onClick={() => setFollowupPage(p => p + 1)}
                                                                    className="h-8 w-8 grid place-items-center rounded-md border border-[#D8D2EB] hover:border-[#2717D7] hover:text-[#2717D7] disabled:opacity-45 disabled:pointer-events-none transition-all"
                                                                    aria-label="Next Page"
                                                                >
                                                                    <ChevronRight size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PanelOverview;
