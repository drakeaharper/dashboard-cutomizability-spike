import React, { useState } from 'react';
import './AddWidgetModal.css';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widgetType: string, column: number) => void;
  targetColumn: number;
}

interface WidgetOption {
  type: string;
  title: string;
  description: string;
}

const AVAILABLE_WIDGETS: WidgetOption[] = [
  {
    type: 'course-work',
    title: 'My course work',
    description: 'View and manage your assignments across all courses.'
  },
  {
    type: 'course-grades',
    title: 'Course grades',
    description: 'Track your performance in each course with detailed graphs.'
  },
  {
    type: 'announcements',
    title: 'Announcements',
    description: 'See all the assignments that are due across all of your courses.'
  },
  {
    type: 'people',
    title: 'People',
    description: 'Quickly access all of your 3rd party apps across all of your courses.'
  },
  {
    type: 'progress-overview',
    title: 'Progress overview',
    description: 'Track your performance in each course with detailed graphs.'
  }
];

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
  targetColumn
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(AVAILABLE_WIDGETS.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWidgets = AVAILABLE_WIDGETS.slice(startIndex, endIndex);

  if (!isOpen) return null;

  const handleAddWidget = (widgetType: string) => {
    onAddWidget(widgetType, targetColumn);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add widget</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button className="modal-tab active">Canvas</button>
          <button className="modal-tab">Mastery</button>
          <button className="modal-tab">IgniteAI</button>
          <button className="modal-tab">ASU</button>
        </div>

        <div className="widget-grid">
          {currentWidgets.map((widget) => (
            <div key={widget.type} className="widget-card-option">
              <div className="widget-icon" />
              <div className="widget-card-content">
                <h3 className="widget-card-title">{widget.title}</h3>
                <p className="widget-card-description">{widget.description}</p>
              </div>
              <button
                className="widget-add-btn"
                onClick={() => handleAddWidget(widget.type)}
              >
                + Add
              </button>
            </div>
          ))}
        </div>

        <div className="modal-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
