import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleChartProps {
  data: { name: string; value: number; color?: string }[];
  className?: string;
  type?: 'bar' | 'line' | 'donut';
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  className, 
  type = 'bar' 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  if (type === 'donut') {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className={cn("relative w-32 h-32", className)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-muted"
            strokeWidth="3"
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={item.color || "stroke-primary"}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{total}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <span className="text-sm font-medium w-20 truncate">{item.name}</span>
          <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                item.color || "bg-primary"
              )}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground w-12 text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};