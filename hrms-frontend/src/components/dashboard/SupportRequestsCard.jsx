import { useState } from "react";
import { TicketCheck } from "lucide-react";
import { resolveSupportRequest } from "../../services/supportApi";
import "../../styles/dashboard/supportRequests.css";

/**
 * SupportRequestsCard
 * Reusable card rendered on HR / Manager / Admin dashboards.
 * Never crashes the dashboard — shows empty state on any failure.
 */
export default function SupportRequestsCard({
    requests = [],
    onResolve,
    loading = false,
}) {
    const [resolvingId, setResolvingId] = useState(null);

    async function handleResolve(id) {
        setResolvingId(id);
        try {
            await resolveSupportRequest(id);
            if (onResolve) onResolve(id);
        } catch (err) {
            console.error("Failed to resolve support request:", err);
        } finally {
            setResolvingId(null);
        }
    }

    return (
        <div className="support-card">
            <div className="support-card-header">
                <div className="flex items-center gap-3">
                    <div className="support-icon-wrap">
                        <TicketCheck size={16} />
                    </div>
                    <div>
                        <p className="support-card-title">Employee Support Requests</p>
                        <p className="support-card-subtitle">
                            Role-routed requests from employees
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="support-empty">Loading support requests…</div>
            ) : requests.length === 0 ? (
                <div className="support-empty">No support requests available.</div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="support-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Category</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => {
                                const empName = req.employee
                                    ? `${req.employee.first_name ?? ""} ${req.employee.last_name ?? ""}`.trim()
                                    : `EMP-${req.employee_id}`;

                                const isPending = req.status === "PENDING";
                                const isResolving = resolvingId === req.id;

                                return (
                                    <tr key={req.id}>
                                        <td style={{ fontWeight: 600 }}>{empName || "—"}</td>
                                        <td>{req.category}</td>
                                        <td
                                            style={{
                                                maxWidth: 240,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                color: "#6b7280",
                                            }}
                                            title={req.message}
                                        >
                                            {req.message}
                                        </td>
                                        <td>
                                            <span
                                                className={`support-badge ${isPending ? "pending" : "resolved"
                                                    }`}
                                            >
                                                {isPending ? "● Pending" : "✓ Resolved"}
                                            </span>
                                        </td>
                                        <td>
                                            {isPending ? (
                                                <button
                                                    className="support-resolve-btn"
                                                    disabled={isResolving}
                                                    onClick={() => handleResolve(req.id)}
                                                >
                                                    {isResolving ? "Resolving…" : "Resolve"}
                                                </button>
                                            ) : (
                                                <span style={{ color: "#d1d5db", fontSize: 12 }}>
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
