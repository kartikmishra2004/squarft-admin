import React from 'react';

const Badge = ({ children, variant = 'gray', className = '' }) => {
    const variants = {
        gray: 'bg-gray-100 text-gray-700',
        purple: 'bg-[#6F4BFF]/10 text-[#6F4BFF] border border-[#6F4BFF]/20',
        green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        yellow: 'bg-amber-50 text-amber-700 border border-amber-100',
        red: 'bg-rose-50 text-rose-700 border border-rose-100',
        blue: 'bg-blue-50 text-blue-700 border border-blue-100',
        gradient: 'bg-linear-to-r from-purple-500 to-amber-500 text-white shadow-sm border-none',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
