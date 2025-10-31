import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import StammdatenPage from './pages/StammdatenPage';
import FinanzanlagenPage from './pages/FinanzanlagenPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/stammdaten" replace />} />
          <Route path="/stammdaten" element={<StammdatenPage />} />
          <Route path="/finanzanlagen" element={<FinanzanlagenPage />} />
          <Route path="/einstellungen" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
