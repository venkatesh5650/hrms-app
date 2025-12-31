import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import EmployeeForm from "../components/EmployeeForm";
import "./employees.css";

const Employees = () => {
  // Stores employee list fetched from API
  const [employees, setEmployees] = useState([]);

  // Controls loading state for async fetch
  const [loading, setLoading] = useState(true);

  // Controls visibility of create/edit form
  const [showForm, setShowForm] = useState(false);

  // Holds employee being edited (null = create mode)
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Holds user-facing error messages
  const [error, setError] = useState("");

  // Fetch employees from backend
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // Load employees once on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // Open form in create mode
  const handleCreate = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  // Open form in edit mode
  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  // Deletes employee after confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      await loadEmployees();
    } catch {
      setError("Failed to delete employee");
    }
  };

  // Handles create/update submit
  const handleFormSubmit = async (data) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, data);
      } else {
        await api.post("/employees", data);
      }
      setShowForm(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch {
      setError("Failed to save employee");
    }
  };

  // Show inline loader while data is loading
  if (loading) return <Loader inline />;

  return (
    <main className="employees-root">
      <header className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="page-subtitle">
            Manage employee records and team memberships.
          </p>
        </div>
        <button className="btn btn-primary btn-md" onClick={handleCreate}>
          + Add Employee
        </button>
      </header>

      {error && <div className="alert-error">{error}</div>}

      {showForm && (
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      <section className="card employees-card">
        {employees.length === 0 ? (
          <p className="muted">No employees yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Teams</th>
                  <th className="actions-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="table-row">
                    <td data-label="Name">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td data-label="Email" className="truncate">
                      {emp.email || "—"}
                    </td>
                    <td data-label="Teams" className="truncate">
                      {emp.Teams?.length
                        ? emp.Teams.map((t) => t.name).join(", ")
                        : "—"}
                    </td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default Employees;
