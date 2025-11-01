import { useState } from 'react';
import { WidgetGrid } from './components/WidgetGrid';
import { DEFAULT_WIDGETS } from './data/defaultWidgets';
import type { Widget } from './types/widgets';
import './App.css';

function App() {
  const [widgets] = useState<Widget[]>(DEFAULT_WIDGETS);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Dashboard</h1>
          <div className="header-actions">
            <div className="header-tabs">
              <button className="tab-btn active">Dashboard</button>
              <button className="tab-btn">Courses</button>
            </div>
            <div className="header-info">
              <a href="#" className="feedback-link">
                What do you think of the new dashboard?
                <br />
                <span className="feedback-cta">Let us know!</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <WidgetGrid widgets={widgets} />
      </main>
    </div>
  );
}

export default App;
