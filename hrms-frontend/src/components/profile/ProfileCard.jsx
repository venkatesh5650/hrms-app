import "../../styles/dashboard/profileCard.css";

export default function ProfileCard({ profile }) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  function renderIf(label, value) {
    if (!value) return null;
    return <Row label={label} value={value} />;
  }

  function renderRoleSpecificRows() {
    switch (profile.role) {
      case "ADMIN":
        return (
          <>
            {renderIf("Organisation ID", profile.organisation_id)}
            {renderIf("Users", profile.stats?.users)}
            {renderIf("Teams", profile.stats?.teams)}
          </>
        );

      case "HR":
        return (
          <>
            {renderIf("Department", "Human Resources")}
            {renderIf("Employees Managed", profile.stats?.employees)}
          </>
        );

      case "MANAGER":
        return (
          <>
            {renderIf("Teams Managed", profile.teams?.length)}
            {renderIf("Direct Reports", profile.stats?.reports)}
          </>
        );

      default:
        return (
          <>
            {renderIf("Phone", profile.employee?.phone)}
            {renderIf(
              "Joined",
              profile.employee?.joinedAt
                ? new Date(profile.employee.joinedAt).toLocaleDateString()
                : null
            )}
          </>
        );
    }
  }

  return (
    <div className={`card profile-card role-${profile.role.toLowerCase()}`}>
      <div className="profile-header">
        <div className="avatar">{initials}</div>
        <div>
          <h3>{profile.name}</h3>
          <p className="profile-sub">{profile.role}</p>
        </div>
      </div>

      <div className="profile-list">
        {renderIf("Email", profile.email)}
        {renderRoleSpecificRows()}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="profile-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
