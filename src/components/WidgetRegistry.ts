import type { WidgetRegistryItem } from '../types/widgets';
import { CourseWorkWidget } from './CourseWorkWidget';
import { CourseGradesWidget } from './CourseGradesWidget';
import { AnnouncementsWidget } from './AnnouncementsWidget';
import { PeopleWidget } from './PeopleWidget';

const WIDGET_REGISTRY: Record<string, WidgetRegistryItem> = {
  'course-work': {
    type: 'course-work',
    component: CourseWorkWidget,
    defaultTitle: 'Course work'
  },
  'course-grades': {
    type: 'course-grades',
    component: CourseGradesWidget,
    defaultTitle: 'Course grades'
  },
  'announcements': {
    type: 'announcements',
    component: AnnouncementsWidget,
    defaultTitle: 'Announcements'
  },
  'people': {
    type: 'people',
    component: PeopleWidget,
    defaultTitle: 'People'
  }
};

export const getWidget = (type: string): WidgetRegistryItem | undefined => {
  return WIDGET_REGISTRY[type];
};

export default WIDGET_REGISTRY;
