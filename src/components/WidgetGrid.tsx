import React from 'react';
import type { Widget } from '../types/widgets';
import { getWidget } from './WidgetRegistry';
import './WidgetGrid.css';

interface WidgetGridProps {
  widgets: Widget[];
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets }) => {
  // Group widgets by column following Canvas LMS pattern
  const widgetsAsColumns = (widgets: Widget[]): Widget[][] => {
    const inColumns = widgets.reduce(
      (acc, widget) => {
        const column = widget.position.col || 1;
        acc[column - 1].push(widget);
        return acc;
      },
      [[] as Widget[], [] as Widget[]] as Widget[][]
    );

    // Sort each column by row position
    inColumns.forEach((column, idx) => {
      inColumns[idx] = column.sort((a, b) => a.position.row - b.position.row);
    });

    return inColumns;
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.enabled) return null;

    const widgetRenderer = getWidget(widget.type);
    if (!widgetRenderer) {
      return (
        <div key={widget.id} className="widget-error">
          Unknown widget type: {widget.type}
        </div>
      );
    }

    const WidgetComponent = widgetRenderer.component;
    return <WidgetComponent key={widget.id} widget={widget} />;
  };

  const widgetsByColumn = widgetsAsColumns(widgets.filter(w => w.enabled));

  return (
    <div className="widget-grid" data-testid="widget-columns">
      <div className="widget-column widget-column-left">
        {widgetsByColumn[0]?.map(renderWidget)}
      </div>
      <div className="widget-column widget-column-right">
        {widgetsByColumn[1]?.map(renderWidget)}
      </div>
    </div>
  );
};
