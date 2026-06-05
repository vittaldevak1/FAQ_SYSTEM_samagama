import { useState, useEffect } from 'react';

export default function AuthLayout({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="auth-container" style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <div className="auth-brand-panel" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
      }}>
        <div className="brand-content">
          <svg className="brand-logo" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: 'floatLogo 3s ease-in-out infinite' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h2 className="brand-title">FAQ Platform</h2>
          <p className="brand-tagline">
            Secure authentication for interns and administrators.
            Ask questions, find answers, and manage your knowledge base.
          </p>
          <svg className="brand-illustration" width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="30" width="240" height="120" rx="12" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <rect x="36" y="46" width="100" height="12" rx="4" fill="currentColor" opacity="0.15" style={{ animation: 'shimmer 2.5s ease-in-out infinite' }} />
            <rect x="36" y="66" width="160" height="8" rx="4" fill="currentColor" opacity="0.08" style={{ animation: 'shimmer 2.5s ease-in-out infinite 0.2s' }} />
            <rect x="36" y="82" width="140" height="8" rx="4" fill="currentColor" opacity="0.08" style={{ animation: 'shimmer 2.5s ease-in-out infinite 0.4s' }} />
            <rect x="36" y="98" width="120" height="8" rx="4" fill="currentColor" opacity="0.08" style={{ animation: 'shimmer 2.5s ease-in-out infinite 0.6s' }} />
            <rect x="156" y="46" width="88" height="12" rx="4" fill="currentColor" opacity="0.15" style={{ animation: 'shimmer 2.5s ease-in-out infinite 0.3s' }} />
            <circle cx="60" cy="135" r="16" fill="currentColor" opacity="0.1" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <circle cx="120" cy="135" r="16" fill="currentColor" opacity="0.1" style={{ animation: 'pulse 2s ease-in-out infinite 0.3s' }} />
            <circle cx="180" cy="135" r="16" fill="currentColor" opacity="0.1" style={{ animation: 'pulse 2s ease-in-out infinite 0.6s' }} />
            <circle cx="240" cy="135" r="16" fill="currentColor" opacity="0.1" style={{ animation: 'pulse 2s ease-in-out infinite 0.9s' }} />
          </svg>
        </div>
      </div>

      <div className="auth-form-panel" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(24px)',
        transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
      }}>
        {children}
      </div>
    </div>
  );
}