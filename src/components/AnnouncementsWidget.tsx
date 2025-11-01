import React from 'react';
import { TemplateWidget } from './TemplateWidget';
import type { WidgetComponentProps } from '../types/widgets';
import './AnnouncementsWidget.css';

interface Announcement {
  id: string;
  author: string;
  authorInitial: string;
  course: string;
  title: string;
  date: string;
  isNew: boolean;
  preview: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    author: 'Maegwynn',
    authorInitial: 'M',
    course: 'Meet Your Instructor-Maegwynn',
    title: 'Welcome! Meet Your Instructor-Maegwynn',
    date: 'Oct 8, 2025',
    isNew: true,
    preview: 'Welcome to New 2PS96 students! I\'m excited to introduce myself as your instructor for this course Meet Your Teacher: Maegwynn! n...'
  },
  {
    id: '2',
    author: 'Slimanoth',
    authorInitial: 'S',
    course: 'Meet Your Instructor-Slimanoth',
    title: 'Welcome! Meet Your Instructor-Slimanoth',
    date: 'Oct 8, 2025',
    isNew: true,
    preview: 'Welcome to New 2PS96 students! I\'m excited to introduce myself as your instructor for this course Meet Your Teacher: Slimanoth...'
  },
  {
    id: '3',
    author: 'Maegwynn',
    authorInitial: 'M',
    course: 'Meet Your Instructor-Maegwynn',
    title: 'Welcome! Meet Your Instructor-Maegwynn',
    date: 'Oct 8, 2025',
    isNew: true,
    preview: 'Welcome to New 2PS96 students! I\'m excited to introduce myself as your instructor for this course Meet Your Teacher: Maegwynn!...'
  }
];

export const AnnouncementsWidget: React.FC<WidgetComponentProps> = ({ widget }) => {
  const headerAction = (
    <select className="read-filter">
      <option>Unread</option>
      <option>All</option>
      <option>Read</option>
    </select>
  );

  return (
    <TemplateWidget title={widget.title} headerAction={headerAction}>
      <div className="announcements-list">
        {mockAnnouncements.map((announcement) => (
          <div key={announcement.id} className="announcement-item">
            <button className="announcement-checkbox" aria-label="Mark as read">
              ○
            </button>
            <div className="announcement-avatar">
              {announcement.authorInitial}
            </div>
            <div className="announcement-content">
              <div className="announcement-header">
                <span className="announcement-course">{announcement.course}</span>
                {announcement.isNew && <span className="new-badge">NEW</span>}
              </div>
              <div className="announcement-title">{announcement.title}</div>
              <div className="announcement-meta">
                Sent by {announcement.author} | {announcement.date}
              </div>
              <div className="announcement-preview">{announcement.preview}</div>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <span>...</span>
        <button className="pagination-btn">10</button>
      </div>
    </TemplateWidget>
  );
};
