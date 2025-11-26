import React from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FolderViewPage from "./pages/FolderViewPage";
import PublicViewPage from "./pages/PublicViewPage";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">Storage Platform</div>
        <div>
          {token && (
            <button className="button secondary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/folders/:id"
          element={
            <PrivateRoute>
              <FolderViewPage />
            </PrivateRoute>
          }
        />
        <Route path="/public/:shareId" element={<PublicViewPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;
