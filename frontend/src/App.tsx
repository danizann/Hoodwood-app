import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { TrackingPage } from './pages/TrackingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route element={<ProtectedRoute roles={['admin', 'manager']} />}>
                <Route
                  path="/orders"
                  element={<OrdersPage />}
                />
                <Route path="/suppliers" element={<PlaceholderPage title="Maintain Supplier" description="Manager and admin maintenance area for supplier records." />} />
                <Route path="/suppliers/account/new" element={<PlaceholderPage title="Add Supplier Account" description="Create and register a new supplier account." />} />
                <Route path="/suppliers/new" element={<PlaceholderPage title="Add Supplier Account" description="Create and register a new supplier account." />} />
                <Route path="/sellers" element={<PlaceholderPage title="Sellers" description="Manager and admin management area for seller records." />} />
                <Route path="/products" element={<PlaceholderPage title="Products" description="Manager and admin management area for product inventory." />} />
                <Route path="/invoices" element={<PlaceholderPage title="Invoices" description="Manager and admin management area for invoice workflows." />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
