import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserCircle, Upload, RefreshCw, ChevronDown, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    showToast('Signed out successfully', 'info');
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          CORALLINK
        </Link>
        <div className="navbar-links">
          <a href="/#hero" className="nav-link">Home</a>
          <a href="/#about" className="nav-link">About Us</a>
          <a href="/#faq" className="nav-link">FAQ</a>
          <NavLink to="/take-action" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>Take Action</NavLink>
        </div>
        <div className="navbar-right">
          {user ? (
            <div className="navbar-menu-wrap" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false); }} onKeyDown={(e) => { if (e.key === 'Escape') setMenuOpen(false); }}>
              <button className="navbar-profile-btn" aria-label="Account menu" aria-expanded={menuOpen} onClick={toggleMenu}>
                <UserCircle size={28} strokeWidth={1.5} />
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="navbar-dropdown">
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-email">{user.email}</span>
                    <span className="dropdown-user-role">{user.role === 'admin' ? 'Admin' : 'Investor'}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  {user && (
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <UserCircle size={16} /> My Profile
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Link to="/upload-project" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <Upload size={16} /> Upload Project
                      </Link>
                      <Link to="/admin/projects" className="dropdown-item" onClick={() => setMenuOpen(false)}><Trash2 size={16} /> Delete Project</Link>
                      <Link to="/admin/payments" className="dropdown-item" onClick={() => setMenuOpen(false)}>Payment Review</Link>
                      <Link to="/update-project" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <RefreshCw size={16} /> Update Project
                      </Link>
                    </>
                  )}
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/signin" className="navbar-signin-btn">Sign In</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

