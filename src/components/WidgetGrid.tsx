import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
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
  isMenuOpen: boolean;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  isEditMode,
  onDelete,
  onMenuToggle,
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
    e.preventDefault();
    e.stopPropagation();
    onMenuToggle(widget.id);
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
              onPointerDown={(e) => {
                // Let the drag handler take over if dragging
                const dragHandler = listeners?.onPointerDown;
                if (dragHandler) {
                  dragHandler(e as any);
                }
              }}
              {...attributes}
            >
              ⋮⋮
            </button>
            <WidgetMenu
              isOpen={isMenuOpen}
              onClose={() => onMenuToggle('')}
              onDelete={onDelete}
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
  isOver?: boolean;
}

const DroppableAddButton: React.FC<DroppableAddButtonProps> = ({
  column,
  insertIndex,
  onOpenModal,
  isOver = false
}) => {
  return (
    <button
      className={`add-widget-btn ${isOver ? 'drag-over' : ''}`}
      onClick={() => onOpenModal(column, insertIndex)}
      data-droppable="true"
      data-column={column}
      data-insert-index={insertIndex}
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
    console.log('Drag ended:', { active: active.id, over: over?.id });
    setActiveId(null);

    if (!over || active.id === over.id) {
      console.log('No valid drop target');
      return;
    }

    const activeWidget = widgets.find(w => w.id === active.id);
    if (!activeWidget) return;

    // Find which column the widget was dropped in
    const activeColumn = activeWidget.position.col;
    const columnWidgets = widgets.filter(w => w.position.col === activeColumn && w.enabled);

    const oldIndex = columnWidgets.findIndex(w => w.id === active.id);
    const newIndex = columnWidgets.findIndex(w => w.id === over.id);

    console.log('Indexes:', { oldIndex, newIndex, columnWidgets: columnWidgets.length });

    if (oldIndex === -1 || newIndex === -1) {
      console.log('Invalid indexes');
      return;
    }

    const reorderedColumnWidgets = arrayMove(columnWidgets, oldIndex, newIndex);
    console.log('Reordered:', reorderedColumnWidgets.map(w => w.id));

    // Update row positions
    const updatedWidgets = widgets.map(widget => {
      if (widget.position.col === activeColumn && widget.enabled) {
        const newRowIndex = reorderedColumnWidgets.findIndex(w => w.id === widget.id);
        if (newRowIndex !== -1) {
          return {
            ...widget,
            position: {
              ...widget.position,
              row: newRowIndex
            }
          };
        }
      }
      return widget;
    });

    console.log('Updated widgets:', updatedWidgets);
    onReorderWidgets?.(updatedWidgets);
  };

  const handleMenuToggle = (widgetId: string) => {
    setOpenMenuId(openMenuId === widgetId ? '' : widgetId);
  };

  const renderColumn = (columnWidgets: Widget[], columnIndex: number) => {
    const columnNumber = columnIndex + 1;

    return (
      <div className="widget-column" key={columnIndex}>
        {isEditMode && columnWidgets.length === 0 && (
          <DroppableAddButton
            column={columnNumber}
            onOpenModal={onOpenAddModal!}
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
                />
              )}
              <SortableWidget
                widget={widget}
                isEditMode={isEditMode}
                onDelete={() => onDeleteWidget?.(widget.id)}
                onMenuToggle={handleMenuToggle}
                isMenuOpen={openMenuId === widget.id}
              />
              {isEditMode && (
                <DroppableAddButton
                  column={columnNumber}
                  insertIndex={index + 1}
                  onOpenModal={onOpenAddModal!}
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
