import React from 'react';
import { TemplateWidget } from './TemplateWidget';
import type { WidgetComponentProps } from '../types/widgets';
import './ProgressOverviewWidget.css';

interface ProgressItem {
  label: string;
  count: number;
  color: string;
  percentage: number;
}

const mockProgressData: ProgressItem[] = [
  { label: 'Completed course work', count: 36, color: '#0B874B', percentage: 47 },
  { label: 'Completed modules work', count: 6, color: '#0B5FAB', percentage: 8 },
  { label: 'Ungraded work', count: 2, color: '#C67D33', percentage: 3 },
  { label: 'Upcoming available work', count: 13, color: '#E5E5E5', percentage: 42 }
];

export const ProgressOverviewWidget: React.FC<WidgetComponentProps> = ({ widget }) => {
  return (
    <TemplateWidget title={widget.title}>
      <div className="progress-overview">
        <div className="progress-filters">
          <select className="filter-select">
            <option>All time</option>
            <option>This week</option>
            <option>This month</option>
          </select>
          <select className="filter-select">
            <option>All active courses</option>
            <option>Current courses</option>
          </select>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            {mockProgressData.map((item, index) => (
              item.percentage > 0 && (
                <div
                  key={index}
                  className="progress-segment"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              )
            ))}
          </div>
        </div>

        <div className="progress-legend">
          {mockProgressData.map((item, index) => (
            <div key={index} className="progress-legend-item">
              <div className="legend-info">
                <span
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend-label">{item.label}</span>
              </div>
              <span className="legend-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </TemplateWidget>
  );
};
