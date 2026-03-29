import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import CompanyList from './pages/Companies/CompanyList';
import CompanyFormWizard from './pages/Companies/CompanyFormWizard';
import CompanyDetailLayout from './pages/Companies/CompanyDetailLayout';
import PersonnelDetail from './pages/Personnel/PersonnelDetail';
import UsersConfig from './pages/Settings/UsersConfig';
import Dashboard from './pages/Dashboard/Dashboard';
import Reports from './pages/Reports/Reports';
import Documents from './pages/Documents/Documents';
import Legislation from './pages/Legislation/Legislation';
import LoginPage from './pages/Login/LoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:'1rem', color:'#64748b' }}>Yükleniyor...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="companies">
          <Route index element={<CompanyList />} />
          <Route path="new" element={<CompanyFormWizard />} />
          <Route path=":id" element={<CompanyDetailLayout />} />
          <Route path=":id/edit" element={<CompanyFormWizard />} />
          <Route path=":companyId/personnel/:personnelId" element={<PersonnelDetail />} />
        </Route>
        <Route path="reports" element={<Reports />} />
        <Route path="documents" element={<Documents />} />
        <Route path="legislation" element={<Legislation />} />
        <Route path="settings" element={<UsersConfig />} />
        <Route path="*" element={<div>Sayfa Bulunamadı!</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
