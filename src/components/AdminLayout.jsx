import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Upload, RefreshCw, Trash2, CreditCard, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const adminNavItems = [
  { to: '/upload-project', label: 'Upload Project', icon: Upload },
  { to: '/update-project', label: 'Update Project', icon: RefreshCw },
  { to: '/admin/projects', label: 'Delete Project', icon: Trash2 },
  { to: '/admin/payments', label: 'Payment Review', icon: CreditCard },
];

export default function AdminLayout({ children, title, description, breadcrumb }) {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.name || 'A').substring(0, 2).toUpperCase();

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-icon">
              <LayoutDashboard size={18} />
            </div>
            <h2>Admin Panel</h2>
          </div>
          <p className="admin-sidebar-subtitle">CoralLink Management</p>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          <p className="admin-nav-label">Management</p>
          {adminNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              <span className="admin-nav-icon"><Icon size={18} /></span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-card">
            <div className="admin-sidebar-avatar">{initials}</div>
            <div className="admin-sidebar-user-info">
              <span className="admin-sidebar-user-name">{user?.name || 'Admin'}</span>
              <span className="admin-sidebar-user-role">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {(title || breadcrumb) && (
          <div className="admin-content-header">
            {breadcrumb && (
              <div className="admin-content-breadcrumb">
                Admin / <span>{breadcrumb}</span>
              </div>
            )}
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
          </div>
        )}
        {children}
        <div className="admin-footer">
          <p>CoralLink Admin Panel &copy; {new Date().getFullYear()}</p>
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  );
}
