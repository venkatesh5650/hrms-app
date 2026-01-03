import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/routing/ProtectedRoute";

import Login from "./pages/login/Login";
import OrganisationSignup from "./pages/signUp/OrganisationSignup";
import Dashboard from "./pages/DashboardRouter/Dashboard";
import Employees from "./pages/DashboardRouter/Employees";
import Teams from "./pages/Teams/Teams";
import Logs from "./pages/logs/Logs";
import Layout from "./components/layout/Layout";
import Approvals from "./pages/approvals/Approvals";
import Users from "./pages/users/Users";
import Exports from "./pages/exports/Exports";
import MyProfile from "./pages/profile/MyProfile";

// 🟢 ADD THESE:
import { useGlobalLoader } from "./context/GlobalLoaderContext";
import GlobalLoader from "./components/GlobalLoader";
import RouteLoader from "./components/RouteLoader";

function App() {
  const { loading } = useGlobalLoader();

  return (
    <div className="app-root">
      {loading && <GlobalLoader />}
      <RouteLoader />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<OrganisationSignup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/exports" element={<Exports />} />
            <Route path="/profile" element={<MyProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 - Not found</div>} />
      </Routes>
    </div>
  );
}

export default App;
