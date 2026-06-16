import React from 'react';
import Card from '../ui/Card';

const calculatePath = (items, maxValue) => {
    if (!items.length) return '';

    const heightRange = 80;
    const paddingTop = 10;
    const points = items.map((item, index) => {
        const x = items.length === 1 ? 0 : (index / (items.length - 1)) * 100;
        const y = 100 - paddingTop - (item.val / maxValue) * heightRange;
        return `${x},${Math.max(10, Math.min(90, y))}`;
    });

    return points.reduce((path, point, index) => (index === 0 ? `M${point}` : `${path} L${point}`), '');
};

const buildAreaPath = (points) => {
    if (!points) return '';
    return `${points} L100,100 L0,100 Z`;
};

const RevenueTrajectory = ({ data }) => {
    const revenueValues = data?.revenue || [];
    const dealValues = data?.deals || [];
    const maxRevenue = Math.max(...revenueValues.map((item) => item.val), 1);
    const maxDeals = Math.max(...dealValues.map((item) => item.val), 1);
    const revenuePath = calculatePath(revenueValues, maxRevenue);
    const dealsPath = calculatePath(dealValues, maxDeals);

    return (
        <Card className="p-6 flex flex-col relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-32 bg-[#6F4BFF]/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Revenue Trajectory</h3>
                    <p className="text-xs text-gray-500 font-medium">Actuals vs deals volume</p>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-sm bg-[#6F4BFF]" /> Revenue (Cr)</span>
                    <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Deals Volume</span>
                </div>
            </div>

            <div className="flex-1 relative w-full h-64 border-l border-b border-gray-100">
                <div className="absolute inset-0 flex flex-col justify-between z-0">
                    {[4, 3, 2, 1, 0].map((val) => (
                        <div key={val} className="w-full border-t border-gray-100/60 relative">
                            <span className="absolute -left-6 -top-2.5 text-[10px] font-bold text-gray-400">{val}C</span>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 w-full flex justify-between px-6 translate-y-6 z-0">
                    {revenueValues.map((item) => (
                        <span key={item.month} className="text-[10px] font-bold text-gray-400">{item.month}</span>
                    ))}
                </div>

                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 z-10 p-2 overflow-visible">
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6F4BFF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6F4BFF" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    <path d={buildAreaPath(revenuePath)} fill="url(#areaGrad)" />
                    <path d={revenuePath} fill="none" stroke="#6F4BFF" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-md" />
                    <path d={dealsPath} fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="4 2" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </Card>
    );
};

export default RevenueTrajectory;
