import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Plus, Search, Calendar, Clock, User, 
    CheckCircle2, XCircle, MoreVertical, 
    AlertCircle, Filter, Trash2, Edit2, Check
} from 'lucide-react';
import { addTask, deleteTask, updateTaskStatus } from '../../store/tasksSlice';
import { mockUsers } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

const getStatusBadge = (status) => {
    if (!status) return null;
    switch (status.toUpperCase()) {
        case 'COMPLETED': case 'DONE':
            return <Badge variant="green">{status}</Badge>;
        case 'PENDING': case 'IN PROGRESS': case 'SCHEDULED':
            return <Badge variant="yellow">{status}</Badge>;
        case 'CANCELLED': case 'REJECTED':
            return <Badge variant="red">{status}</Badge>;
        case 'NEW':
            return <Badge variant="purple">{status}</Badge>;
        default:
            return <Badge variant="gray">{status}</Badge>;
    }
};

const Tasks = () => {
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddTask = (newTask) => {
        dispatch(addTask(newTask));
        setIsModalOpen(false);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Delete this task?')) {
            dispatch(deleteTask(id));
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900">
            <Header title="Task Management" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Operational Tasks</h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium italic">Cross-team coordination and daily action items.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks or assignees..."
                                    className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="font-black uppercase tracking-widest text-xs">Assign Task</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <Card noPadding className="overflow-hidden border-gray-100 shadow-xl shadow-gray-200/50">
                                <Table
                                    headers={['TASK DESCRIPTION', 'ASSIGNEE', 'DUE DATE', 'PRIORITY', 'STATUS', 'ACTION']}
                                    data={filteredTasks}
                                    renderRow={(row, i) => (
                                        <tr key={i} className="hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                                            <td className="px-6 py-5 max-w-md">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${row.priority === 'High' ? 'bg-rose-500 shadow-lg shadow-rose-500/40 animate-pulse' : row.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                                    <span className="font-black text-gray-900 tracking-tight leading-tight">{row.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-black text-gray-700">{row.assignee}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                                                    <Calendar className="w-3.5 h-3.5 text-[#6F4BFF]" />
                                                    {row.due}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                                    row.priority === 'High' ? 'text-rose-600 bg-rose-50 border-rose-100' :
                                                    row.priority === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                                    'text-blue-600 bg-blue-50 border-blue-100'
                                                }`}>
                                                    {row.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStatusBadge(row.status)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-500 transition-all" title="Mark Complete">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteTask(row.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-400 transition-all" title="Delete Task">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                />
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-6 bg-linear-to-br from-[#6F4BFF] to-[#9D84FF] text-white border-0 shadow-xl shadow-[#6F4BFF]/20">
                                <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                                <h3 className="text-xl font-black mb-1 uppercase tracking-tight">System Alerts</h3>
                                <p className="text-xs font-bold opacity-70 leading-relaxed mb-6">There are 3 high-priority tasks requiring immediate attention.</p>
                                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-0 text-white font-black uppercase tracking-widest text-[10px] h-11">Review Criticals</Button>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Task Completion</h3>
                                <div className="space-y-5">
                                    {[
                                        { label: 'Completed', val: 78, color: 'bg-emerald-500' },
                                        { label: 'In Progress', val: 45, color: 'bg-[#6F4BFF]' },
                                        { label: 'Pending', val: 12, color: 'bg-amber-500' },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest">
                                                <span className="text-gray-500">{stat.label}</span>
                                                <span className="text-gray-900">{stat.val}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${(stat.val / 100) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <AssignTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAssign={handleAddTask} 
            />
        </div>
    );
};

const AssignTaskModal = ({ isOpen, onClose, onAssign }) => {
    const [formData, setFormData] = useState({
        title: '',
        assignee: '',
        due: '',
        priority: 'Medium',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssign(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assign New Operational Task">
            <form onSubmit={handleSubmit} className="space-y-5 p-2">
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Task Description</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Verify site documents for Project X" 
                        className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-bold text-sm bg-gray-50"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Assign To</label>
                        <select 
                            className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-sm bg-gray-50"
                            value={formData.assignee}
                            onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                            required
                        >
                            <option value="">Select Member</option>
                            {mockUsers.map(u => <option key={u.id} value={u.name}>{u.name} ({u.type.replace('_', ' ')})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Priority Level</label>
                        <select 
                            className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-sm bg-gray-50"
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Due Date</label>
                    <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="date" 
                            className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#6F4BFF]/20 focus:border-[#6F4BFF] font-black text-sm bg-gray-50"
                            value={formData.due}
                            onChange={(e) => setFormData({...formData, due: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1 font-black uppercase tracking-widest text-[10px] h-12">Cancel</Button>
                    <Button type="submit" variant="primary" className="flex-1 font-black uppercase tracking-widest text-[10px] h-12" icon={Check}>Create Task</Button>
                </div>
            </form>
        </Modal>
    );
};

export default Tasks;
