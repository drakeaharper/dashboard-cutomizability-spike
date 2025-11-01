import React from 'react';
import type { Widget } from '../types/widgets';
import { getWidget } from './WidgetRegistry';
import './WidgetGrid.css';

interface WidgetGridProps {
  widgets: Widget[];
  isEditMode?: boolean;
  onOpenAddModal?: (column: number) => void;
  onDeleteWidget?: (widgetId: string) => void;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  isEditMode = false,
  onOpenAddModal,
  onDeleteWidget
}) => {
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

  const renderWidget = (widget: Widget, index: number, columnIndex: number) => {
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

    return (
      <React.Fragment key={widget.id}>
        {isEditMode && index === 0 && (
          <button
            className="add-widget-btn"
            onClick={() => onOpenAddModal?.(columnIndex + 1)}
          >
            + Add widget
          </button>
        )}
        <div className={`widget-wrapper ${isEditMode ? 'edit-mode' : ''}`}>
          {isEditMode && (
            <div className="widget-controls">
              <button className="widget-drag-handle" title="Drag to reorder">
                ⋮⋮
              </button>
              <button
                className="widget-delete-btn"
                onClick={() => onDeleteWidget?.(widget.id)}
                title="Remove widget"
              >
                🗑
              </button>
            </div>
          )}
          <WidgetComponent widget={widget} />
        </div>
        {isEditMode && (
          <button
            className="add-widget-btn"
            onClick={() => onOpenAddModal?.(columnIndex + 1)}
          >
            + Add widget
          </button>
        )}
      </React.Fragment>
    );
  };

  const widgetsByColumn = widgetsAsColumns(widgets.filter(w => w.enabled));

  return (
    <div className="widget-grid" data-testid="widget-columns">
      <div className="widget-column widget-column-left">
        {isEditMode && widgetsByColumn[0]?.length === 0 && (
          <button
            className="add-widget-btn"
            onClick={() => onOpenAddModal?.(1)}
          >
            + Add widget
          </button>
        )}
        {widgetsByColumn[0]?.map((widget, index) => renderWidget(widget, index, 0))}
      </div>
      <div className="widget-column widget-column-right">
        {isEditMode && widgetsByColumn[1]?.length === 0 && (
          <button
            className="add-widget-btn"
            onClick={() => onOpenAddModal?.(2)}
          >
            + Add widget
          </button>
        )}
        {widgetsByColumn[1]?.map((widget, index) => renderWidget(widget, index, 1))}
      </div>
    </div>
  );
};
