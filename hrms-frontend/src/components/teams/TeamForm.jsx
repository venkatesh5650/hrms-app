import { useState } from "react";
import "../../styles/teams/teamForm.css";

export default function TeamForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="team-form-overlay">
      <div className="team-form-card">
        <h2 className="team-form-title">
          {initialData ? "Edit Team" : "Create Team"}
        </h2>

        <form onSubmit={handleSubmit} className="team-form">
          <div className="form-group">
            <label htmlFor="name">Team Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what this team does"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {initialData ? "Update Team" : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
