export default function RoleBadge({ role }) {
  const colors = {
    ADMIN: "#2563eb",
    HR: "#059669",
    MANAGER: "#d97706",
  };

  return (
    <span style={{
      padding: "4px 8px",
      borderRadius: "6px",
      background: colors[role] || "#6b7280",
      color: "white",
      fontSize: "12px",
      fontWeight: "500"
    }}>
      {role}
    </span>
  );
}
