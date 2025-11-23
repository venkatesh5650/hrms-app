import React, { useEffect, useState } from "react";

const initialState = {
  name: "",
  description: "",
};

const TeamForm = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Team" : "Add Team"}</h3>
      <div className="form-row">
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn">
          {initialData ? "Update" : "Create"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
