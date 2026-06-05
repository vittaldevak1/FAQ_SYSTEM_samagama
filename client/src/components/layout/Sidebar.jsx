import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => { onClose?.(); }, [location.pathname]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

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

  const navItems = [
    { path: '/user', label: 'FAQ Hub' },
    { path: '/dashboard', label: 'Dashboard' },
    ...(!isAdmin ? [
      { path: '/ask-question', label: 'Ask Question' },
      { path: '/my-questions', label: 'My Questions' },
    ] : []),
    { path: '/answer-center', label: 'Discussion Room' },
    { path: '/leaderboard', label: 'Leaderboard' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Area' }] : []),
  ];

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`} style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    }}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>Crowd Sourced FAQ Generation Web App</h2>
        <button onClick={onClose} className="sidebar-close-btn" style={{
          display: 'none', background: 'transparent', border: 'none',
          cursor: 'pointer', color: 'var(--text-secondary)', padding: 4,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="nav-links">
        {navItems.map(({ path, label }, i) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${isActive(path)}`}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
              transition: `opacity 0.3s ease ${0.05 * i + 0.1}s, transform 0.3s ease ${0.05 * i + 0.1}s`,
            }}
          >
            {label}
          </Link>
        ))}
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
          cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button onClick={logout} className="btn-primary" style={{ width: '100%', padding: '0.5rem', transition: 'all 0.2s ease' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;