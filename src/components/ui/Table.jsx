import React from 'react';

const Table = ({ headers, data, renderRow }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/80 border-y border-gray-100">
                    {headers.map((h, i) => (
                        <th key={i} className={`px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${h.includes('ACTION') || h.includes('STATUS') ? 'text-center' : ''}`}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((row, i) => renderRow(row, i))}
            </tbody>
        </table>
    </div>
);

export default Table;
