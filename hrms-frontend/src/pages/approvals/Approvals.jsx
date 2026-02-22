import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import AppSpinner from "../../components/common/AppSpinner";
import { useDemoGuard } from "../../hooks/useDemoGuard";
import ApprovalProcessingOverlay from "../../components/dashboard/ApprovalProcessingOverlay";
import { Loader2 } from "lucide-react";
import "../../styles/pages/approvals.css";

export default function Approvals() {
  const { user } = useAuth();
  const role = user?.role;
  const { guardWriteAction, DemoModal } = useDemoGuard();

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  // Processing States
  const [processingId, setProcessingId] = useState(null);
  const [processingType, setProcessingType] = useState(null); // CREATE, LOGIN_ACCESS
  const [processingAction, setProcessingAction] = useState(null); // APPROVE, REJECT

  const [rejectingId, setRejectingId] = useState(null);

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
      const res = await api.get("/approvals/history");
      const data = res.data;
      const list = Array.isArray(data.approvals)
        ? data.approvals
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

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
  }, [role]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  function canActOn(a) {
    if (role === "ADMIN" && a.type === "LOGIN_ACCESS") return true;
    if (role === "MANAGER" && a.type === "CREATE") return true;
    return false;
  }

  const handleApprove = guardWriteAction(async (id, type) => {
    setProcessingId(id);
    setProcessingType(type);
    setProcessingAction("APPROVE");

    const endpoint =
      type === "LOGIN_ACCESS" ? "approve-login" : "approve-create";

    try {
      await api.post(`/approvals/${id}/${endpoint}`);
      fetchApprovals();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
      setProcessingType(null);
      setProcessingAction(null);
    }
  });

  const handleReject = guardWriteAction(async (id, type) => {
    const reason = rejectReasons[id];
    if (!reason?.trim()) {
      setRejectErrors((p) => ({ ...p, [id]: "Rejection reason required" }));
      return;
    }

    setProcessingId(id);
    setProcessingType(type);
    setProcessingAction("REJECT");

    const endpoint = type === "LOGIN_ACCESS" ? "reject-login" : "reject-create";

    try {
      await api.post(`/approvals/${id}/${endpoint}`, { reason });
      setRejectingId(null);
      fetchApprovals();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
      setProcessingType(null);
      setProcessingAction(null);
    }
  });

  const handleCreateApproval = guardWriteAction(async () => {
    if (!createPayload.first_name || !createPayload.email) {
      setCreateError("First name and email are required");
      return;
    }

    setCreateError(null);
    setCreateSuccess(false);

    try {
      await api.post(`/approvals`, { type: "CREATE", payload: createPayload });
      setCreatePayload({ first_name: "", last_name: "", email: "" });
      setCreateSuccess(true);
      fetchApprovals();
    } catch (err) {
      console.error(err);
    }
  });

  const filtered = approvals.filter((a) => a.status === filter);

  return (
    <div className="approvals-page">
      <DemoModal />
      <div className="mb-6 fade-in flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
              {role === "ADMIN"
                ? "Login Access Approvals"
                : role === "MANAGER"
                  ? "Employee Creation Approvals"
                  : "Approval History"}
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Review and manage pending system requests</p>
        </div>

        <div className="tabs">
          {["PENDING", "APPROVED", "REJECTED"].map((t) => {
            const count = approvals.filter((a) => a.status === t).length;
            return (
              <button
                key={t}
                className={filter === t ? "active" : ""}
                onClick={() => setFilter(t)}
              >
                {t} {!loading && `(${count})`}
              </button>
            );
          })}
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
        <div className="flex justify-center items-center py-24">
          <AppSpinner />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p className="muted" style={{ fontSize: "14px", color: "#6b7280" }}>
            No {filter.toLowerCase()} approvals available.
          </p>
        </div>
      ) : (
        <div className="approval-list transition-opacity duration-300">
          {filtered.map((a) => (
            <div key={a.id} className="approval-card">
              <div className="approval-meta">
                <span className={`status ${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
                <span className="type">Access Request — {a.type.replace(/_/g, " ")}</span>
                <span className="time">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </div>

              <div className="payload-details" style={{ marginBottom: "15px" }}>
                <p style={{ margin: "5px 0" }}>
                  <strong>Employee Name:</strong>{" "}
                  {a.payload?.employeeName || a.payload?.first_name || a.payload?.name || ""}{" "}
                  {a.payload?.employeeName ? "" : (a.payload?.last_name || "")}
                  {!a.payload?.employeeName && !a.payload?.first_name && !a.payload?.last_name && !a.payload?.name && "Unknown Employee"}
                </p>
                {a.payload?.email && (
                  <p style={{ margin: "5px 0" }}>
                    <strong>Email:</strong> {a.payload.email}
                  </p>
                )}
                {a.payload?.employeeId && (
                  <p style={{ margin: "5px 0" }}>
                    <strong>Employee ID:</strong> {a.payload.employeeId}
                  </p>
                )}
              </div>

              {a.status === "PENDING" && canActOn(a) && (
                <div className="actions">
                  {rejectingId === a.id ? (
                    <div className="reject-flow" style={{ display: "flex", gap: "10px", alignItems: "center", width: "100%", flexWrap: "wrap" }}>
                      <input
                        placeholder="Reason for rejection..."
                        value={rejectReasons[a.id] || ""}
                        style={{ flex: 1, padding: "8px", minWidth: "200px", border: rejectErrors[a.id] ? "1px solid red" : "1px solid #ddd", borderRadius: "4px" }}
                        onChange={(e) => {
                          setRejectReasons((p) => ({
                            ...p,
                            [a.id]: e.target.value,
                          }));
                          if (e.target.value.trim()) {
                            setRejectErrors((p) => ({ ...p, [a.id]: null }));
                          }
                        }}
                      />
                      <button
                        className="reject"
                        disabled={processingId === a.id}
                        onClick={() => handleReject(a.id, a.type)}
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        {processingId === a.id && processingAction === "REJECT" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Rejecting...</span>
                          </>
                        ) : (
                          "Confirm Reject"
                        )}
                      </button>
                      <button
                        className="cancel"
                        style={{ background: "#f3f4f6", color: "#374151" }}
                        onClick={() => {
                          setRejectingId(null);
                          setRejectErrors((p) => ({ ...p, [a.id]: null }));
                        }}
                      >
                        Cancel
                      </button>
                      {rejectErrors[a.id] && (
                        <div className="reject-error" style={{ color: "red", width: "100%", fontSize: "0.85rem", marginTop: "4px" }}>{rejectErrors[a.id]}</div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        className="primary-btn approve"
                        disabled={processingId === a.id}
                        onClick={() => handleApprove(a.id, a.type)}
                        style={{ padding: "8px 16px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        {processingId === a.id && processingAction === "APPROVE" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Approving...</span>
                          </>
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        className="reject"
                        disabled={processingId === a.id}
                        onClick={() => setRejectingId(a.id)}
                        style={{ padding: "8px 16px", borderRadius: "4px", background: "transparent", color: "#ef4444", border: "1px solid #ef4444" }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}


      {/* Global Processing Feedback Overlay */}
      <ApprovalProcessingOverlay
        isVisible={!!processingId}
        type={processingType}
        action={processingAction}
      />
    </div>
  );
}
