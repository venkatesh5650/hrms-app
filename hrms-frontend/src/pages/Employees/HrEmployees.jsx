import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EmployeeTable from "../../components/employees/EmployeeTable";
import "../../styles/employees/hrEmployees.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function HrEmployees() {
  const [employees, setEmployees] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch(`${API}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setEmployees(data.employees || data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    }

    fetchEmployees();
  }, [token]);

  return (
    <div className="employees-page hr-employees">
      <div className="hr-card">
        <div className="hr-header">
          <div>
            <h1>Manage Employees</h1>
            <p>Edit details, manage status & assignments</p>
          </div>
        </div>

        <div className="hr-table-wrapper">
          <EmployeeTable employees={employees} role="HR" />
        </div>
      </div>
    </div>
  );
}
