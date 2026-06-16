import { useState, useRef, useEffect } from 'react';
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
    ShieldAlert
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { 
    panelOverviewByStatus, 
    fieldOfficerWorkflowData,
    projectOnboardingList,
    fieldOfficerOnboardingList
} from '../../data/mockData';

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

const builderAccounts = [
    {
        id: 'B-001',
        firstName: 'Arjun',
        lastName: 'Mehra',
        companyName: 'Apex Buildcon',
        companyType: 'Builder',
        reraNumber: 'MHRERA-P51800044791',
        mobile: '+91 98231 44001',
        location: 'Mumbai, Maharashtra',
        status: 'Active'
    },
    {
        id: 'B-002',
        firstName: 'Raghav',
        lastName: 'Bansal',
        companyName: 'CityScape',
        companyType: 'Builder',
        reraNumber: 'DLRERA2024P0058',
        mobile: '+91 98111 55220',
        location: 'Delhi NCR',
        status: 'Active'
    },
    {
        id: 'B-003',
        firstName: 'Priya',
        lastName: 'Nair',
        companyName: 'GreenLeaf Developers',
        companyType: 'Builder',
        reraNumber: 'PRM/KA/RERA/1251/309/PR/230526/006890',
        mobile: '+91 99801 33445',
        location: 'Bangalore, Karnataka',
        status: 'Active'
    }
];

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
    const agreed = form.step6?.agreed;

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
            {documents.length === 0 ? (
                <EmptyStepMessage message="No brochures or document plans uploaded yet." />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-[8px] border border-[#E1DDF0] bg-[#FCFBFF]">
                            <div className="flex items-center gap-2 truncate mr-2">
                                <FileText size={16} className="text-indigo-600 shrink-0" />
                                <span className="text-xs font-black text-[#171327] truncate">{doc.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[8px] font-black uppercase bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB] px-2 py-0.5 rounded">PDF</span>
                                {doc.uri && doc.uri !== '#' && (
                                    <a
                                        href={doc.uri}
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
                    ))}
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
                        <div className="flex items-center justify-center p-3 rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider">
                            ✗ This application has been rejected by the admin.
                        </div>
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
    // Just display the draft status metrics directly as requested
    const metrics = panelOverviewByStatus.draft.metrics;

    // Main layout tabs
    const [activeTab, setActiveTab] = useState('project'); // 'project' | 'fieldOfficer'
    const [activeProjectSubTab, setActiveProjectSubTab] = useState('approveKyc'); // 'approveKyc' | 'onboardingProgress' | 'live'
    const [activeOfficerSubTab, setActiveOfficerSubTab] = useState('newAquisition'); // 'newAquisition' | 'onboardingProgress' | 'live' | 'tasks'

    // Selected Builder state
    const [selectedBuilderId, setSelectedBuilderId] = useState(builderAccounts[0]?.id || '');
    const selectedBuilder = builderAccounts.find(b => b.id === selectedBuilderId) || builderAccounts[0];

    // New Acquisition specific state
    const [selectedOfficerId, setSelectedOfficerId] = useState(fieldOfficerWorkflowData[0]?.id || '');

    const selectedOfficer = fieldOfficerWorkflowData.find(o => o.id === selectedOfficerId) || fieldOfficerWorkflowData[0];
    
    const [selectedLeadId, setSelectedLeadId] = useState(selectedOfficer?.projects?.[0]?.id || '');
    const selectedLead = selectedOfficer?.projects?.find(p => p.id === selectedLeadId) || selectedOfficer?.projects?.[0];

    const [activeActivityTab, setActiveActivityTab] = useState('meetings'); // 'meetings' | 'followups'
    
    // Onboarding lists state
    const [projectOnboarding, setProjectOnboarding] = useState(projectOnboardingList);
    const [fieldOfficerOnboarding, setFieldOfficerOnboarding] = useState(fieldOfficerOnboardingList);

    // Project Onboarding states
    const [projectOnboardTab, setProjectOnboardTab] = useState('drafted'); // 'drafted' | 'done'
    const [selectedProjectOnboardId, setSelectedProjectOnboardId] = useState(
        projectOnboardingList.filter(p => !p.isCompleted)[0]?.id || ''
    );
    const [projectActiveStep, setProjectActiveStep] = useState(1);

    // Field Officer Onboarding states
    const [officerOnboardTab, setOfficerOnboardTab] = useState('drafted'); // 'drafted' | 'done'
    const [selectedOfficerOnboardId, setSelectedOfficerOnboardId] = useState(
        fieldOfficerOnboardingList.filter(o => !o.isCompleted)[0]?.id || ''
    );
    const [officerActiveStep, setOfficerActiveStep] = useState(1);

    const handleProjectOnboardTabChange = (tab) => {
        setProjectOnboardTab(tab);
        const filtered = projectOnboarding.filter(p => tab === 'done' ? p.isCompleted : !p.isCompleted);
        setSelectedProjectOnboardId(filtered[0]?.id || '');
        setProjectActiveStep(1);
    };

    const handleOfficerOnboardTabChange = (tab) => {
        setOfficerOnboardTab(tab);
        const filtered = fieldOfficerOnboarding.filter(o => {
            const isOfficerMatch = o.officerId === selectedOfficerId;
            const isTabMatch = tab === 'done' ? o.isCompleted : !o.isCompleted;
            return isOfficerMatch && isTabMatch;
        });
        setSelectedOfficerOnboardId(filtered[0]?.id || '');
        setOfficerActiveStep(1);
    };

    // Approval / Rejection Handlers
    const handleApproveProject = (id) => {
        setProjectOnboarding(prev => prev.map(item => 
            item.id === id ? { ...item, isLive: true, isRejected: false } : item
        ));
    };

    const handleRejectProject = (id) => {
        setProjectOnboarding(prev => prev.map(item => 
            item.id === id ? { ...item, isLive: false, isRejected: true } : item
        ));
    };

    const handleApproveOfficer = (id) => {
        setFieldOfficerOnboarding(prev => prev.map(item => 
            item.id === id ? { ...item, isLive: true, isRejected: false } : item
        ));
    };

    const handleRejectOfficer = (id) => {
        setFieldOfficerOnboarding(prev => prev.map(item => 
            item.id === id ? { ...item, isLive: false, isRejected: true } : item
        ));
    };

    // Pagination states
    const [meetingPage, setMeetingPage] = useState(1);
    const [followupPage, setFollowupPage] = useState(1);
    
    const ITEMS_PER_PAGE = 5;

    const handleOfficerSelect = (id) => {
        setSelectedOfficerId(id);
        const officer = fieldOfficerWorkflowData.find(o => o.id === id);
        if (officer?.projects?.length) {
            setSelectedLeadId(officer.projects[0].id);
        } else {
            setSelectedLeadId('');
        }

        // Reset selected officer onboarding item based on the new officer
        const filtered = fieldOfficerOnboarding.filter(o => 
            o.officerId === id && (officerOnboardTab === 'done' ? o.isCompleted : !o.isCompleted)
        );
        setSelectedOfficerOnboardId(filtered[0]?.id || '');
        setOfficerActiveStep(1);

        setMeetingPage(1);
        setFollowupPage(1);
    };

    // Filtered Onboarding calculations
    const projectOnboardFiltered = projectOnboarding.filter(p => 
        projectOnboardTab === 'done' ? p.isCompleted : !p.isCompleted
    );
    const selectedProjectOnboardItem = projectOnboardFiltered.find(p => p.id === selectedProjectOnboardId) || projectOnboardFiltered[0];

    const officerOnboardFiltered = fieldOfficerOnboarding.filter(o => {
        const isOfficerMatch = o.officerId === selectedOfficerId;
        const isTabMatch = officerOnboardTab === 'done' ? o.isCompleted : !o.isCompleted;
        return isOfficerMatch && isTabMatch;
    });
    const selectedOfficerOnboardItem = officerOnboardFiltered.find(o => o.id === selectedOfficerOnboardId) || officerOnboardFiltered[0];

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
    const leadFollowUps = selectedLead?.followUps || [];
    const totalFollowupsPages = Math.ceil(leadFollowUps.length / ITEMS_PER_PAGE) || 1;
    const paginatedFollowups = leadFollowUps.slice(
        (followupPage - 1) * ITEMS_PER_PAGE,
        followupPage * ITEMS_PER_PAGE
    );

    // Audio Playback State & Handlers
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

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
                        {metrics.map((metric) => (
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
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[#5E5A71]">Select Builder:</span>
                                        <select
                                            value={selectedBuilderId}
                                            onChange={(e) => setSelectedBuilderId(e.target.value)}
                                            className="h-9 rounded-[6px] border border-[#D8D2EB] bg-white px-3 text-xs font-bold text-[#171327] focus:border-[#2717D7] focus:outline-none transition-all shadow-sm"
                                        >
                                            {builderAccounts.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.companyName} ({b.firstName} {b.lastName})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Online & Verified</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-[8px] bg-[#F8F9FF] border border-[#E1DDF0]">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">First Name</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedBuilder.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Last Name</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedBuilder.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Phone Number</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedBuilder.mobile}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Company Type</p>
                                        <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB]">
                                            {selectedBuilder.companyType}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">RERA Number</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5 tracking-wide">{selectedBuilder.reraNumber}</p>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Location</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5 truncate">{selectedBuilder.location}</p>
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
                                            {fieldOfficerWorkflowData.map((fo) => (
                                                <option key={fo.id} value={fo.id}>
                                                    {fo.name} ({fo.area})
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
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedOfficer?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Mobile Number</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5">{selectedOfficer?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Assigned Area</p>
                                        <p className="text-xs font-black text-[#171327] mt-0.5 truncate">{selectedOfficer?.area}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Zone</p>
                                        <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F1FF] text-[#2717D7] border border-[#D8D2EB]">
                                            {selectedOfficer?.zone}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-wider text-[#797298]">Status</p>
                                        <p className="text-xs font-black text-emerald-600 mt-0.5">{selectedOfficer?.status}</p>
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
                                        <div className="rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                                            <p className="text-sm font-black text-[#5E5A71]">
                                                Approve KYC Content (Empty)
                                            </p>
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
                                                    <h4 className="text-sm font-black text-[#171327] uppercase tracking-wider">No Live Projects for {selectedOfficer?.name}</h4>
                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1.5 max-w-md mx-auto">
                                                        Go to the "Onboarding progress" sub-tab and select the "Done" list under {selectedOfficer?.name || 'officer'} to review and approve completed submissions.
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
                                                                    <p className="text-[10px] font-bold text-[#5E5A71] mt-1">Submitted by: <span className="text-[#2717D7]">{selectedOfficer?.name}</span></p>
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
                                    ) : activeOfficerSubTab === 'rejected' ? (
                                        <div className="pt-2">
                                            {fieldOfficerOnboarding.filter(o => o.isRejected && o.officerId === selectedOfficerId).length === 0 ? (
                                                <div className="text-center py-12 px-4 border border-dashed border-[#D8D2EB] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    <ShieldAlert className="mx-auto h-12 w-12 text-[#A49DB8] mb-3 stroke-[1.5]" />
                                                    <h4 className="text-sm font-black text-[#171327] uppercase tracking-wider">No Rejected Projects for {selectedOfficer?.name}</h4>
                                                    <p className="text-xs font-bold text-[#5E5A71] mt-1.5 max-w-md mx-auto">
                                                        No projects submitted by {selectedOfficer?.name || 'officer'} have been rejected.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {fieldOfficerOnboarding.filter(o => o.isRejected && o.officerId === selectedOfficerId).map((proj) => {
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
                                                                    <p className="text-[10px] font-bold text-[#5E5A71] mt-1">Submitted by: <span className="text-[#2717D7]">{selectedOfficer?.name}</span></p>
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
                                    ) : (
                                        <div className="rounded-[8px] border border-dashed border-[#D8D2EB] bg-[#FCFBFF] p-8 text-center">
                                            <p className="text-sm font-black text-[#5E5A71]">
                                                {activeOfficerSubTab === 'live' ? 'Live Content (Empty)' : 'Tasks Content (Empty)'}
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
                                                Leads for {selectedOfficer?.name || 'Officer'}
                                            </h3>
                                            {!selectedOfficer?.projects?.length ? (
                                                <div className="text-center py-6 border border-dashed border-[#E1DDF0] rounded-[8px] bg-[#FCFBFF]">
                                                    <p className="text-xs font-bold text-[#5E5A71]">No active leads.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                                    {selectedOfficer.projects.map((proj) => {
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
                                                                    <p className="text-xs font-black truncate max-w-[120px]">{proj.projectName}</p>
                                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                                        proj.type === 'Hot' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                                    }`}>
                                                                        {proj.type}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] text-[#5E5A71] mt-1 truncate">{proj.developerName}</p>
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
