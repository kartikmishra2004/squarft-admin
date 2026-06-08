import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';

const Header = ({ title, showBack = false, onBack, rightContent = null }) => {
    const { user } = useSelector((state) => state.auth);
    const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : 'Admin';
    const initial = user?.name?.charAt(0) || 'A';

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0">
            <div className="flex items-center gap-4">
                {showBack && (
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors border border-gray-200 bg-white shadow-sm">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                )}
                <h1 className="text-2xl font-black text-gray-800 capitalize tracking-tight">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {rightContent}

                <button 
                    className="relative text-gray-400 hover:text-gray-600 transition-colors bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
                    onClick={() => console.log("Notifications clicked")}
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
                </button>

                <div 
                    className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group"
                    onClick={() => console.log("Profile clicked")}
                >
                    <div className="text-right hidden sm:block">
                        <p className="font-bold text-gray-800 text-sm group-hover:text-[#6F4BFF] transition-colors">{user?.name || 'Admin User'}</p>
                        <p className="text-[10px] text-[#6F4BFF] font-black tracking-widest uppercase mt-0.5">{roleLabel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-gray-800 to-gray-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                        {initial}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
