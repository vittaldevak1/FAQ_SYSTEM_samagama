import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    onClose?.();
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const roleLabel = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    intern: 'Member',
  }[user?.role] || 'Member';

  const roleBadgeStyle = {
    super_admin: { background: 'rgba(234,179,8,0.15)', color: '#ca8a04' },
    admin: { background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' },
    intern: { background: 'var(--accent-light)', color: 'var(--accent)' },
  }[user?.role] || {};

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>Crowd Sourced FAQ Generation Web App</h2>
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          style={{
            display: 'none', background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--text-secondary)', padding: 4,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="nav-links">
        <Link to="/user" className={`nav-item ${isActive('/user')}`}>FAQ Hub</Link>
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>Dashboard</Link>
        {!isAdmin && (
          <>
            <Link to="/ask-question" className={`nav-item ${isActive('/ask-question')}`}>Ask Question</Link>
            <Link to="/my-questions" className={`nav-item ${isActive('/my-questions')}`}>My Questions</Link>
          </>
        )}
        <Link to="/answer-center" className={`nav-item ${isActive('/answer-center')}`}>Discussion Room</Link>
        <Link to="/leaderboard" className={`nav-item ${isActive('/leaderboard')}`}>Leaderboard</Link>
        {isAdmin && (
          <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>Admin Area</Link>
        )}
      </div>
      <div className="sidebar-footer">
        <div className="user-info" style={{ overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            title={user?.name || user?.email}>
            {user?.name || user?.email}
          </div>
          <div style={{ fontSize: '0.8rem', marginBottom: 4 }}>
            <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, ...roleBadgeStyle }}>{roleLabel}</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'var(--accent-light)', color: 'var(--accent)',
            padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 6
          }}>
            ✨ {user?.points || 0} pts
          </div>
        </div>
        <button onClick={() => setDark(d => !d)} style={{
          width: '100%', padding: '8px', marginBottom: 8,
          border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
          background: 'transparent', color: 'var(--text-secondary)',
          cursor: 'pointer', fontSize: 13, fontFamily: 'inherit'
        }}>
          {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button onClick={logout} className="btn-primary" style={{ width: '100%', padding: '0.5rem' }}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;