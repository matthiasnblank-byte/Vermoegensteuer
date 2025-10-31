import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import DashboardPage from './pages/DashboardPage';
import StammdatenPage from './pages/StammdatenPage';
import FinanzanlagenPage from './pages/FinanzanlagenPage';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stammdaten" element={<StammdatenPage />} />
          <Route path="/finanzanlagen" element={<FinanzanlagenPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
