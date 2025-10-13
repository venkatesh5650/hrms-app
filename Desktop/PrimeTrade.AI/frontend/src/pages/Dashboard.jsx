import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, getProfile, updateTask } from "../services/api";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [user, setUser] = useState({});

  const fetchTasks = async () => {
    const res = await getTasks(search, statusFilter);
    setTasks(res.data);
  };

  const fetchProfile = async () => {
    const res = await getProfile();
    setUser(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, [search, statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    await createTask({ title, description: desc });
    setTitle("");
    setDesc("");
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleUpdateStatus = async (id, status) => {
    await updateTask(id, { status });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 header">
        <div className="user-info">
          <h2>Welcome, <span>{user.name || "User"}</span></h2>
          <p>{user.email}</p>
        </div>
        <button onClick={logout} className="btn btn-danger btn-lg">
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleCreate} className="add-task-form p-4 rounded shadow mb-4">
        <div className="row g-2">
          <div className="col-md-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              className="form-control"
            />
          </div>
          <div className="col-md-2 d-grid">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Search & Filter */}
      <div className="search-filter row g-2 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <ul className="list-unstyled task-list">
        {tasks.map((t) => (
          <li key={t.id} className="task-item d-flex justify-content-between align-items-center p-3 mb-3 rounded shadow-sm">
            <div>
              <p className="task-title mb-1">{t.title}</p>
              <p className="task-desc mb-1">{t.description}</p>
              <p className={`task-status mb-0 status-${t.status}`}>{t.status}</p>
              {/* Status Update */}
              <div className="mt-2 d-flex gap-2">
                <button onClick={() => handleUpdateStatus(t.id, "todo")} className="btn btn-sm btn-outline-primary">Todo</button>
                <button onClick={() => handleUpdateStatus(t.id, "inprogress")} className="btn btn-sm btn-outline-warning">In Progress</button>
                <button onClick={() => handleUpdateStatus(t.id, "done")} className="btn btn-sm btn-outline-success">Done</button>
              </div>
            </div>
            <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
