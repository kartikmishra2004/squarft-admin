import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  isLoading = false, 
  icon: Icon,
  className = '',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark shadow-md shadow-brand/20',
    secondary: 'bg-brand/10 text-brand hover:bg-brand/20',
    outline: 'bg-transparent border-2 border-brand text-brand hover:bg-brand/5',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200',
    google: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-[12px] rounded-lg',
    md: 'px-5 py-2.5 text-[14px] rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-2xl'
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.01, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden font-bold transition-all flex items-center justify-center gap-2 cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed disabled:grayscale-[0.5]
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
