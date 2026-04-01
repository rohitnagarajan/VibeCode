import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { TemplateEditor } from './components/editor/TemplateEditor';
import { StudioControl } from './components/studio/StudioControl';
import { OutputView } from './components/studio/OutputView';
import { BrandSettings } from './components/settings/BrandSettings';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* Clean output window - no chrome */}
          <Route path="/output" element={<OutputView />} />
          {/* Main app with sidebar */}
          <Route path="*" element={
            <AppShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/editor/:id" element={<TemplateEditor />} />
                <Route path="/studio" element={<StudioControl />} />
                <Route path="/settings" element={<BrandSettings />} />
              </Routes>
            </AppShell>
          } />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
