import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/approvals.css";

const API = process.env.REACT_APP_API_BASE_URL;

export default function Approvals() {
  const { token, user } = useAuth();
  const role = user?.role;

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [processingId, setProcessingId] = useState(null);

  const [rejectReasons, setRejectReasons] = useState({});
  const [rejectErrors, setRejectErrors] = useState({});

  const [createPayload, setCreatePayload] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchApprovals = useCallback(async () => {
    try {
      const res = await fetch(`${API}/approvals/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const list = Array.isArray(data.approvals) ? data.approvals : data;

      let visible = [];

      if (role === "ADMIN") {
        visible = list.filter((a) => a.type === "LOGIN_ACCESS");
      } else if (role === "MANAGER") {
        visible = list.filter((a) => a.type === "CREATE");
      } else if (role === "HR") {
        visible = list.filter((a) => a.type === "CREATE");
      } else {
        visible = [];
      }

      setApprovals(visible);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  function canActOn(a) {
    if (role === "ADMIN" && a.type === "LOGIN_ACCESS") return true;
    if (role === "MANAGER" && a.type === "CREATE") return true;
    return false;
  }

  async function handleApprove(id, type) {
    setProcessingId(id);
    const endpoint =
      type === "LOGIN_ACCESS" ? "approve-login" : "approve-create";

    await fetch(`${API}/approvals/${id}/${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchApprovals();
    setProcessingId(null);
  }

  async function handleReject(id, type) {
    const reason = rejectReasons[id];
    if (!reason?.trim()) {
      setRejectErrors((p) => ({ ...p, [id]: "Rejection reason required" }));
      return;
    }

    setProcessingId(id);
    const endpoint = type === "LOGIN_ACCESS" ? "reject-login" : "reject-create";

    await fetch(`${API}/approvals/${id}/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    fetchApprovals();
    setProcessingId(null);
  }

  async function handleCreateApproval() {
    if (!createPayload.first_name || !createPayload.email) {
      setCreateError("First name and email are required");
      return;
    }

    setCreateError(null);
    setCreateSuccess(false);

    await fetch(`${API}/approvals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "CREATE", payload: createPayload }),
    });

    setCreatePayload({ first_name: "", last_name: "", email: "" });
    setCreateSuccess(true);
    fetchApprovals();
  }

  const filtered = approvals.filter((a) => a.status === filter);

  return (
    <div className="approvals-page">
      <div className="approvals-header">
        <h1>
          {role === "ADMIN"
            ? "Login Access Approvals"
            : role === "MANAGER"
            ? "Employee Creation Approvals"
            : "Approval History"}
        </h1>

        <div className="tabs">
          {["PENDING", "APPROVED", "REJECTED"].map((t) => (
            <button
              key={t}
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {role === "HR" && (
        <div className="create-approval-card">
          <h3>Create New Employee Request</h3>
          <p className="helper-text">
            Send a request to the manager for approval.
          </p>

          <div className="form-grid">
            <div>
              <label>First Name</label>
              <input
                value={createPayload.first_name}
                onChange={(e) =>
                  setCreatePayload((p) => ({
                    ...p,
                    first_name: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                value={createPayload.last_name}
                onChange={(e) =>
                  setCreatePayload((p) => ({ ...p, last_name: e.target.value }))
                }
              />
            </div>

            <div className="full">
              <label>Email</label>
              <input
                value={createPayload.email}
                onChange={(e) =>
                  setCreatePayload((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
          </div>

          <button className="primary-btn" onClick={handleCreateApproval}>
            Send to Manager
          </button>

          {createError && <div className="error">{createError}</div>}
          {createSuccess && (
            <div className="success">Request sent successfully!</div>
          )}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="approval-list">
          {filtered.map((a) => (
            <div key={a.id} className="approval-card">
              <div className="approval-meta">
                <span className={`status ${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
                <span className="type">{a.type}</span>
                <span className="time">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </div>

              <pre className="payload">
                {JSON.stringify(a.payload, null, 2)}
              </pre>

              {a.status === "PENDING" && canActOn(a) && (
                <div className="actions">
                  <button
                    className="approve"
                    disabled={processingId === a.id}
                    onClick={() => handleApprove(a.id, a.type)}
                  >
                    Approve
                  </button>

                  <input
                    placeholder="Reason"
                    onChange={(e) =>
                      setRejectReasons((p) => ({
                        ...p,
                        [a.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="reject"
                    disabled={processingId === a.id}
                    onClick={() => handleReject(a.id, a.type)}
                  >
                    Reject
                  </button>
                  {rejectErrors[a.id] && (
                    <div className="reject-error">{rejectErrors[a.id]}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
