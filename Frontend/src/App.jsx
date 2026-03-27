import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Overview from './components/overview/Overview';
import InventoryPage from './components/inventory/InventoryPage';
import { ReturnsPage, SalesFulfillmentPage } from './pages/PlaceholderPages';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/sales" element={<SalesFulfillmentPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
