# Dashboard Customizability Spike - Claude Code Session

## Project Overview
This is a proof-of-concept for a customizable widget dashboard inspired by Canvas LMS's new dashboard interface. The goal is to demonstrate drag-and-drop widget customization using modern React patterns.

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Layout**: CSS Grid with react-grid-layout
- **Deployment**: GitHub Pages

## Architecture

### Component Structure
```
src/
├── components/
│   ├── widgets/
│   │   ├── TemplateWidget.tsx      # Base widget component with consistent styling
│   │   ├── CourseWorkWidget.tsx    # Course work summary widget
│   │   ├── CourseGradesWidget.tsx  # Course grades widget
│   │   ├── AnnouncementsWidget.tsx # Announcements widget
│   │   └── PeopleWidget.tsx        # People/contacts widget
│   ├── WidgetGrid.tsx              # Main grid layout container
│   └── WidgetRegistry.ts           # Widget type registry
├── types/
│   └── widgets.ts                  # TypeScript interfaces
└── App.tsx                         # Main application
```

### Design Patterns

#### 1. Widget Registry Pattern
Widgets are registered centrally and mapped by type, making it easy to add new widgets:
```typescript
const WIDGET_REGISTRY = {
  'course-work': CourseWorkWidget,
  'course-grades': CourseGradesWidget,
  'announcements': AnnouncementsWidget,
  'people': PeopleWidget
}
```

#### 2. Template Widget Pattern
All widgets extend a base `TemplateWidget` component that provides:
- Consistent header styling
- Loading states
- Error handling
- Collapsible functionality
- Common layout structure

#### 3. Grid Positioning
Widgets use a coordinate-based positioning system:
- `col`: Column position (0-2 for 3-column layout)
- `row`: Row position (0-indexed)
- `width`: Widget width in columns (1-3)
- `height`: Widget height in rows

## Key Features

### 1. Stubbed Data
All components use mock data to replicate the Canvas LMS interface without backend dependencies:
- Course grades with status badges (HOEN1, HOEN10, etc.)
- Assignment counters (due, missing, submitted)
- Announcements with read/unread status
- People contacts with role badges

### 2. Drag-and-Drop Customization
Users can:
- Rearrange widgets by dragging
- Persist layout to localStorage
- Reset to default layout

### 3. Responsive Design
- 3-column grid on desktop
- Adapts to smaller screens
- Maintains widget proportions

## Implementation Notes

### Canvas LMS Reference
Based on: `https://github.com/instructure/canvas-lms/tree/master/ui/features/widget_dashboard`

The Canvas implementation uses:
- React components with TypeScript
- WidgetRegistry for component mapping
- WidgetGrid for layout management
- Template components for consistency

### Differences from Canvas
- **Simplified**: No network requests or API integration
- **Mock Data**: All data is stubbed for demonstration
- **Standalone**: No Canvas-specific dependencies
- **Modern DnD**: Using @dnd-kit instead of older libraries

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Future Enhancements
- [ ] Add more widget types
- [ ] Implement widget settings/configuration
- [ ] Add widget resize functionality
- [ ] Create widget marketplace concept
- [ ] Add data persistence backend
- [ ] Implement user preferences API

## Session Notes
- Project initialized: 2025-11-01
- Git repository: git@github.com:drakeaharper/dashboard-cutomizability-spike.git
- Primary goal: POC for team feature planning
- Open source reference for implementation patterns
