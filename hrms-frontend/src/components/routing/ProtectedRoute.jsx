import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GlobalLoaderOverlay from "../common/GlobalLoaderOverlay";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <GlobalLoaderOverlay />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
