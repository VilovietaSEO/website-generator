import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;