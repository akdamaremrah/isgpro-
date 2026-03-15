import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CompanyList from './pages/Companies/CompanyList';
import CompanyFormWizard from './pages/Companies/CompanyFormWizard';
import CompanyDetailLayout from './pages/Companies/CompanyDetailLayout';
import PersonnelDetail from './pages/Personnel/PersonnelDetail';
import UsersConfig from './pages/Settings/UsersConfig';

import Dashboard from './pages/Dashboard/Dashboard';
import Legislation from './pages/Legislation/Legislation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Default Route */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="companies">
            <Route index element={<CompanyList />} />
            <Route path="new" element={<CompanyFormWizard />} />
            <Route path=":id" element={<CompanyDetailLayout />} />
            <Route path=":id/edit" element={<CompanyFormWizard />} />
            <Route path=":companyId/personnel/:personnelId" element={<PersonnelDetail />} />
          </Route>

          <Route path="legislation" element={<Legislation />} />
          <Route path="settings" element={<UsersConfig />} />

          <Route path="*" element={<div>Sayfa Bulunamadı!</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
