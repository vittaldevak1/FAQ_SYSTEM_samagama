import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onMenuClick}
          className="hamburger-btn"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '6px 8px',
            cursor: 'pointer', color: 'var(--text-secondary)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Dashboard / <span style={{ color: 'var(--text-primary)' }}>Overview</span>
        </div>
      </div>
      <div className="flex-row">
        {user?.role === 'admin' && <span className="badge badge-answered" style={{ marginRight: '1rem' }}>ADMIN MODE</span>}
        <NotificationBell />
      </div>
    </header>
  );
};

export default Header;