import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { branchDashboardData, mockBranches } from '../../data/mockData';
import Header from '../../components/layout/Header';
import MetricCard from '../../components/dashboard/MetricCard';
import BranchLeaderboard from '../../components/dashboard/BranchLeaderboard';
import UserRoleDistribution from '../../components/dashboard/UserRoleDistribution';

const SuperHome = () => {
    const navigate = useNavigate();
    const [activeBranchId, setActiveBranchId] = useState('all');
    const activeBranchData = useMemo(
        () => branchDashboardData[activeBranchId] || branchDashboardData.all,
        [activeBranchId]
    );

    const regionSelector = (
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
            <span className="text-xs font-bold text-gray-500 pl-2">Active Region:</span>
            <select
                value={activeBranchId}
                onChange={(event) => setActiveBranchId(event.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-[#6F4BFF] outline-none cursor-pointer shadow-sm"
            >
                <option value="all">All Branches (Global)</option>
                {mockBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-purple-400/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <Header title="Super Admin Dashboard" rightContent={regionSelector} />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-8">

                    {/* METRICS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeBranchData.metrics.map((m, i) => (
                            <MetricCard key={i} {...m} index={i} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* BRANCH PERFORMANCE LEADERBOARD */}
                        <div className="xl:col-span-2">
                            <BranchLeaderboard 
                                branches={activeBranchData.branches} 
                                onManageClick={() => navigate('/dashboard/branches')}
                            />
                        </div>

                        {/* SYSTEM ACCESS & ROLE DISTRIBUTION */}
                        <div className="xl:col-span-1">
                            <UserRoleDistribution 
                                roleData={activeBranchData.roleDistribution} 
                                onSettingsClick={() => navigate('/dashboard/roles')}
                                onManageClick={() => navigate('/dashboard/users')}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperHome;
