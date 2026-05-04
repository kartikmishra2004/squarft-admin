import React from 'react';
import { Globe } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const GeographicPerformance = ({ data }) => {
    return (
        <Card className="p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" /> Geographic Performance
                </h3>
                <Button variant="ghost" className="text-xs">View Map</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.map((c, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-gray-800 text-sm">{c.city}</h4>
                            <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{c.closed} Deals</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-2">
                            <span className="text-xl font-bold text-gray-900">{c.leads}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Active Leads</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default GeographicPerformance;
