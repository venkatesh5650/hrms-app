import React from "react";
import StatusBadge from "../common/StatusBadge";
import AppSpinner from "../common/AppSpinner";

export default function EmployeesListTable({ employees, onToggleStatus, canAction, isLoading }) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6 flex justify-center items-center py-24">
                <AppSpinner />
            </div>
        );
    }
    if (!employees?.length) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 fade-in">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-3 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn't find any employees matching those criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6 fade-in">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Employee
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Department
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Status
                            </th>
                            <th scope="col" className="relative px-6 py-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-sm border border-teal-100 group-hover:bg-teal-100 transition-colors">
                                            {(emp.first_name?.[0] || emp.name?.[0] || "?").toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {emp.first_name} {emp.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${(emp.role || "EMPLOYEE") === "ADMIN" ? "bg-purple-100 text-purple-700"
                                            : (emp.role || "EMPLOYEE") === "HR" ? "bg-indigo-100 text-indigo-700"
                                                : (emp.role || "EMPLOYEE") === "MANAGER" ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {emp.role || "EMPLOYEE"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm">
                                        {emp.Teams?.length > 0 ? (
                                            <span className="text-gray-500">{emp.Teams.map((t) => t.name).join(", ")}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">No Team Assigned</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge isActive={emp.is_active} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {canAction && (
                                        <button
                                            onClick={() => onToggleStatus(emp)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                                            title={emp.is_active ? "Inactivate Employee" : "Activate Employee"}
                                        >
                                            {emp.is_active ? (
                                                <svg className="h-5 w-5 hover:text-red-500 transition-colors text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 hover:text-emerald-500 transition-colors text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
