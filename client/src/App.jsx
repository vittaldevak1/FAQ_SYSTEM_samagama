import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserPage from './pages/UserPage';
import QueryPage from './pages/QueryPage';
import DashboardHome from './pages/DashboardHome';
import AskQuestion from './pages/AskQuestion';
import MyQuestions from './pages/MyQuestions';
import QuestionDetail from './pages/QuestionDetail';
import AnswerCenter from './pages/AnswerCenter';
import AdminArea from './pages/AdminArea';
import Leaderboard from './pages/Leaderboard';
import './styles/auth.css';

// Page transition wrapper
function AnimatedPage({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useEffect ? [true, () => {}] : [true, () => {}];
  return (
    <div
      key={location.pathname}
      style={{
        animation: 'pageEnter 0.3s ease forwards',
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Toaster
              position="top-right"
              containerStyle={{ zIndex: 99999 }}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  backdropFilter: 'blur(8px)',
                  zIndex: 99999,
                },
                success: { iconTheme: { primary: 'var(--success)', secondary: 'white' } },
                error: { iconTheme: { primary: 'var(--error)', secondary: 'white' } },
              }}
            />
            <Routes>
              <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
              <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
              <Route path="/reset-password/:token" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

              <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
              <Route path="/query" element={<ProtectedRoute><QueryPage /></ProtectedRoute>} />

              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/ask-question" element={<AskQuestion />} />
                <Route path="/my-questions" element={<MyQuestions />} />
                <Route path="/questions/:id" element={<QuestionDetail />} />
                <Route path="/answer-center" element={<AnswerCenter />} />
                <Route path="/admin" element={<AdminArea />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>

              <Route path="/" element={<Navigate to="/user" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}