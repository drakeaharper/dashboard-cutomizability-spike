import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Widget } from '../types/widgets';
import { getWidget } from './WidgetRegistry';
import { WidgetMenu } from './WidgetMenu';
import './WidgetGrid.css';

interface WidgetGridProps {
  widgets: Widget[];
  isEditMode?: boolean;
  onOpenAddModal?: (column: number, insertIndex?: number) => void;
  onDeleteWidget?: (widgetId: string) => void;
  onReorderWidgets?: (widgets: Widget[]) => void;
}

interface SortableWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  onDelete: () => void;
  onMenuToggle: (widgetId: string) => void;
  onMoveAction: (widgetId: string, action: string) => void;
  isMenuOpen: boolean;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  isEditMode,
  onDelete,
  onMenuToggle,
  onMoveAction,
  isMenuOpen
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const widgetRenderer = getWidget(widget.type);
  if (!widgetRenderer) {
    return (
      <div className="widget-error">
        Unknown widget type: {widget.type}
      </div>
    );
  }

  const WidgetComponent = widgetRenderer.component;

  const handleMenuClick = (e: React.MouseEvent) => {
    // Only open menu if we're not actively dragging
    if (!isDragging) {
      e.preventDefault();
      e.stopPropagation();
      onMenuToggle(widget.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`widget-wrapper ${isEditMode ? 'edit-mode' : ''}`}
    >
      {isEditMode && (
        <div className="widget-controls">
          <div className="widget-menu-container">
            <button
              className="widget-drag-handle"
              title="Drag to reorder or click for options"
              onClick={handleMenuClick}
              {...attributes}
              {...listeners}
            >
              ⋮⋮
            </button>
            <WidgetMenu
              isOpen={isMenuOpen}
              onClose={() => onMenuToggle('')}
              onDelete={onDelete}
              onMoveAction={(action) => onMoveAction(widget.id, action)}
              widgetTitle={widget.title}
            />
          </div>
          <button
            className="widget-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Remove widget"
          >
            🗑
          </button>
        </div>
      )}
      <WidgetComponent widget={widget} />
    </div>
  );
};

interface DroppableAddButtonProps {
  column: number;
  insertIndex?: number;
  onOpenModal: (column: number, insertIndex?: number) => void;
  dropId: string;
}

