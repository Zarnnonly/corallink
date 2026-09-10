import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TakeAction from './pages/TakeAction';
import Welcome from './pages/Welcome';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import InvestPage from './pages/InvestPage';
import ProjectDetail from './pages/ProjectDetail';
import FormInvestment from './pages/FormInvestment';
import ConfirmInvestment from './pages/ConfirmInvestment';
import UserProfile from './pages/UserProfile';
import UploadProject from './pages/UploadProject';
import UpdateProject from './pages/UpdateProject';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  // Hide Navbar on specific pages that don't need it or have their own styling
  const hideNavbar = ['/welcome', '/signup', '/signin'].includes(location.pathname)
    || location.pathname.startsWith('/invest-form')
    || location.pathname.startsWith('/confirm-invest');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/take-action" element={<TakeAction />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/invest/:projectId" element={<InvestPage />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />

        {/* User Routes */}
        <Route path="/invest-form/:projectId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <FormInvestment />
          </ProtectedRoute>
        } />
        <Route path="/confirm-invest/:projectId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <ConfirmInvestment />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserProfile />
          </ProtectedRoute>
        } />

        {/* Public Project Detail (accessible to all) */}
        <Route path="/project/:projectId" element={<ProjectDetail />} />

        {/* Admin Routes */}
        <Route path="/upload-project" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UploadProject />
          </ProtectedRoute>
        } />
        <Route path="/update-project" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UpdateProject />
          </ProtectedRoute>
        } />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
