import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const TakeAction = lazy(() => import('./pages/TakeAction'));
const Welcome = lazy(() => import('./pages/Welcome'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const InvestPage = lazy(() => import('./pages/InvestPage'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const FormInvestment = lazy(() => import('./pages/FormInvestment'));
const ConfirmInvestment = lazy(() => import('./pages/ConfirmInvestment'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const UploadProject = lazy(() => import('./pages/UploadProject'));
const AdminPayments = lazy(() => import('./pages/AdminPayments'));
const UpdateProject = lazy(() => import('./pages/UpdateProject'));
const DeleteProject = lazy(() => import('./pages/DeleteProject'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppContent() {
  const location = useLocation();
  // Hide Navbar on specific pages that don't need it or have their own styling
  const hideNavbar = ['/welcome', '/signup', '/signin'].includes(location.pathname)
    || location.pathname.startsWith('/invest-form')
    || location.pathname.startsWith('/confirm-invest');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ErrorBoundary>
        <PageTransition>
          <Suspense fallback={<p role="status" className="route-fallback">Loading…</p>}>
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
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserProfile />
                </ProtectedRoute>
              } />


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

              <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayments /></ProtectedRoute>} />

              <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['admin']}><DeleteProject /></ProtectedRoute>} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </ErrorBoundary>
      <Analytics />
      <SpeedInsights />
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
