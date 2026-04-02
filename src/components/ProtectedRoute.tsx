import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'user' | 'admin' | 'authority';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // If user is trying to access admin route but is not admin, redirect to user dashboard
    if (role === 'admin' && user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // For other role mismatches, redirect to appropriate dashboard
    return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

