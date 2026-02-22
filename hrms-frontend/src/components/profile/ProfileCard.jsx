import "../../styles/dashboard/profileCard.css";
import { User, Mail, Phone, Calendar, Building2 } from "lucide-react";

const ICON_MAP = {
  "Full Name": <User size={14} />,
  "Email Address": <Mail size={14} />,
  "Phone": <Phone size={14} />,
  "Joined": <Calendar size={14} />,
  "Organisation ID": <Building2 size={14} />,
};

export default function ProfileCard({ profile }) {
  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "–";

  function renderRoleSpecificRows() {
    switch (profile.role) {
      case "ADMIN":
        return (
          <>
            {renderIf("Organisation ID", profile.organisation_id)}
          </>
        );
      case "HR":
        return renderIf("Department", "Human Resources");
      case "MANAGER":
        return renderIf("Teams Managed", profile.teams?.length ?? 0);
      default:
        return (
          <>
            {renderIf("Phone", profile.employee?.phone)}
            {renderIf(
              "Joined",
              profile.employee?.joinedAt
                ? new Date(profile.employee.joinedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : null
            )}
          </>
        );
    }
  }

  function renderIf(label, value) {
    if (value === null || value === undefined || value === "") return null;
    return <Row label={label} value={value} />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Personal Details</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Primary Identity</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-5 px-6 py-5 flex-1">
        {renderIf("Full Name", profile.name)}
        {renderIf("Email Address", profile.email)}
        {renderRoleSpecificRows()}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  const icon = ICON_MAP[label];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-[14px] font-medium text-gray-800 leading-snug pl-0.5 truncate">{value}</p>
    </div>
  );
}
