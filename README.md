# Dashboard Customizability Spike

> **🚀 [Live Demo](https://drakeaharper.github.io/dashboard-cutomizability-spike/)** | [Repository](https://github.com/drakeaharper/dashboard-cutomizability-spike)

A proof-of-concept for a customizable widget dashboard inspired by [Canvas LMS's widget dashboard](https://github.com/instructure/canvas-lms/tree/master/ui/features/widget_dashboard). This spike demonstrates modern React patterns for building a flexible, widget-based interface.

![Dashboard Preview](docs/dashboard-preview.png)

## Features

- **Widget-based Architecture**: Modular components that can be easily added or removed
- **2-Column Responsive Layout**: 66/33 split on desktop, stacked on mobile
- **JSON-driven Configuration**: Widgets are rendered from a configuration object
- **Component Registry Pattern**: Centralized widget registration for easy extensibility
- **Stubbed Data**: All components use mock data for demonstration purposes

## Widgets Included

1. **Course Work** - Shows assignment status (due, missing, submitted)
2. **Course Grades** - Displays grades for all courses with pagination
3. **Announcements** - Lists course announcements with read/unread status
4. **People** - Shows people/contacts with role badges

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS** for styling (no UI framework dependencies)
- **@dnd-kit** libraries (installed for future drag-and-drop functionality)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone git@github.com:drakeaharper/dashboard-cutomizability-spike.git
cd dashboard-cutomizability-spike

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

## Project Structure

```
src/
├── components/
│   ├── TemplateWidget.tsx       # Base widget component
│   ├── CourseWorkWidget.tsx     # Course work summary
│   ├── CourseGradesWidget.tsx   # Grades display
│   ├── AnnouncementsWidget.tsx  # Announcements list
│   ├── PeopleWidget.tsx         # People/contacts
│   ├── WidgetGrid.tsx           # Main grid layout
│   └── WidgetRegistry.ts        # Widget type registry
├── data/
│   └── defaultWidgets.ts        # Default widget configuration
├── types/
│   └── widgets.ts               # TypeScript interfaces
└── App.tsx                      # Main application
```

## Architecture

### Widget Registry Pattern

Widgets are registered centrally and can be easily extended:

```typescript
const WIDGET_REGISTRY = {
  'course-work': CourseWorkWidget,
  'course-grades': CourseGradesWidget,
  'announcements': AnnouncementsWidget,
  'people': PeopleWidget
}
```

### JSON Configuration

Widgets are positioned using a simple configuration object:

```typescript
{
  id: 'course-work-1',
  type: 'course-work',
  title: 'Course work',
  position: { col: 1, row: 0, relative: 0 },
  enabled: true
}
```

### Layout System

- **Column-based**: Widgets are organized into 2 columns (66% / 33%)
- **Row positioning**: Within each column, widgets are sorted by row number
- **Responsive**: Automatically stacks on smaller screens

## Future Enhancements

- [ ] Implement drag-and-drop widget reordering
- [ ] Add widget customization/settings panel
- [ ] Widget enable/disable toggles
- [ ] localStorage persistence for layout
- [ ] Additional widget types
- [ ] Widget resize functionality

## Canvas LMS Reference

This project is based on the Canvas LMS widget dashboard implementation:
https://github.com/instructure/canvas-lms/tree/master/ui/features/widget_dashboard

### Key Differences

- **Simplified**: No backend API or network requests
- **Stubbed Data**: All data is mocked for demonstration
- **Standalone**: No Canvas-specific dependencies
- **Educational**: Designed as a reference for team feature planning

## Contributing

This is an open-source spike project. Feel free to fork, experiment, and adapt for your needs!

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed implementation notes and session documentation.

## License

MIT

---

Built as a POC for exploring customizable dashboard patterns.
