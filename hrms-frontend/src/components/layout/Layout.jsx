import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import LogoutProcessingOverlay from "../common/LogoutProcessingOverlay";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { isLoggingOut } = useAuth();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app-shell">
      {isDesktop ? <Sidebar /> : <Navbar />}
      <main className="app-content">
        <Outlet />
      </main>

      {/* Global logout overlay — renders over all dashboard content */}
      {isLoggingOut && <LogoutProcessingOverlay />}
    </div>
  );
}
