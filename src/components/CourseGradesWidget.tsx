import React from 'react';
import { TemplateWidget } from './TemplateWidget';
import type { WidgetComponentProps } from '../types/widgets';
import './CourseGradesWidget.css';

interface Course {
  id: string;
  name: string;
  code: string;
  gradeUpdated: string;
  hideGrade: boolean;
  currentGrade?: string;
}

const mockCourses: Course[] = [
  { id: '1', name: 'Hoen 1', code: 'HOEN1', gradeUpdated: '23 days ago', hideGrade: false, currentGrade: 'N/A' },
  { id: '2', name: 'Hoen 10', code: 'HOEN10', gradeUpdated: '23 days ago', hideGrade: false, currentGrade: 'N/A' },
  { id: '3', name: 'Hoen 11', code: 'HOEN11', gradeUpdated: '23 days ago', hideGrade: false, currentGrade: 'N/A' },
  { id: '4', name: 'Hoen 12', code: 'HOEN12', gradeUpdated: '23 days ago', hideGrade: false, currentGrade: 'N/A' },
  { id: '5', name: 'Hoen 13', code: 'HOEN13', gradeUpdated: '23 days ago', hideGrade: false, currentGrade: 'N/A' },
  { id: '6', name: 'Hoen 14', code: 'HOEN14', gradeUpdated: '23 days ago', hideGrade: false, currentGrade: 'N/A' },
];

const getCodeColor = (code: string): string => {
  const colors = ['green', 'blue', 'red', 'purple', 'orange'];
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const CourseGradesWidget: React.FC<WidgetComponentProps> = ({ widget }) => {
  const headerAction = (
    <label className="show-grades-toggle">
      <input type="checkbox" defaultChecked />
      <span>Show all grades</span>
    </label>
  );

  return (
    <TemplateWidget title={widget.title} headerAction={headerAction}>
      <div className="course-grades-list">
        {mockCourses.map((course) => (
          <div key={course.id} className="course-grade-item">
            <div className="course-info">
              <span className={`course-badge badge-${getCodeColor(course.code)}`}>
                {course.code}
              </span>
              <div className="course-details">
                <div className="course-name">{course.name}</div>
                <div className="grade-updated">Grade updated {course.gradeUpdated}</div>
                <a href="#" className="view-gradebook">View gradebook</a>
              </div>
            </div>
            <div className="grade-display">
              <div className="grade-label">Hide grade</div>
              <div className="current-grade">{course.currentGrade}</div>
            </div>
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
