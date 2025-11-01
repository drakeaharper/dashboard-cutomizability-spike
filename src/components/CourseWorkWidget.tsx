import React from 'react';
import { TemplateWidget } from './TemplateWidget';
import type { WidgetComponentProps } from '../types/widgets';
import './CourseWorkWidget.css';

export const CourseWorkWidget: React.FC<WidgetComponentProps> = ({ widget }) => {
  return (
    <TemplateWidget title={widget.title}>
      <div className="course-work-filters">
        <div className="filter-group">
          <label>Course filter:</label>
          <select className="filter-select">
            <option>All Courses</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Assignment filter:</label>
          <select className="filter-select">
            <option>Next 3 days</option>
          </select>
        </div>
      </div>

      <div className="course-work-summary">
        <div className="summary-card summary-card-blue">
          <div className="summary-count">0</div>
          <div className="summary-label">Due</div>
        </div>
        <div className="summary-card summary-card-red">
          <div className="summary-count">0</div>
          <div className="summary-label">Missing</div>
        </div>
        <div className="summary-card summary-card-green">
          <div className="summary-count">0</div>
          <div className="summary-label">Submitted</div>
        </div>
      </div>

      <div className="no-work-message">
        No upcoming course work
      </div>
    </TemplateWidget>
  );
};
