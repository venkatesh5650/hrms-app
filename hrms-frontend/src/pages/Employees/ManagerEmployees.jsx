import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EmployeeTable from "../../components/employees/EmployeeTable";
import "../../styles/employees/managerEmployees.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function ManagerEmployees() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Employees fetch failed:", res.status, text);
          setError("Unable to load employees");
          return;
        }

        const data = await res.json();

        const all = Array.isArray(data.employees)
          ? data.employees
          : Array.isArray(data)
          ? data
          : [];

        setEmployees(all);
      } catch (err) {
        console.error("ManagerEmployees load error:", err);
        setError("Unexpected error loading employees");
      }
    }

    if (token) load();
  }, [token]);

  if (error) return <p className="error">{error}</p>;

return (
  <div className="employees-page manager-employees">
    <div className="manager-card">
      <div className="manager-header">
        <div>
          <h1>All Employees</h1>
          <p>Company-wide visibility</p>
        </div>
      </div>

      <div className="manager-table-wrapper">
        <EmployeeTable employees={employees} role="MANAGER" />
      </div>
    </div>
  </div>
);
}
