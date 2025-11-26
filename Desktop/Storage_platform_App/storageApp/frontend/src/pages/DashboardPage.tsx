import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

interface Folder {
  _id: string;
  name: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  const fetchFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Folder[]>("/folders/root");
      setFolders(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load folders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await api.post("/folders", { name: newFolderName });
      setNewFolderName("");
      fetchFolders();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create folder");
    }
  };

  return (
    <div className="card">
      <h2>Dashboard / Root Folders</h2>
      <p className="badge">Find All Folders View</p>

      <div style={{ margin: "1rem 0" }}>
        <input
          className="input"
          placeholder="New root folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button className="button" onClick={handleCreateFolder}>
          Create Folder
        </button>
      </div>

      {loading && <p>Loading folders...</p>}
      {error && <p style={{ color: "#f97373" }}>{error}</p>}

      {!loading && folders.length === 0 && <p>No folders yet.</p>}

      <ul className="list">
        {folders.map((folder) => (
          <li key={folder._id} className="list-item">
            <div>
              <strong>{folder.name}</strong>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Created: {new Date(folder.createdAt).toLocaleString()}
              </div>
            </div>
            <Link className="link" to={`/folders/${folder._id}`}>
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
