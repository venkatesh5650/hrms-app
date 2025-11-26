import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

interface Folder {
  _id: string;
  name: string;
}

interface FileItem {
  _id: string;
  name: string;
  url: string;
}

interface PublicResponse {
  type: "folder" | "file";
  folder?: Folder;
  file?: FileItem;
  subFolders?: Folder[];
  files?: FileItem[];
}

const PublicViewPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [data, setData] = useState<PublicResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!shareId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PublicResponse>(`/public/${shareId}`);
        setData(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Link invalid or revoked");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareId]);

  return (
    <div className="card">
      <h2>Public View</h2>
      <p className="badge">Read-Only Shared Resource</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "#f97373" }}>{error}</p>}

      {data?.type === "file" && data.file && (
        <div>
          <h3>File: {data.file.name}</h3>
          <a
            href={data.file.url}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Open file
          </a>
        </div>
      )}

      {data?.type === "folder" && data.folder && (
        <div>
          <h3>Folder: {data.folder.name}</h3>
          <h4>Files</h4>
          <ul className="list">
            {data.files && data.files.length > 0 ? (
              data.files.map((f) => (
                <li key={f._id} className="list-item">
                  <span>{f.name}</span>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    Open
                  </a>
                </li>
              ))
            ) : (
              <p>No files shared.</p>
            )}
          </ul>

          {data.subFolders && data.subFolders.length > 0 && (
            <>
              <h4>Sub-folders</h4>
              <ul className="list">
                {data.subFolders.map((sf) => (
                  <li key={sf._id} className="list-item">
                    <span>{sf.name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicViewPage;
