import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Save } from 'lucide-react';
import { mockLeads } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Header from '../../components/layout/Header';

const getStatusBadge = (status) => {
    if (status === 'New') return <Badge variant="purple">{status}</Badge>;
    if (status === 'Follow Up') return <Badge variant="yellow">{status}</Badge>;
    if (status === 'Contacted') return <Badge variant="blue">{status}</Badge>;
    return <Badge variant="gray">{status}</Badge>;
};

const Leads = () => {
    const navigate = useNavigate();
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Leads Pipeline" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto">
                    <Card noPadding className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Raw Leads Pipeline</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage and nurture inquiries until they become qualified clients.</p>
                            </div>
                            <div className="flex gap-3">
                                <Button icon={Filter} variant="secondary">Filter</Button>
                                <Button icon={Plus} onClick={() => setIsAddLeadOpen(true)}>Add New Lead</Button>
                            </div>
                        </div>

                        <Table
                            headers={['Lead Name', 'Contact', 'Budget', 'Status', 'Assigned', 'Action']}
                            data={mockLeads}
                            renderRow={(row, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                            {row.name}
                                            {row.score === 'Hot' && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" title="Hot Lead"></span>}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">Added: {row.date}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-800">{row.phone}</div>
                                        <div className="text-xs text-gray-500">{row.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-800">{row.budget}</div>
                                        <div className="text-xs text-gray-600">{row.req}</div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-[#6F4BFF]">
                                                {row.officer.charAt(0)}
                                            </div>
                                            {row.officer}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            variant="secondary"
                                            className="text-xs py-1.5 px-3 hover:border-[#6F4BFF] hover:text-[#6F4BFF]"
                                            onClick={() => navigate('/dashboard/clients')}
                                        >
                                            Qualify
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        />
                    </Card>
                </div>
            </main>

            <Modal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} title="Add New Lead">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddLeadOpen(false); }}>
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Save}>Save Lead</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Leads;
