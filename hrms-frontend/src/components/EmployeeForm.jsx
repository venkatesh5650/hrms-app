import React, { useEffect, useState } from "react";
import "./employeeForm.css";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

const EmployeeForm = ({ onSubmit, onCancel, initialData }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
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
    <form className="employee-form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{initialData ? "Edit Employee" : "Add Employee"}</h3>
        <p className="form-subtitle">
          {initialData ? "Update employee details" : "Create a new employee record"}
        </p>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-md">
          {initialData ? "Update" : "Create"}
        </button>
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
