import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden ${className}`}>
        {noPadding ? children : <div className="p-6">{children}</div>}
    </div>
);

export default Card;
