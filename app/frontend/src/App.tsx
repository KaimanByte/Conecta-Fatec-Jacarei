import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicLayout from './components/public/PublicLayout';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminNodes from './pages/AdminNodes';
import AdminInquiries from './pages/AdminInquiries';
import AdminLogs from './pages/AdminLogs';

function AppRoutes() {
  const { setSessionToken } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />
      <Route path="/login" element={<Login setToken={setSessionToken} />} />

      <Route element={<PrivateRoute validator="admin" setToken={setSessionToken} />}>
        <Route path="/admin" element={<AdminNodes setToken={setSessionToken} />} />
        <Route path="/admin/nodes" element={<AdminNodes setToken={setSessionToken} />} />
        <Route path="/admin/logs" element={<AdminLogs setToken={setSessionToken} />} />
      </Route>

      <Route element={<PrivateRoute validator="secretary" setToken={setSessionToken} />}>
        <Route path="/admin/inquiries" element={<AdminInquiries setToken={setSessionToken} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" expand richColors closeButton />
        <div className="app-root">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
