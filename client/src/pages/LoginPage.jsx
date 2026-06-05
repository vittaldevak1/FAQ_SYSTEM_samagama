import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password, rememberMe);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'super_admin' || user.role === 'admin' ? '/admin' : '/user', { replace: true });
    } catch (err) {
  const msg = err.response?.data?.message || 'Login failed';
  toast.error(msg);
      if (err.response?.status === 429) {
        const match = msg.match(/(\d+)/);
        if (match) {
          const mins = parseInt(match[1]);
          setLockoutTimer(mins * 60);
          const interval = setInterval(() => {
            setLockoutTimer((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    try {
      const user = await googleLogin(credential);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === 'super_admin' || user.role === 'admin' ? '/admin' : '/user', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  const formatLockout = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>
      </div>

      <div className="role-tabs">
  <button
    type="button"
    className={`role-tab role-tab-admin ${selectedRole === 'admin' ? 'role-tab-selected' : ''}`}
    onClick={() => {
      setSelectedRole('admin');
      //setForm({ email: 'sudarshansudarshan@gmail.com', password: 'Admin@123' });
      setErrors({});
    }}
  >
    <div className="role-tab-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
    <span className="role-tab-title">Admin</span>
    {selectedRole === 'admin' && <span className="role-tab-check">✓</span>}
  </button>

  <button
    type="button"
    className={`role-tab role-tab-intern ${selectedRole === 'intern' ? 'role-tab-selected' : ''}`}
    onClick={() => {
      setSelectedRole('intern');
      //setForm({ email: 'test@example.com', password: 'Test@1234' });
      setErrors({});
    }}
  >
    <div className="role-tab-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
    <span className="role-tab-title">Intern</span>
    {selectedRole === 'intern' && <span className="role-tab-check">✓</span>}
  </button>
</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-pw"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="form-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || lockoutTimer}>
          {loading ? (
            <>
              <span className="spinner" /> Signing in...
            </>
          ) : lockoutTimer ? (
            `Locked ${formatLockout(lockoutTimer)}`
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="divider">or continue with</div>

       <GoogleSignInButton
        onSuccess={handleGoogleSuccess}
        onError={(msg) => toast.error(msg)}
        text="Sign in with Google"
      />

      <p className="auth-alt-link">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
