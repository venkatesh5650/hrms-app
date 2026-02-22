import React, { useState } from "react";
import CardActionsMenu from "./CardActionsMenu";
import PermissionModal from "../common/PermissionModal";
import { useAuth } from "../../context/AuthContext";

export default function TeamCard({
    team,
    onAction,
    openEdit,
    openAssignManager,
    openAssignEmployee,
    openUnassignEmployee,
    isExpanded,
    children,
    role: propRole,
    statusBadge,
    error,
    disabled,
}) {
    const { user } = useAuth();
    const role = propRole || user?.role;

    const [showPermissionModal, setShowPermissionModal] = useState(false);

    // Determine action capabilities based on provided props and role
    const canEdit = !!openEdit;
    const canAssignManager = !!openAssignManager;
    const canUnassignManager = (role === "HR") && !!team?.manager; // Only HR can unassign manager, and only if there is one
    const canAssignEmployee = !!openAssignEmployee;
    const canUnassignEmployee = !!openUnassignEmployee && (team?.Employees?.length > 0); // Can unassign employee only if there are employees

    const isReadOnly = !canEdit && !canAssignManager && !canUnassignManager && !canAssignEmployee && !canUnassignEmployee;

    // ⭐ INDUSTRY ACTION GUARD
    // All actions now check for disabled state and ADMIN role, then call the respective open* prop or onAction
    const handleAction = (actionType, actionFunction) => {
        if (disabled) return;
        if (role === "ADMIN") {
            setShowPermissionModal(true);
            return;
        }
        actionFunction?.();
    };

    const handleUnassignManagerAction = () => {
        if (disabled) return;
        if (role === "ADMIN") {
            setShowPermissionModal(true);
            return;
        }
        onAction("UNASSIGN_MANAGER", team);
    };

    return (
        <>
            <div
                className={`
        group relative bg-white rounded-xl border flex flex-col h-full overflow-hidden
        transition-all duration-200
        ${isExpanded
                        ? "border-indigo-200 shadow-md ring-1 ring-indigo-50"
                        : "border-gray-200 hover:shadow-md hover:-translate-y-[1px]"
                    }
        ${isReadOnly ? "demo-card" : ""}
        ${disabled ? "opacity-75 pointer-events-none" : ""}
      `}
            >
                {/* SUCCESS BADGE */}
                {statusBadge && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-400">
                            {statusBadge}
                        </span>
                    </div>
                )}

                <div className="p-6 flex flex-col grow">
                    {/* ===== HEADER ===== */}
                    <div className="flex justify-between items-start gap-4 mb-5">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {team.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[38px]">
                                {team.description || "No description provided."}
                            </p>
                        </div>

                        {/* ⭐ INDUSTRY ACTION MENU */}
                        {(canEdit || canAssignManager || canUnassignManager || canAssignEmployee || canUnassignEmployee) && (
                            <div
                                className={`
                                transition-opacity duration-200
                                ${disabled ? "opacity-20 pointer-events-none" : "opacity-40 group-hover:opacity-100"}
                                ${isReadOnly ? "opacity-30" : ""}
                            `}
                            >
                                <CardActionsMenu
                                    onEdit={canEdit ? () => handleAction("EDIT", openEdit) : undefined}
                                    onAssignManager={canAssignManager ? () => handleAction("ASSIGN_MANAGER", openAssignManager) : undefined}
                                    onUnassignManager={canUnassignManager ? handleUnassignManagerAction : undefined}
                                    onAssignEmployee={canAssignEmployee ? () => handleAction("ASSIGN_EMPLOYEE", openAssignEmployee) : undefined}
                                    onUnassignEmployee={canUnassignEmployee ? () => handleAction("UNASSIGN_EMPLOYEE", openUnassignEmployee) : undefined}
                                    role={role}
                                    team={team}
                                />
                            </div>
                        )}
                    </div>

                    {/* ===== FEEDBACK AREA ===== */}
                    {disabled && (
                        <div className="absolute top-4 right-12 z-10 flex items-center gap-2 px-2 py-1 bg-white/90 rounded border border-gray-100 shadow-sm">
                            <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Updating...</span>
                        </div>
                    )}
                    {error && !disabled && (
                        <div className="mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="text-red-600 text-xs font-semibold flex items-center gap-1.5">
                                <span className="text-[10px]">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    {/* ===== DETAILS SECTION ===== */}
                    <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
                        {/* MANAGER */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                Manager
                            </span>

                            {team.manager ? (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-emerald-100/50">
                                    {team.manager.first_name} {team.manager.last_name}
                                </span>
                            ) : (
                                <span className="text-gray-400 text-xs italic">Not assigned</span>
                            )}
                        </div>

                        {/* MEMBERS AVATAR STACK */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Members
                                </span>
                                <span className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-700 rounded-md">
                                    {team.Employees?.length || 0}
                                </span>
                            </div>

                            {!team.Employees || team.Employees.length === 0 ? (
                                <span className="text-xs text-gray-400 italic">No members yet</span>
                            ) : (
                                <div className="flex items-center -space-x-2">
                                    {team.Employees.slice(0, 3).map((e, idx) => {
                                        const initials = `${e.first_name[0]}${e.last_name[0]}`.toUpperCase();
                                        const fullName = `${e.first_name} ${e.last_name}`;

                                        return (
                                            <div
                                                key={e.id || idx}
                                                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-500 text-white text-[10px] font-semibold mix-blend-multiply ring-2 ring-white z-10 hover:z-20 transform hover:scale-110 transition-all cursor-pointer"
                                                title={fullName}
                                            >
                                                {initials}
                                            </div>
                                        );
                                    })}
                                    {team.Employees.length > 3 && (
                                        <div
                                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold ring-2 ring-white z-0"
                                            title={team.Employees.slice(3).map(e => `${e.first_name} ${e.last_name}`).join(", ")}
                                        >
                                            +{team.Employees.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== EXPANDED PANEL ===== */}
                {isExpanded && children && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                        {children}
                    </div>
                )}
            </div>

            <PermissionModal
                isOpen={showPermissionModal}
                onClose={() => setShowPermissionModal(false)}
            />
        </>
    );
}
