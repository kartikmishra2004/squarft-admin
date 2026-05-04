import React from 'react';
import { Activity, IndianRupee, Heart, Users, MapPin, FileText, Clock } from 'lucide-react';
import Card from '../ui/Card';

const iconMap = {
    payment: { icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    status: { icon: Heart, color: 'text-purple-500', bg: 'bg-purple-50' },
    lead: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    visit: { icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
    document: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
};

const LiveActivityFeed = ({ activities }) => {
    return (
        <Card className="p-6 h-[400px] flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500 animate-pulse" /> Live Activity Feed
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                {activities.map((feed, i) => {
                    const meta = iconMap[feed.type] || iconMap.status;
                    const Icon = meta.icon;
                    return (
                        <div key={i} className="flex gap-4 relative">
                            {/* Connecting Line */}
                            {i !== activities.length - 1 && <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-100"></div>}

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.bg}`}>
                                <Icon className={`w-4 h-4 ${meta.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{feed.action}</p>
                                <p className="text-xs text-gray-500 font-medium mb-1">{feed.detail}</p>
                                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {feed.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default LiveActivityFeed;
