import "../../styles/dashboard/capabilitiesCard.css";

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

export default function CapabilitiesCard({ capabilities }) {
  // Common HRMS capabilities mappings
  const groups = {
    Operational: ["canViewEmployees", "canEditEmployees", "canApproveRequests", "canManageAttendance"],
    Governance: ["canManageTeams", "canViewLogs", "canExportReports", "canManagePolicies"],
    Security: ["canManageUsers", "canAssignRoles", "canAccessAdminPanel", "canAuditSystem"]
  };

  const groupedCapabilities = Object.entries(groups).map(([groupName, keys]) => {
    const caps = keys
      .filter(key => capabilities.hasOwnProperty(key))
      .map(key => ({
        key,
        label: formatLabel(key),
        allowed: capabilities[key]
      }));
    return { groupName, caps };
  }).filter(g => g.caps.length > 0);

  // Group the rest as "System"
  const specifiedKeys = Object.values(groups).flat();
  const otherCaps = Object.entries(capabilities)
    .filter(([key]) => !specifiedKeys.includes(key))
    .map(([key, value]) => ({
      key,
      label: formatLabel(key),
      allowed: value
    }));

  if (otherCaps.length > 0) {
    groupedCapabilities.push({ groupName: "System", caps: otherCaps });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-50 text-indigo-600 flex items-center justify-center text-sm border border-gray-100">
            🔒
          </div>
          <h3 className="text-sm font-bold text-gray-900 leading-none">System Access</h3>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {groupedCapabilities.map((group) => (
          <div key={group.groupName} className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none border-b border-gray-50 pb-2">
              {group.groupName}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {group.caps.map((cap) => (
                <div key={cap.key} className="flex items-center justify-between group/cap">
                  <span className="text-xs font-semibold text-gray-600 group-hover/cap:text-gray-900 transition-colors">
                    {cap.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${cap.allowed
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
                      : "bg-gray-50 text-gray-400 border border-gray-100 opacity-60"
                      }`}
                  >
                    {cap.allowed ? "ALLOWED" : "LOCKED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {groupedCapabilities.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs font-medium text-gray-400 italic">Standard system access granted</p>
          </div>
        )}
      </div>
    </div>
  );
}
