import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const MetricCard = ({ title, value, trend, isUp, icon: Icon, color, bg, chartColor, svgPath, index }) => (
    <Card noPadding className="group cursor-pointer hover:border-[#6F4BFF]/40 hover:shadow-xl hover:shadow-[#6F4BFF]/5 transition-all duration-500 relative overflow-hidden h-40">
        <div className="p-6 relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${bg} ${color} shadow-sm backdrop-blur-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
                <button 
                className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Action for ${title} clicked`);
                }}
            >
                <Sparkles className="w-4 h-4 text-white" />
            </button>
                <Badge variant={isUp ? 'green' : 'red'} className="flex items-center gap-1 shadow-sm">
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {trend}
                </Badge>
            </div>
            <div>
                <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
            </div>
        </div>
        {/* SVG Sparkline Background */}
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-30 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                    <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColor} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={svgPath} fill={`url(#grad-${index})`} />
                <path d={svgPath.replace('L100,30 L0,30 Z', '')} fill="none" stroke={chartColor} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
        </div>
    </Card>
);

export default MetricCard;
