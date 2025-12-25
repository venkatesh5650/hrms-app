import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import EmployeeForm from "../components/EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCreate = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      await loadEmployees();
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee");
    }
  };

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
    } catch (err) {
      console.error(err);
      setError("Failed to save employee");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p className="page-subtitle">
            Manage employee records and see their team memberships.
          </p>
        </div>
        <button className="btn" onClick={handleCreate}>
          + Add Employee
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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

      <div className="card mt-md">
        {employees.length === 0 ? (
          <p className="muted">No employees yet. Add your first one.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Teams</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td>{emp.email || "-"}</td>
                    <td>
                      {emp.Teams?.length
                        ? emp.Teams.map((t) => t.name).join(", ")
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="btn btn-small"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-small btn-danger"
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
      </div>
    </div>
  );
};

export default Employees;
