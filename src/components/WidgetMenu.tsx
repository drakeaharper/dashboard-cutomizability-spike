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

  return (
    <>
      <div className="widget-menu-overlay" onClick={onClose} />
      <div className="widget-menu">
        <div className="widget-menu-header">
          <h3 className="widget-menu-title">{widgetTitle}</h3>
        </div>
        <div className="widget-menu-items">
          <button className="widget-menu-item" onClick={handleDelete}>
            <span className="menu-item-icon">🗑</span>
            <span className="menu-item-label">Remove from dashboard</span>
          </button>
        </div>
      </div>
    </>
  );
};
