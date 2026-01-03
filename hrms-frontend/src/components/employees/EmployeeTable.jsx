import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/employees/employeeTable.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function EmployeeTable({ employees, role }) {
  const { token } = useAuth();

  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });

  const canEdit = role === "HR";

  useEffect(() => {
    const normalized = Array.isArray(employees)
      ? employees
      : employees?.employees || [];

    setList(normalized);
  }, [employees]);

  function startEdit(emp) {
    setEditingId(emp.id);
    setForm({
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveEdit(id) {
    try {
      console.log("Saving employee:", id, form);

      const res = await fetch(`${API}/employees/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      console.log("Update response:", res.status, text);

      if (!res.ok) {
        alert("Update failed. Check console.");
        return;
      }

      const updated = JSON.parse(text);

      setList(prev =>
        prev.map(e => (e.id === id ? { ...e, ...updated } : e))
      );

      setEditingId(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  async function toggleStatus(id, isActive) {
    try {
      const res = await fetch(`${API}/employees/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!res.ok) return;

      setList(prev =>
        prev.map(e => (e.id === id ? { ...e, is_active: !isActive } : e))
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (list.length === 0) return <p className="empty">No employees found</p>;

  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Teams</th>
          <th>Status</th>
          {canEdit && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {list.map(e => (
          <tr key={e.id} className={editingId === e.id ? "editing-row" : ""}>
            <td>
              {editingId === e.id ? (
                <input name="first_name" value={form.first_name} onChange={onChange} />
              ) : (
                e.first_name
              )}
            </td>

            <td>
              {editingId === e.id ? (
                <input name="last_name" value={form.last_name} onChange={onChange} />
              ) : (
                e.last_name
              )}
            </td>

            <td>
              {editingId === e.id ? (
                <input name="email" value={form.email} onChange={onChange} />
              ) : (
                e.email
              )}
            </td>

            <td>
              <div className="team-chip-container">
                {e.Teams?.length
                  ? e.Teams.map(t => (
                      <span key={t.id} className="team-chip">{t.name}</span>
                    ))
                  : <span className="team-chip muted">None</span>}
              </div>
            </td>

            <td>
              <span className={e.is_active ? "active" : "inactive"}>
                {e.is_active ? "Active" : "Inactive"}
              </span>
            </td>

            {canEdit && (
              <td className="actions">
                {editingId === e.id ? (
                  <>
                    <button className="btn btn-save" onClick={() => saveEdit(e.id)}>Save</button>
                    <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-edit" onClick={() => startEdit(e)}>Edit</button>
                    <button className="btn btn-toggle" onClick={() => toggleStatus(e.id, e.is_active)}>
                      {e.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
