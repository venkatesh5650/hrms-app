import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("Token:", token); // check what you get
  return token ? children : <Navigate to="/login" replace />;
}
