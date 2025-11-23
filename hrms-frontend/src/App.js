import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import RegisterOrg from "./pages/RegisterOrg";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Teams from "./pages/Teams";
import Logs from "./pages/Logs";

function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];

  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="app-root">
      {showNavbar && <Navbar />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterOrg />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/logs" element={<Logs />} />
          </Route>

          <Route path="*" element={<div>404 - Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
