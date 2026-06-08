import { useState } from 'react';
import { 
    adminMetrics, 
    revenueTrajectory, 
    liveActivity, 
    pipelineFunnel, 
    geoPerformance 
} from '../../data/mockData';
import Header from '../../components/layout/Header';
import MetricCard from '../../components/dashboard/MetricCard';
import RevenueTrajectory from '../../components/dashboard/RevenueTrajectory';
import LiveActivityFeed from '../../components/dashboard/LiveActivityFeed';
import PipelineFunnel from '../../components/dashboard/PipelineFunnel';
import GeographicPerformance from '../../components/dashboard/GeographicPerformance';

const Home = () => {
    const [timeRange, setTimeRange] = useState('30d');

    const ranges = [
        { id: '24h', label: '24h' },
        { id: '7d', label: '7d' },
        { id: '30d', label: '30d' },
        { id: '1y', label: '1y' }
    ];

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#F5F6FA] font-sans text-gray-900 selection:bg-[#6F4BFF]/20 selection:text-[#6F4BFF]">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-purple-400/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <Header title="Admin Dashboard" />

            <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                    
                    {/* HEADER SECTION */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Intelligence Overview</h2>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live data sync enabled
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            {ranges.map((range) => (
                                <button 
                                    key={range.id} 
                                    onClick={() => setTimeRange(range.id)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === range.id ? 'bg-[#6F4BFF] text-white shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* METRICS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-500">
                        {adminMetrics.map((m, i) => (
                            <MetricCard key={i} {...m} index={i} />
                        ))}
                    </div>

                    {/* CHARTS & ACTIVITY ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700">
                        <div className="lg:col-span-2">
                            <RevenueTrajectory data={revenueTrajectory} />
                        </div>
                        <div className="lg:col-span-1">
                            <LiveActivityFeed activities={liveActivity} />
                        </div>
                    </div>

                    {/* FUNNEL & GEO ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000">
                        <PipelineFunnel data={pipelineFunnel} />
                        <GeographicPerformance data={geoPerformance} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
