import React from 'react';
import Card from '../ui/Card';

const PipelineFunnel = ({ data }) => {
    return (
        <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">AI Predicted Pipeline Velocity</h3>
            <div className="space-y-3">
                {data.map((f, i) => (
                    <div key={i} className="relative">
                        <div className="flex justify-between text-xs font-bold mb-1.5 px-1">
                            <span className="text-gray-600">{f.label}</span>
                            <span className="text-gray-900">{f.val}</span>
                        </div>
                        <div className="w-full h-6 bg-gray-50 rounded-md border border-gray-100 p-0.5 relative overflow-hidden flex justify-center">
                            {/* The bar fills from center for a funnel effect */}
                            <div className={`h-full rounded-sm bg-gradient-to-r ${f.color} transition-all duration-1000 shadow-sm relative overflow-hidden`} style={{ width: f.width }}>
                                {/* Glossy overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PipelineFunnel;
