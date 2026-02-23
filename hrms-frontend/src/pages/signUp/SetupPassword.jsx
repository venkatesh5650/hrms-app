import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/pages/login.css";

export default function SetupPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleAuthSuccess } = useAuth();

    const token = searchParams.get("token");

    // Token verification state
    const [verifying, setVerifying] = useState(true);
    const [tokenError, setTokenError] = useState("");
    const [userName, setUserName] = useState("");

    // Form state
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [done, setDone] = useState(false);

    // Verify the token as soon as the page loads
    useEffect(() => {
        if (!token) {
            setTokenError("No setup token found. Please use the link from your email.");
            setVerifying(false);
            return;
        }

        api
            .get(`/auth/verify-token?token=${token}`)
            .then((res) => {
                setUserName(res.data.name || "");
                setVerifying(false);
            })
            .catch((err) => {
                setTokenError(
                    err.response?.data?.message ||
                    "This setup link is invalid or has already been used."
                );
                setVerifying(false);
            });
    }, [token]);

    const firstName = userName?.split(" ")[0] || "there";

    const passwordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { label: "Too short", color: "#ef4444" };
        if (password.length < 8) return { label: "Weak", color: "#f59e0b" };
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
            return { label: "Fair", color: "#3b82f6" };
        return { label: "Strong", color: "#10b981" };
    };

    const strength = passwordStrength();

    const isValid =
        password.length >= 8 && password === confirm && !submitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (password !== confirm) {
            setFormError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setFormError("Password must be at least 8 characters.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post("/auth/setup-password", { token, password });
            handleAuthSuccess(res.data);
            setDone(true);
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            setFormError(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ── Render states ──────────────────────────────────────────────

    if (verifying) {
        return (
            <div className="login-root" style={{ justifyContent: "center" }}>
                <div className="login-card" style={{ maxWidth: 420, textAlign: "center", padding: "48px 40px" }}>
                    <div className="brand" style={{ justifyContent: "center", marginBottom: 24 }}>
                        <div className="brand-logo">HR</div>
                        <span>HRMS</span>
                    </div>
                    <p style={{ color: "#6b7280", fontSize: 14 }}>Verifying your setup link…</p>
                </div>
            </div>
        );
    }

    if (tokenError) {
        return (
            <div className="login-root" style={{ justifyContent: "center" }}>
                <div className="login-card" style={{ maxWidth: 420, textAlign: "center", padding: "48px 40px" }}>
                    <div className="brand" style={{ justifyContent: "center", marginBottom: 24 }}>
                        <div className="brand-logo">HR</div>
                        <span>HRMS</span>
                    </div>
                    <div
                        style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: 10,
                            padding: "16px 20px",
                            marginBottom: 24,
                        }}
                    >
                        <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>⚠️ {tokenError}</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (done) {
        return (
            <div className="login-root" style={{ justifyContent: "center" }}>
                <div className="login-card" style={{ maxWidth: 420, textAlign: "center", padding: "48px 40px" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 className="title">Account Ready!</h2>
                    <p style={{ color: "#6b7280", fontSize: 14 }}>
                        Your password has been set. Redirecting to your dashboard…
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-root" style={{ justifyContent: "center" }}>
            <div className="login-card" style={{ maxWidth: 420, padding: "48px 40px" }}>

                <div className="brand" style={{ marginBottom: 24 }}>
                    <div className="brand-logo">HR</div>
                    <span>HRMS</span>
                </div>

                <h2 className="title">Set Your Password</h2>
                <p className="subtitle">
                    Welcome, <strong>{firstName}</strong>! Choose a secure password to activate your account.
                </p>

                {formError && <div className="error info">{formError}</div>}

                <form onSubmit={handleSubmit}>
                    <label>New Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword((s) => !s)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Strength indicator */}
                    {strength && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 16px" }}>
                            <div style={{ flex: 1, height: 4, background: "#e5e7eb", borderRadius: 9999 }}>
                                <div
                                    style={{
                                        width:
                                            strength.label === "Too short" ? "20%" :
                                                strength.label === "Weak" ? "40%" :
                                                    strength.label === "Fair" ? "65%" : "100%",
                                        height: "100%",
                                        background: strength.color,
                                        borderRadius: 9999,
                                        transition: "width 0.3s",
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                                {strength.label}
                            </span>
                        </div>
                    )}

                    <label>Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        required
                        style={
                            confirm && confirm !== password
                                ? { borderColor: "#ef4444" }
                                : {}
                        }
                    />
                    {confirm && confirm !== password && (
                        <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 12px" }}>
                            Passwords do not match
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isValid}
                        style={{ marginTop: 16 }}
                    >
                        {submitting ? "Setting up…" : "Activate My Account"}
                    </button>
                </form>

                <div className="footer" style={{ marginTop: 24, textAlign: "center" }}>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        Already set up?{" "}
                        <button
                            type="button"
                            className="request-access-link"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}
