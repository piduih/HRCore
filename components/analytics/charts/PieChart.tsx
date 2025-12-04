import React from 'react';

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
}

interface PieChartProps {
    data: ChartData;
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    if (total === 0) {
        return <div className="text-center p-8 text-neutral-500">No data available</div>;
    }

    let cumulativePercentage = 0;
    const gradients = data.datasets[0].data.map((value, index) => {
        const percentage = (value / total) * 100;
        const color = data.datasets[0].backgroundColor[index % data.datasets[0].backgroundColor.length];
        const start = cumulativePercentage;
        cumulativePercentage += percentage;
        const end = cumulativePercentage;
        return `${color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div 
                className="w-48 h-48 rounded-full"
                style={{ background: `conic-gradient(${gradients})` }}
                role="img"
                aria-label="Pie chart"
            ></div>
            <div className="flex-1">
                <ul className="space-y-2">
                    {data.labels.map((label, index) => {
                         const value = data.datasets[0].data[index];
                         const percentage = ((value / total) * 100).toFixed(1);
                         const color = data.datasets[0].backgroundColor[index % data.datasets[0].backgroundColor.length];
                        return (
                            <li key={label} className="flex items-center text-sm">
                                <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></span>
                                <span className="font-semibold text-neutral-700">{label}:</span>
                                <span className="ml-auto text-neutral-600">{value} ({percentage}%)</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
