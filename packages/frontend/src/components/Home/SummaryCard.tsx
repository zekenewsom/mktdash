import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SnapshotIndicatorItem {
  id: string;
  name: string;
  value?: number | string | null;
  changePercent?: number | null;
  date?: string | null;
  unit?: string;
  linkType?: 'series' | 'crypto';
}

interface SummaryCardProps {
  title: string;
  icon?: React.ElementType;
  indicators: SnapshotIndicatorItem[];
  viewMoreLink: string;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, icon: Icon, indicators, viewMoreLink, className }) => {
  return (
    <div className={cn("bg-card text-card-foreground rounded-xl shadow-lg p-6 flex flex-col h-full", className)}>
      <div className="flex items-center mb-4">
        {Icon && <Icon className="h-7 w-7 mr-3 text-primary" />}
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
      </div>
      <ul className="space-y-3 flex-grow">
        {indicators.slice(0, 4).map((item) => {
          const detailLink = item.linkType === 'crypto' ? `/crypto/${item.id}` : `/series/${item.id}`;
          return (
            <li key={item.id} className="text-sm">
              <Link to={detailLink} className="hover:underline text-foreground font-medium flex justify-between items-center group">
                <span>{item.name}</span>
                <div className="text-right">
                  <span className="font-semibold">
                    {typeof item.value === 'number' ? item.value.toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits:2}) : item.value}
                    {item.unit && item.value !== 'N/A' ? item.unit : ''}
                  </span>
                  {item.changePercent !== null && item.changePercent !== undefined && (
                    <span className={`ml-2 text-xs ${item.changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </Link>
              {item.date && <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>}
            </li>
          );
        })}
      </ul>
      <Link
        to={viewMoreLink}
        className="mt-auto pt-4 text-sm font-medium text-primary hover:underline flex items-center self-start group"
      >
        View Full Dashboard
        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default SummaryCard;
