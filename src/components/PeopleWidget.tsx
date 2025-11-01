import React from 'react';
import { TemplateWidget } from './TemplateWidget';
import type { WidgetComponentProps } from '../types/widgets';
import './PeopleWidget.css';

interface Person {
  id: string;
  name: string;
  initial: string;
  role: string;
  course: string;
}

const mockPeople: Person[] = [
  { id: '1', name: 'Panachrevra', initial: 'P', role: 'HOEN1', course: 'Teacher' },
  { id: '2', name: 'Lobruff', initial: 'L', role: 'HOEN11', course: 'Teacher' },
  { id: '3', name: 'Lemthre', initial: 'L', role: 'HOEN12', course: 'Teacher' },
  { id: '4', name: 'Lodicallo', initial: 'L', role: 'HOEN13', course: 'Teacher' },
  { id: '5', name: 'Sroelict', initial: 'S', role: 'HOEN14', course: 'Teacher' },
];

const getRoleColor = (role: string): string => {
  const colors = ['green', 'blue', 'red', 'purple', 'orange'];
  const hash = role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const PeopleWidget: React.FC<WidgetComponentProps> = ({ widget }) => {
  return (
    <TemplateWidget title={widget.title}>
      <div className="people-list">
        {mockPeople.map((person) => (
          <div key={person.id} className="person-item">
            <div className="person-avatar">
              {person.initial}
            </div>
            <div className="person-info">
              <div className="person-name">{person.name}</div>
              <span className={`person-role role-${getRoleColor(person.role)}`}>
                {person.role}
              </span>
              <div className="person-course">{person.course}</div>
            </div>
            <button className="message-btn" aria-label="Send message">
              ✉
            </button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <span>...</span>
        <button className="pagination-btn">5</button>
      </div>
    </TemplateWidget>
  );
};
