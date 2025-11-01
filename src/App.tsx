import { useState } from 'react';
import { WidgetGrid } from './components/WidgetGrid';
import { AddWidgetModal } from './components/AddWidgetModal';
import { DEFAULT_WIDGETS } from './data/defaultWidgets';
import { getWidget } from './components/WidgetRegistry';
import type { Widget } from './types/widgets';
import './App.css';

function App() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState(1);

  const handleAddWidget = (widgetType: string, column: number) => {
    const widgetInfo = getWidget(widgetType);
    if (!widgetInfo) return;

    // Find the max row in the target column
    const columnWidgets = widgets.filter(w => w.position.col === column);
    const maxRow = columnWidgets.length > 0
      ? Math.max(...columnWidgets.map(w => w.position.row))
      : -1;

    const newWidget: Widget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widgetInfo.defaultTitle,
      position: {
        col: column,
        row: maxRow + 1,
        relative: widgets.length
      },
      enabled: true
    };

    setWidgets([...widgets, newWidget]);
  };

  const handleOpenModal = (column: number) => {
    setTargetColumn(column);
    setIsModalOpen(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleReorderWidgets = (reorderedWidgets: Widget[]) => {
    setWidgets(reorderedWidgets);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Dashboard</h1>
          <div className="header-actions">
            <div className="header-tabs">
              <button className="tab-btn active">Dashboard</button>
              <button className="tab-btn">Courses</button>
            </div>
            <div className="header-right">
              <div className="header-info">
                <a href="#" className="feedback-link">
                  What do you think of the new dashboard?
                  <br />
                  <span className="feedback-cta">Let us know!</span>
                </a>
              </div>
              <button
                className="customize-btn"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <span className="customize-icon">⚙</span>
                Customize dashboard
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <WidgetGrid
          widgets={widgets}
          isEditMode={isEditMode}
          onOpenAddModal={handleOpenModal}
          onDeleteWidget={handleDeleteWidget}
          onReorderWidgets={handleReorderWidgets}
        />
      </main>
      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWidget={handleAddWidget}
        targetColumn={targetColumn}
      />
    </div>
  );
}

export default App;
