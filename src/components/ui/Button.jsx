import React from 'react';

const Button = ({ children, variant = 'primary', icon: Icon, onClick, className = '', type = "button", disabled = false }) => {
    const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-[#6F4BFF] hover:bg-[#5936eb] text-white shadow-md shadow-[#6F4BFF]/20 focus:ring-[#6F4BFF]",
        secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-200 shadow-sm",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
        danger: "bg-rose-50 hover:bg-rose-100 text-rose-700 focus:ring-rose-500",
        success: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 focus:ring-emerald-500 shadow-sm",
        blue: "bg-[#2196F3] hover:bg-[#1E88E5] text-white shadow-sm focus:ring-[#2196F3]",
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};

export default Button;
