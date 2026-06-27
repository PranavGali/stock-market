import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { AdminLogin } from '@/pages/auth/AdminLogin';
import { Dashboard } from '@/pages/Dashboard';
import { StockExplorer } from '@/pages/StockExplorer';
import { StockDetails } from '@/pages/StockDetails';
import { Portfolio } from '@/pages/Portfolio';
import { Watchlist } from '@/pages/Watchlist';
import { MarketAnalytics } from '@/pages/MarketAnalytics';
import { NewsInsights } from '@/pages/NewsInsights';
import { AIPredictions } from '@/pages/AIPredictions';
import { UserProfile } from '@/pages/UserProfile';
import { AdminDashboard } from '@/pages/AdminDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasUser = !!localStorage.getItem('mock_user');
  if (!hasUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Only admins (stored under mock_admin key with role=admin) can access */
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const adminRaw = localStorage.getItem('mock_admin');
  if (!adminRaw) return <Navigate to="/admin-login" replace />;
  try {
    const admin = JSON.parse(adminRaw);
    if (admin?.role !== 'admin') return <Navigate to="/admin-login" replace />;
  } catch {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
}

// Use /stock-market as basename when deployed to GitHub Pages
const basename = import.meta.env.DEV ? '/' : '/stock-market';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/admin-login',
    element: <AdminLogin />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/explore',
        element: <ProtectedRoute><StockExplorer /></ProtectedRoute>,
      },
      {
        path: '/stock/:symbol',
        element: <ProtectedRoute><StockDetails /></ProtectedRoute>,
      },
      {
        path: '/portfolio',
        element: <ProtectedRoute><Portfolio /></ProtectedRoute>,
      },
      {
        path: '/watchlist',
        element: <ProtectedRoute><Watchlist /></ProtectedRoute>,
      },
      {
        path: '/analytics',
        element: <ProtectedRoute><MarketAnalytics /></ProtectedRoute>,
      },
      {
        path: '/news',
        element: <ProtectedRoute><NewsInsights /></ProtectedRoute>,
      },
      {
        path: '/predictions',
        element: <ProtectedRoute><AIPredictions /></ProtectedRoute>,
      },
      {
        path: '/profile',
        element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
      },
      {
        path: '/admin',
        element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
], { basename });
