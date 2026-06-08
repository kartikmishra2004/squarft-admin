import React from 'react';
import { Settings } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const UserRoleDistribution = ({ roleData, onManageClick, onSettingsClick }) => (
    <Card className="flex flex-col relative overflow-hidden shadow-lg border-gray-200 h-full">
        <div className="absolute -bottom-20 -right-20 p-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="flex justify-between items-center mb-8 z-10">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Users by Role</h3>
            <button
                onClick={onSettingsClick}
                className="p-2 bg-gray-50 rounded-lg hover:bg-[#6F4BFF]/10 hover:text-[#6F4BFF] transition-colors text-gray-400"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-5 z-10">
            {roleData.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${r.color} shadow-sm`}></div>
                        <span className="font-bold text-gray-700 text-sm">{r.role}</span>
                    </div>
                    <span className="font-black text-gray-900 text-lg bg-gray-100 px-3 py-1 rounded-lg">{r.count}</span>
                </div>
            ))}
        </div>
        <Button 
            variant="ghost" 
            className="mt-4 text-[#6F4BFF] w-full bg-[#6F4BFF]/5 hover:bg-[#6F4BFF]/10 font-bold"
            onClick={onManageClick}
        >
            Manage Users Directory
        </Button>
    </Card>
);

export default UserRoleDistribution;
