import type { Widget } from '../types/widgets';

export const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'course-work-1',
    type: 'course-work',
    title: 'Course work',
    position: { col: 1, row: 0, relative: 0 },
    enabled: true
  },
  {
    id: 'course-grades-1',
    type: 'course-grades',
    title: 'Course grades',
    position: { col: 1, row: 1, relative: 1 },
    enabled: true
  },
  {
    id: 'announcements-1',
    type: 'announcements',
    title: 'Announcements',
    position: { col: 2, row: 0, relative: 2 },
    enabled: true
  },
  {
    id: 'people-1',
    type: 'people',
    title: 'People',
    position: { col: 2, row: 1, relative: 3 },
    enabled: true
  }
];
