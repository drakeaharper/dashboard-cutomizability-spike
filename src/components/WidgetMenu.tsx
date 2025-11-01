import React from 'react';
import './WidgetMenu.css';

interface WidgetMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  widgetTitle: string;
}

export const WidgetMenu: React.FC<WidgetMenuProps> = ({
  isOpen,
  onClose,
  onDelete,
  widgetTitle
}) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleAction = (action: string) => {
    console.log('Widget action:', action);
    onClose();
  };

  return (
    <>
      <div className="widget-menu-overlay" onClick={onClose} />
      <div className="widget-menu">
        <div className="widget-menu-header">
          <h3 className="widget-menu-title">{widgetTitle}</h3>
        </div>
        <div className="widget-menu-items">
          <button className="widget-menu-item" onClick={() => handleAction('move-right')}>
            <span className="menu-item-icon">→</span>
            <span className="menu-item-label">Move right</span>
          </button>
          <button className="widget-menu-item" onClick={() => handleAction('move-left')}>
            <span className="menu-item-icon">←</span>
            <span className="menu-item-label">Move left</span>
          </button>
          <button className="widget-menu-item" onClick={() => handleAction('move-to-top')}>
            <span className="menu-item-icon">⇈</span>
            <span className="menu-item-label">Move to top</span>
          </button>
          <button className="widget-menu-item" onClick={() => handleAction('move-up')}>
            <span className="menu-item-icon">↑</span>
            <span className="menu-item-label">Move up</span>
          </button>
          <button className="widget-menu-item" onClick={() => handleAction('move-down')}>
            <span className="menu-item-icon">↓</span>
            <span className="menu-item-label">Move down</span>
          </button>
          <button className="widget-menu-item" onClick={() => handleAction('move-to-bottom')}>
            <span className="menu-item-icon">⇊</span>
            <span className="menu-item-label">Move to bottom</span>
          </button>
          <button className="widget-menu-item widget-menu-item-danger" onClick={handleDelete}>
            <span className="menu-item-icon">🗑</span>
            <span className="menu-item-label">Remove tile</span>
          </button>
        </div>
      </div>
    </>
  );
};
