import React, { type ReactNode } from 'react';
import './TemplateWidget.css';

interface TemplateWidgetProps {
  title: string;
  children: ReactNode;
  headerAction?: ReactNode;
}

export const TemplateWidget: React.FC<TemplateWidgetProps> = ({
  title,
  children,
  headerAction
}) => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <h2 className="widget-title">{title}</h2>
        {headerAction && <div className="widget-header-action">{headerAction}</div>}
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};