const DroppableAddButton: React.FC<DroppableAddButtonProps> = ({
  column,
  insertIndex,
  onOpenModal,
  dropId
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    data: {
      type: 'add-button',
      column,
      insertIndex
    }
  });

  return (
    <button
      ref={setNodeRef}
      className={`add-widget-btn ${isOver ? 'drag-over' : ''}`}
      onClick={() => onOpenModal(column, insertIndex)}
    >
      + Add widget
    </button>
  );
};

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  isEditMode = false,
  onOpenAddModal,
  onDeleteWidget,
  onReorderWidgets
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group widgets by column
  const widgetsAsColumns = (widgets: Widget[]): Widget[][] => {
    const inColumns = widgets.reduce(
      (acc, widget) => {
        const column = widget.position.col || 1;
        acc[column - 1].push(widget);
        return acc;
      },
      [[] as Widget[], [] as Widget[]] as Widget[][]
    );

    inColumns.forEach((column, idx) => {
      inColumns[idx] = column.sort((a, b) => a.position.row - b.position.row);
    });

    return inColumns;
  };

  const widgetsByColumn = widgetsAsColumns(widgets.filter(w => w.enabled));

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id);
    setActiveId(event.active.id as string);
    setOpenMenuId('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag ended:', { active: active.id, over: over?.id, overData: over?.data.current });
    setActiveId(null);

    if (!over) {
      console.log('No drop target');
      return;
    }

    const activeWidget = widgets.find(w => w.id === active.id);
    if (!activeWidget) {
      console.log('Active widget not found');
      return;
    }

    // Check if dropped on an add button
    if (over.data.current?.type === 'add-button') {
      const targetColumn = over.data.current.column;
      const targetRow = over.data.current.insertIndex ?? 0;

      console.log('Dropped on add button:', { targetColumn, targetRow });

      // Remove from old position and insert at new position
      const updatedWidgets = widgets.map(widget => {
        if (widget.id === activeWidget.id) {
          // Update the dragged widget's position
          return {
            ...widget,
            position: {
              ...widget.position,
              col: targetColumn,
              row: targetRow
            }
          };
        } else if (widget.position.col === targetColumn && widget.position.row >= targetRow) {
          // Shift down widgets in target column that are at or after insert position
          return {
            ...widget,
            position: {
              ...widget.position,
              row: widget.position.row + 1
            }
          };
        } else if (widget.position.col === activeWidget.position.col && widget.position.row > activeWidget.position.row) {
          // Shift up widgets in source column that were after the moved widget
          return {
            ...widget,
            position: {
              ...widget.position,
              row: widget.position.row - 1
            }
          };
        }
        return widget;
      });

      console.log('Updated widgets after add button drop:', updatedWidgets);
      onReorderWidgets?.(updatedWidgets);
      return;
    }

    // Dropped on another widget - insert before it
    if (active.id === over.id) {
      console.log('Dropped on self');
      return;
    }

    const overWidget = widgets.find(w => w.id === over.id);
    if (!overWidget) {
      console.log('Over widget not found');
      return;
    }

    console.log('Dropped on widget, inserting before it:', { overWidget: overWidget.id, targetCol: overWidget.position.col, targetRow: overWidget.position.row });

    // Insert before the target widget
    const targetColumn = overWidget.position.col;
    const targetRow = overWidget.position.row;

    const updatedWidgets = widgets.map(widget => {
      if (widget.id === activeWidget.id) {
        // Update the dragged widget's position
        return {
          ...widget,
          position: {
            ...widget.position,
            col: targetColumn,
            row: targetRow
          }
        };
      } else if (widget.position.col === targetColumn && widget.position.row >= targetRow && widget.id !== activeWidget.id) {
        // Shift down widgets in target column that are at or after insert position
        return {
          ...widget,
          position: {
            ...widget.position,
            row: widget.position.row + 1
          }
        };
      } else if (widget.position.col === activeWidget.position.col && widget.position.row > activeWidget.position.row && targetColumn !== activeWidget.position.col) {
        // Shift up widgets in source column that were after the moved widget (only if changing columns)
        return {
          ...widget,
          position: {
            ...widget.position,
            row: widget.position.row - 1
          }
        };
      }
      return widget;
    });

    console.log('Updated widgets after insert:', updatedWidgets);
    onReorderWidgets?.(updatedWidgets);
  };

  const handleMenuToggle = (widgetId: string) => {
    setOpenMenuId(openMenuId === widgetId ? '' : widgetId);
  };

  const handleMoveAction = (widgetId: string, action: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    let updatedWidgets = [...widgets];

    switch (action) {
      case 'move-left':
        // Move to left column (column 1)
        updatedWidgets = widgets.map(w =>
          w.id === widgetId ? { ...w, position: { ...w.position, col: 1 } } : w
        );
        break;

      case 'move-right':
        // Move to right column (column 2)
        updatedWidgets = widgets.map(w =>
          w.id === widgetId ? { ...w, position: { ...w.position, col: 2 } } : w
        );
        break;

      case 'move-up':
        // Move one position up in the same column
        if (widget.position.row > 0) {
          updatedWidgets = widgets.map(w => {
            if (w.id === widgetId) {
              return { ...w, position: { ...w.position, row: widget.position.row - 1 } };
            } else if (w.position.col === widget.position.col && w.position.row === widget.position.row - 1) {
              return { ...w, position: { ...w.position, row: w.position.row + 1 } };
            }
            return w;
          });
        }
        break;

      case 'move-down':
        // Move one position down in the same column
        const columnWidgets = widgets.filter(w => w.position.col === widget.position.col);
        const maxRow = Math.max(...columnWidgets.map(w => w.position.row));
        if (widget.position.row < maxRow) {
          updatedWidgets = widgets.map(w => {
            if (w.id === widgetId) {
              return { ...w, position: { ...w.position, row: widget.position.row + 1 } };
            } else if (w.position.col === widget.position.col && w.position.row === widget.position.row + 1) {
              return { ...w, position: { ...w.position, row: w.position.row - 1 } };
            }
            return w;
          });
        }
        break;

      case 'move-to-top':
        // Move to first position in the same column
        updatedWidgets = widgets.map(w => {
          if (w.id === widgetId) {
            return { ...w, position: { ...w.position, row: 0 } };
          } else if (w.position.col === widget.position.col && w.position.row < widget.position.row) {
            return { ...w, position: { ...w.position, row: w.position.row + 1 } };
          }
          return w;
        });
        break;

      case 'move-to-bottom':
        // Move to last position in the same column
        const colWidgets = widgets.filter(w => w.position.col === widget.position.col);
        const newMaxRow = Math.max(...colWidgets.map(w => w.position.row));
        updatedWidgets = widgets.map(w => {
          if (w.id === widgetId) {
            return { ...w, position: { ...w.position, row: newMaxRow } };
          } else if (w.position.col === widget.position.col && w.position.row > widget.position.row) {
            return { ...w, position: { ...w.position, row: w.position.row - 1 } };
          }
          return w;
        });
        break;
    }

    onReorderWidgets?.(updatedWidgets);
  };

  const renderColumn = (columnWidgets: Widget[], columnIndex: number) => {
    const columnNumber = columnIndex + 1;

    return (
      <div className="widget-column" key={columnIndex}>
        {isEditMode && columnWidgets.length === 0 && (
          <DroppableAddButton
            column={columnNumber}
            onOpenModal={onOpenAddModal!}
            dropId={`drop-col${columnNumber}-empty`}
          />
        )}

        <SortableContext
          items={columnWidgets.map(w => w.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnWidgets.map((widget, index) => (
            <React.Fragment key={widget.id}>
              {isEditMode && index === 0 && (
                <DroppableAddButton
                  column={columnNumber}
                  insertIndex={0}
                  onOpenModal={onOpenAddModal!}
                  dropId={`drop-col${columnNumber}-idx0`}
                />
              )}
              <SortableWidget
                widget={widget}
                isEditMode={isEditMode}
                onDelete={() => onDeleteWidget?.(widget.id)}
                onMenuToggle={handleMenuToggle}
                onMoveAction={handleMoveAction}
                isMenuOpen={openMenuId === widget.id}
              />
              {isEditMode && (
                <DroppableAddButton
                  column={columnNumber}
                  insertIndex={index + 1}
                  onOpenModal={onOpenAddModal!}
                  dropId={`drop-col${columnNumber}-idx${index + 1}`}
                />
              )}
            </React.Fragment>
          ))}
        </SortableContext>
      </div>
    );
  };

  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null;
  const activeWidgetRenderer = activeWidget ? getWidget(activeWidget.type) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="widget-grid" data-testid="widget-columns">
        <div className="widget-column-left">
          {renderColumn(widgetsByColumn[0] || [], 0)}
        </div>
        <div className="widget-column-right">
          {renderColumn(widgetsByColumn[1] || [], 1)}
        </div>
      </div>

      <DragOverlay>
        {activeId && activeWidget && activeWidgetRenderer ? (
          <div className="widget-wrapper dragging">
            {React.createElement(activeWidgetRenderer.component, { widget: activeWidget })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
