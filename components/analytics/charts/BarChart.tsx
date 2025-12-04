import React from 'react';

interface BarChartProps {
    data: { label: string; value: number }[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center p-8 text-neutral-500">No data available</div>;
    }

    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
        <div className="w-full h-80 flex items-end justify-around p-4 border-l border-b border-neutral-300">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center h-full w-full justify-end group">
                     <div className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        RM {item.value.toLocaleString()}
                    </div>
                    <div
                        className="w-3/4 bg-primary-300 rounded-t-md hover:bg-primary transition-colors"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        title={`${item.label}: RM ${item.value.toLocaleString()}`}
                    ></div>
                    <div className="mt-2 text-xs text-neutral-600 font-semibold text-center">{item.label}</div>
                </div>
            ))}
        </div>
    );
};
