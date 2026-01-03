import { useState } from "react";
import api from "../../services/api";
import "../../styles/users/userForm.css";

export default function UserForm({ user, restrictedRole, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    role: user.role || restrictedRole || "MANAGER"
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (user.id) {
      await api.put(`/users/${user.id}`, form);
    } else {
      await api.post("/users", form);
    }
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{user.id ? "Edit User" : "Create User"}</h3>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        {!user.id && (
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        )}

        <div className="readonly-role">
          Role: <strong>{form.role}</strong>
        </div>

        <div className="actions">
          <button className="primary" onClick={submit}>Save</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
