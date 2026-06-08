import { useState } from 'react';
import {
    ArrowRight, Check, CheckCircle2, Edit2, Image as ImageIcon,
    MapPin, Navigation, PhoneCall, Save, Trash2
} from 'lucide-react';
import { mockProjects, sample2Requirements } from '../../data/mockData';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Requirements = () => {
    const [localReqs, setLocalReqs] = useState(sample2Requirements);
    const [mode, setMode] = useState('LIST');
    const [selectedReq, setSelectedReq] = useState(null);

    const handleDelete = (id) => {
        setLocalReqs(localReqs.filter((req) => req.id !== id));
    };

    const openForm = (req = null) => {
        setSelectedReq(req);
        setMode('FORM');
    };

    const openAssign = (req) => {
        setSelectedReq(req);
        setMode('ASSIGN');
    };

    const backToList = () => {
        setSelectedReq(null);
        setMode('LIST');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Customer Requirements" showBack={mode !== 'LIST'} onBack={backToList} />
            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto">
                    {mode === 'LIST' && (
                        <Card noPadding className="animate-in fade-in duration-300">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Customer Requirement List</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage leads requirements and assign matched properties.</p>
                                </div>
                                <Button className="bg-[#4CAF50] hover:bg-[#43A047] text-white shadow-sm font-bold" onClick={() => openForm()}>
                                    Add Customer Requirement
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            {['S NO', 'LISTING TYPE', 'LISTING KIND TYPE', 'PROPERTY TYPE', 'CUSTOMER NAME', 'CONTACT NUMBER', 'BUDGET', 'DATE', 'TIME SLOT', 'PROPERTY AVAILABLE', 'ACTION'].map((header) => (
                                                <th key={header} className={`px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider ${['S NO', 'PROPERTY AVAILABLE', 'ACTION'].includes(header) ? 'text-center' : ''}`}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {localReqs.map((req, index) => (
                                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{req.listingType}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.listingKind}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{req.propType}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-800">{req.name}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.phone}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.budget}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.date}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{req.time}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-center text-gray-800">{req.propAvailable}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button onClick={() => openForm(req)} className="w-8 h-8 rounded bg-[#03A9F4] text-white flex items-center justify-center hover:bg-[#039BE5] transition-colors shadow-sm" title="Edit">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(req.id)} className="w-8 h-8 rounded bg-[#F44336] text-white flex items-center justify-center hover:bg-[#E53935] transition-colors shadow-sm" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => openAssign(req)} className="px-3 py-1.5 rounded bg-[#03A9F4] text-white text-[11px] font-bold hover:bg-[#039BE5] transition-colors shadow-sm whitespace-nowrap">
                                                            Assign Property
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {mode === 'FORM' && <RequirementForm req={selectedReq} onBack={backToList} />}
                    {mode === 'ASSIGN' && <AssignProperty req={selectedReq} onBack={backToList} />}
                </div>
            </main>
        </div>
    );
};

const RequirementForm = ({ req, onBack }) => {
    const isEdit = !!req;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-sm border border-gray-200">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Customer Requirement' : 'Add Customer Requirement'}</h2>
            </div>

            <Card className="p-8">
                <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); onBack(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SelectField label="Listing Type" options={['Buy', 'Rent']} />
                        <SelectField label="Listing Kind Type" options={['Residential', 'Commercial']} />
                        <SelectField label="Property Type" options={['APARTMENT/FLATS', 'VILLA / HOUSE', 'PLOT']} />
                        <SelectField label="Property Sub Type" options={['Select Property Sub Type', '1 BHK', '2 BHK', '3 BHK']} />
                        <InputField label="Customer Name" value={req?.name || ''} placeholder="e.g. mango" />
                        <InputField label="Contact Number" value={req?.phone || ''} placeholder="e.g. 8225000092" />

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-800 tracking-wider mb-4 block">Budget Range</label>
                            <div className="px-2">
                                <div className="h-2 bg-gray-200 rounded-full relative w-full mb-3">
                                    <div className="absolute top-0 left-0 h-full bg-[#6F4BFF] rounded-full w-[60%]"></div>
                                    <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-4 h-4 bg-white border-2 border-[#6F4BFF] rounded-full shadow-sm cursor-pointer"></div>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-[#6F4BFF]">
                                    <span>₹ 1 L</span>
                                    <span className="text-[#4CAF50]">₹ 38.25 Cr</span>
                                </div>
                            </div>
                        </div>

                        <InputField label="Min Area (Optional)" />
                        <InputField label="Max Area (Optional)" />
                        <div className="md:col-span-2">
                            <SelectField label="Area Unit (Optional)" options={['Square Feet (Sq. ft)', 'Square Meter (Sq. m)']} half />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-800 tracking-wider">Details (Optional)</label>
                            <textarea rows="3" className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900"></textarea>
                        </div>
                        <div className="md:col-span-2 border-t border-gray-100 pt-6">
                            <label className="text-xs font-bold text-gray-800 tracking-wider mb-4 block">Locations</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <input type="text" defaultValue="687, Indore, Madhya Pradesh, 452001" className="flex-[2] w-full border border-gray-300 rounded-lg p-3 outline-none text-sm font-medium" />
                                <input type="text" defaultValue="22.7020963" className="flex-1 w-full border border-gray-300 rounded-lg p-3 outline-none text-sm font-medium" placeholder="Latitude" />
                                <input type="text" defaultValue="75.8651963" className="flex-1 w-full border border-gray-300 rounded-lg p-3 outline-none text-sm font-medium" placeholder="Longitude" />
                                <button type="button" className="px-4 py-3 bg-white border border-[#6F4BFF] text-[#6F4BFF] font-bold rounded-lg text-sm whitespace-nowrap hover:bg-purple-50">Open Map</button>
                            </div>
                            <button type="button" className="mt-4 px-4 py-2 border border-[#6F4BFF] text-[#6F4BFF] font-bold rounded-lg text-sm bg-white hover:bg-purple-50">
                                + Add More Location
                            </button>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <Button type="submit" className="px-8 py-3 shadow-md" icon={Save}>Save Requirement</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const AssignProperty = ({ req, onBack }) => {
    const [assignedOfficer, setAssignedOfficer] = useState('');
    const [selectedProps, setSelectedProps] = useState([]);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);

    const toggleProperty = (id) => {
        setSelectedProps((current) => current.includes(id) ? current.filter((pid) => pid !== id) : [...current, id]);
    };

    const handleAssignSubmit = () => {
        if (!assignedOfficer || selectedProps.length === 0) return;
        setAssignmentSuccess(true);
        setTimeout(onBack, 1200);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-colors shadow-sm border border-gray-200">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Assign Properties to Client & Officer</h2>
            </div>

            {assignmentSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-3 font-bold animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    Properties successfully assigned to {assignedOfficer} and sent to the client's app! Redirecting...
                </div>
            )}

            <Card className="p-6">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Customer Requirement</h3>
                        <p className="text-base font-bold text-gray-800 mt-2">{req.name}</p>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1"><PhoneCall className="w-4 h-4" /> {req.phone}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Listing Type: {req.listingType}</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Budget: {req.budget}</span>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-6">
                    <div className="flex-1 max-w-md">
                        <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 block">Assign Sales Man *</label>
                        <select value={assignedOfficer} onChange={(event) => setAssignedOfficer(event.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
                            <option value="">Select Sales Officer</option>
                            <option value="manas (sales_officer)">manas (sales_officer)</option>
                            <option value="neha (sales_officer)">neha (sales_officer)</option>
                            <option value="rahul (sales_officer)">rahul (sales_officer)</option>
                        </select>
                    </div>
                    <button onClick={handleAssignSubmit} disabled={!assignedOfficer || selectedProps.length === 0} className="bg-[#6F4BFF] hover:bg-[#5936eb] text-white px-8 py-3 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all flex items-center gap-2">
                        <Navigation className="w-4 h-4" /> Dispatch to App
                    </button>
                </div>
            </Card>

            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-gray-900">Property List</h3>
                <span className="text-sm font-bold text-gray-600">Selected: <span className="text-[#6F4BFF] text-lg">{selectedProps.length}</span></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map((project) => {
                    const isSelected = selectedProps.includes(project.id);
                    return (
                        <Card key={project.id} noPadding className={`relative border-2 transition-all cursor-pointer ${isSelected ? 'border-[#6F4BFF] shadow-md ring-2 ring-[#6F4BFF]/20' : 'border-gray-200 hover:border-[#6F4BFF]/50'}`}>
                            <div className="absolute top-4 right-4 z-20" onClick={() => toggleProperty(project.id)}>
                                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300'}`}>
                                    {isSelected && <Check className="w-4 h-4" />}
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 items-start" onClick={() => toggleProperty(project.id)}>
                                <div className="w-20 h-24 bg-linear-to-br from-gray-200 to-gray-300 rounded-lg shrink-0 flex items-center justify-center overflow-hidden relative">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-1 pr-6">
                                    <h4 className="font-bold text-gray-900 text-base capitalize">{project.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">{project.specs || 'No description available.'}</p>
                                    <p className="text-[11px] text-gray-500 font-medium flex items-start gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                        <span className="line-clamp-2">{project.location}</span>
                                    </p>
                                    <button className="mt-3 text-[#6F4BFF] border border-[#6F4BFF] bg-white hover:bg-purple-50 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

const InputField = ({ label, value = '', placeholder = '' }) => (
    <div>
        <label className="text-xs font-bold text-gray-800 tracking-wider">{label}</label>
        <input type="text" defaultValue={value} className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900" placeholder={placeholder} />
    </div>
);

const SelectField = ({ label, options, half = false }) => (
    <div className={half ? 'w-full md:w-1/2' : ''}>
        <label className="text-xs font-bold text-gray-800 tracking-wider">{label}</label>
        <select className="w-full mt-2 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-medium text-gray-900 bg-white">
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

export default Requirements;
