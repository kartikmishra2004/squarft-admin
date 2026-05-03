import React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const BranchLeaderboard = ({ branches, onManageClick }) => (
    <Card noPadding className="flex flex-col shadow-lg border-gray-200 relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-md z-10">
            <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Branch Leaderboard</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">Cross-region revenue and target tracking.</p>
            </div>
            <Button variant="secondary" icon={Globe} onClick={onManageClick}>Manage Branches</Button>
        </div>
        <div className="flex-1 p-6 bg-white z-10">
            <div className="space-y-6">
                {branches.map((branch, i) => (
                    <div key={i} className="relative">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-black text-gray-300 w-6">#{i + 1}</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                        {branch.name}
                                        {i === 0 && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">Top Performer</span>}
                                    </h4>
                                    <p className="text-xs font-medium text-gray-500">{branch.activeDeals} Active Deals • Head: {branch.head}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg text-emerald-600">{branch.revenue}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{branch.target}% to Target</p>
                            </div>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-linear-to-r from-blue-500 to-emerald-400 rounded-full relative" style={{ width: `${branch.target}%` }}>
                                <div className="absolute inset-0 bg-white/20 w-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Card>
);

export default BranchLeaderboard;
