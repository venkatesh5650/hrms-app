import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

interface Folder {
  _id: string;
  name: string;
  parent?: string | null;
}

interface FileItem {
  _id: string;
  name: string;
  url: string;
}

interface FolderResponse {
  folder: Folder;
  subFolders: Folder[];
  files: FileItem[];
}

const FolderViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<FolderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState(
    "https://dummyfile.com/file.pdf"
  );
  const [shareLink, setShareLink] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<FolderResponse>(`/folders/${id}`);
      setData(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load folder");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSubFolder = async () => {
    if (!newFolderName.trim() || !id) return;
    try {
      await api.post("/folders", { name: newFolderName, parentId: id });
      setNewFolderName("");
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create folder");
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim() || !id) return;
    try {
      await api.post("/files", {
        name: newFileName,
        folderId: id,
        url: newFileUrl,
      });
      setNewFileName("");
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create file");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm("Delete this folder?")) return;
    await api.delete(`/folders/${folderId}`);
    fetchData();
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm("Delete this file?")) return;
    await api.delete(`/files/${fileId}`);
    fetchData();
  };

  const handleGenerateFolderShare = async () => {
    if (!id) return;
    const res = await api.post(`/folders/${id}/share`);
    setShareLink(`${window.location.origin}/public/${res.data.shareId}`);
  };

  const handleGenerateFileShare = async (fileId: string) => {
    const res = await api.post(`/files/${fileId}/share`);
    setShareLink(`${window.location.origin}/public/${res.data.shareId}`);
  };

  const goUp = () => {
    if (data?.folder.parent) {
      navigate(`/folders/${data.folder.parent}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="card">
      <h2>Nested Folder View</h2>
      <p className="badge">Find All Sub-Folders View</p>
      {data && (
        <p style={{ marginBottom: "0.5rem" }}>
          Path: <strong>{data.folder.name}</strong>
        </p>
      )}
      <button className="button secondary" onClick={goUp}>
        Go Up
      </button>{" "}
      <Link className="link" to="/dashboard">
        Back to Dashboard
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "#f97373" }}>{error}</p>}
      {data && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <h3>Child Folders</h3>
            <div style={{ margin: "0.5rem 0" }}>
              <input
                className="input"
                placeholder="New sub-folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button className="button" onClick={handleCreateSubFolder}>
                Create Folder
              </button>
            </div>
            <ul className="list">
              {data.subFolders.map((f) => (
                <li key={f._id} className="list-item">
                  <Link className="link" to={`/folders/${f._id}`}>
                    {f.name}
                  </Link>
                  <div>
                    <button
                      className="button danger"
                      onClick={() => handleDeleteFolder(f._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {data.subFolders.length === 0 && <p>No sub-folders.</p>}
            </ul>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h3>Files</h3>
            <div style={{ margin: "0.5rem 0" }}>
              <input
                className="input"
                placeholder="New file name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
              <input
                className="input"
                placeholder="Dummy file URL"
                value={newFileUrl}
                onChange={(e) => setNewFileUrl(e.target.value)}
              />
              <button className="button" onClick={handleCreateFile}>
                Add File
              </button>
            </div>
            <ul className="list">
              {data.files.map((file) => (
                <li key={file._id} className="list-item">
                  <div>
                    <strong>{file.name}</strong>
                    <div style={{ fontSize: "0.8rem" }}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        Open file
                      </a>
                    </div>
                  </div>
                  <div>
                    <button
                      className="button secondary"
                      onClick={() => handleGenerateFileShare(file._id)}
                    >
                      Share
                    </button>
                    <button
                      className="button danger"
                      onClick={() => handleDeleteFile(file._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {data.files.length === 0 && <p>No files.</p>}
            </ul>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button
              className="button secondary"
              onClick={handleGenerateFolderShare}
            >
              Generate Folder Share Link
            </button>
            {shareLink && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Share URL: <span className="badge">{shareLink}</span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FolderViewPage;
