import React, { useState, useRef, useEffect } from "react";
import { Edit2, UserPlus, UserMinus, Users, UserX, MoreVertical } from "lucide-react";

export default function CardActionsMenu({
    onEdit,
    onAssignManager,
    onUnassignManager,
    onAssignEmployee,
    onUnassignEmployee,
    role = "EMPLOYEE",
    team,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const isAdmin = role === "ADMIN";
    const isHR = role === "HR";
    const isManager = role === "MANAGER";

    /* Close when clicking outside */
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ────────────────────────────
    // DYNAMIC VISIBILITY LOGIC
    // ────────────────────────────

    // Hide entire menu for ADMIN
    if (isAdmin) return null;

    const hasManager = !!team?.manager;
    const hasEmployees = (team?.Employees?.length || 0) > 0;

    // HR can see all applicable actions
    // Manager can only see employee actions
    const showEdit = isHR;
    const showAssignManager = isHR && !hasManager;
    const showUnassignManager = isHR && hasManager;
    const showAssignEmployee = isHR || isManager;
    const showUnassignEmployee = (isHR || isManager) && hasEmployees;

    const anyVisible = showEdit || showAssignManager || showUnassignManager || showAssignEmployee || showUnassignEmployee;
    if (!anyVisible) return null;

    const handleAction = (callback) => {
        setIsOpen(false);
        callback?.();
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* ⭐ ENTERPRISE MENU BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Team actions"
                aria-label="Open team actions menu"
                className="
                    p-1.5 rounded-md
                    text-gray-400 hover:text-gray-600
                    hover:bg-gray-100
                    transition-all duration-150
                "
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {/* ⭐ ENTERPRISE DROPDOWN */}
            {isOpen && (
                <div
                    className="
                        absolute right-0 mt-2 w-44
                        bg-white rounded-lg
                        shadow-lg border border-gray-200
                        z-30 p-1
                        origin-top-right
                        animate-scale-in
                    "
                >
                    {/* EDIT TEAM */}
                    {showEdit && (
                        <button
                            onClick={() => handleAction(onEdit)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 text-left"
                        >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                            Edit Team
                        </button>
                    )}

                    {/* MANAGER ACTIONS */}
                    {showAssignManager && (
                        <button
                            onClick={() => handleAction(onAssignManager)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 text-left"
                        >
                            <UserPlus className="w-4 h-4 text-gray-400" />
                            Assign Manager
                        </button>
                    )}

                    {showUnassignManager && (
                        <button
                            onClick={() => handleAction(onUnassignManager)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 text-left"
                        >
                            <UserMinus className="w-4 h-4 text-red-400" />
                            Unassign Manager
                        </button>
                    )}

                    {/* DIVIDER */}
                    {(showEdit || showAssignManager || showUnassignManager) && (showAssignEmployee || showUnassignEmployee) && (
                        <div className="border-t border-gray-100 my-1"></div>
                    )}

                    {/* EMPLOYEE ACTIONS */}
                    {showAssignEmployee && (
                        <button
                            onClick={() => handleAction(onAssignEmployee)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 text-left"
                        >
                            <Users className="w-4 h-4 text-gray-400" />
                            Assign Employee
                        </button>
                    )}

                    {showUnassignEmployee && (
                        <button
                            onClick={() => handleAction(onUnassignEmployee)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 text-left"
                        >
                            <UserX className="w-4 h-4 text-gray-400" />
                            Unassign Employee
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
