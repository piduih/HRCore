
import React from 'react';

interface Dataset {
    label: string;
    data: number[];
    borderColor: string;
}

interface ChartData {
    labels: string[];
    datasets: Dataset[];
}

interface LineChartProps {
    data: ChartData;
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
    if (!data || data.datasets.some(ds => ds.data.length === 0)) {
        return <div className="text-center p-8 text-neutral-500">No data available</div>;
    }

    const width = 500;
    const height = 300;
    const padding = 50;

    const allDataPoints = data.datasets.flatMap(ds => ds.data);
    const maxY = Math.ceil(Math.max(...allDataPoints) / 5) * 5; // Round up to nearest 5
    const minY = 0;

    const xScale = (index: number) => padding + (index * (width - 2 * padding)) / (data.labels.length - 1);
    const yScale = (value: number) => height - padding - ((value - minY) * (height - 2 * padding)) / (maxY - minY);

    const yAxisLabels = Array.from({ length: 6 }, (_, i) => minY + (i * (maxY - minY)) / 5);

    return (
        <div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby="chart-title">
                <title id="chart-title">Line chart showing data trends</title>
                {/* Y-axis grid lines and labels */}
                {yAxisLabels.map(label => (
                    <g key={label} className="text-neutral-400">
                        <line
                            x1={padding}
                            y1={yScale(label)}
                            x2={width - padding}
                            y2={yScale(label)}
                            stroke="currentColor"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                        />
                        <text
                            x={padding - 10}
                            y={yScale(label) + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="currentColor"
                        >
                            {label}
                        </text>
                    </g>
                ))}
                
                 {/* Y-axis Title */}
                <text 
                    transform={`rotate(-90)`}
                    y={15}
                    x={-(height / 2)}
                    dy="1em"
                    fontSize="12"
                    textAnchor="middle"
                    fill="#6B7280"
                >
                    Days
                </text>


                {/* X-axis labels */}
                {data.labels.map((label, index) => (
                    <text
                        key={label}
                        x={xScale(index)}
                        y={height - padding + 20}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6B7280"
                    >
                        {label}
                    </text>
                ))}
                 {/* X-axis Title */}
                <text 
                    x={width / 2} 
                    y={height - 5}
                    fontSize="12" 
                    textAnchor="middle" 
                    fill="#6B7280"
                >
                    Month
                </text>


                {/* Data lines and points */}
                {data.datasets.map(dataset => (
                    <g key={dataset.label}>
                        <polyline
                            fill="none"
                            stroke={dataset.borderColor}
                            strokeWidth="2"
                            points={dataset.data.map((value, index) => `${xScale(index)},${yScale(value)}`).join(' ')}
                        />
                        {dataset.data.map((value, index) => (
                             <circle
                                key={`${dataset.label}-${index}`}
                                cx={xScale(index)}
                                cy={yScale(value)}
                                r="3"
                                fill={dataset.borderColor}
                            />
                        ))}
                    </g>
                ))}
            </svg>
            {/* Legend */}
            <div className="flex justify-center space-x-4 mt-4 text-sm">
                {data.datasets.map(dataset => (
                    <div key={dataset.label} className="flex items-center">
                        <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: dataset.borderColor }}></span>
                        <span>{dataset.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
