import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WineListPage from './pages/WineListPage';
import WineDetailPage from './pages/WineDetailPage';
import AddWinePage from './pages/AddWinePage';
import EditWinePage from './pages/EditWinePage';
import SessionsPage from './pages/SessionsPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="wines" element={
          <ProtectedRoute>
            <WineListPage />
          </ProtectedRoute>
        } />
        <Route path="wines/:id" element={
          <ProtectedRoute>
            <WineDetailPage />
          </ProtectedRoute>
        } />
        <Route path="wines/add" element={
          <ProtectedRoute>
            <AddWinePage />
          </ProtectedRoute>
        } />
        <Route path="wines/:id/edit" element={
          <ProtectedRoute>
            <EditWinePage />
          </ProtectedRoute>
        } />
        <Route path="sessions" element={
          <ProtectedRoute>
            <SessionsPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;