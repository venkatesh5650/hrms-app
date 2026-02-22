import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import OverviewCard from "../../components/employees/OverviewCard";
import EmployeesListTable from "../../components/employees/EmployeesListTable";
import PermissionModal from "../../components/common/PermissionModal";
import ToastMessage from "../../components/common/ToastMessage";
import api from "../../services/api";



export default function EmployeesOverview() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tabs: ACTIVE, INACTIVE, ALL
    const [activeTab, setActiveTab] = useState("ACTIVE");
    const [search, setSearch] = useState("");
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const canSeeInactive = ["ADMIN", "MANAGER", "HR"].includes(user?.role);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/employees");
                const listData = Array.isArray(res.data.employees) ? res.data.employees : Array.isArray(res.data) ? res.data : [];

                // Flatten User role into top level for easier filtering and UI display
                const mappedList = listData.map(e => ({
                    ...e,
                    role: e.User?.role || "EMPLOYEE"
                }));

                setEmployees(mappedList);
            } catch (err) {
                console.error("Failed to load employees:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleToggleStatus = async (employee) => {
        try {
            if (employee.is_active) {
                await api.delete(`/employees/${employee.id}`);
                setToast({ show: true, message: "Employee inactivated successfully", type: "success" });
            } else {
                await api.put(`/employees/${employee.id}/restore`);
                setToast({ show: true, message: "Employee activated successfully", type: "success" });
            }
            setEmployees(prev => prev.map(e => e.id === employee.id ? { ...e, is_active: !employee.is_active } : e));
        } catch (err) {
            console.error("Status update failed:", err);
            if (err?.response?.status === 403) {
                setPermissionModalOpen(true);
            }
        }
    };

    const stats = useMemo(() => {
        const total = employees.length;
        const active = employees.filter(e => e.is_active).length;
        const inactive = total - active;
        return { total, active, inactive };
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        let filtered = employees;

        // Role-based + Tab filtering logic exactly as requested
        if (!canSeeInactive) {
            filtered = filtered.filter(e => e.is_active);
        } else {
            if (activeTab === "ACTIVE") filtered = filtered.filter(e => e.is_active);
            if (activeTab === "INACTIVE") filtered = filtered.filter(e => !e.is_active);
        }

        // Search filtering
        if (search.trim()) {
            const s = search.toLowerCase();
            filtered = filtered.filter(e => {
                const name = `${e.first_name || ""} ${e.last_name || ""}`.toLowerCase();
                return name.includes(s) || (e.email || "").toLowerCase().includes(s);
            });
        }

        return filtered;
    }, [employees, activeTab, search, canSeeInactive]);

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="mb-6 fade-in">
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Employees</h1>
                    {!loading && (
                        <span className="ml-3 px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                            {stats.total} {stats.total === 1 ? 'employee' : 'employees'}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Manage and view organizational directory</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
                <OverviewCard
                    title="Total Employees"
                    count={loading ? "--" : stats.total}
                    bgColor="bg-blue-50"
                    icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <OverviewCard
                    title="Active Employees"
                    count={loading ? "--" : stats.active}
                    bgColor="bg-emerald-50"
                    icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <OverviewCard
                    title="Inactive Employees"
                    count={loading ? "--" : stats.inactive}
                    bgColor="bg-gray-50"
                    icon={<svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2 fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm h-10 w-full sm:w-auto">
                    {canSeeInactive ? (
                        <>
                            {["ACTIVE", "INACTIVE", "ALL"].map(tab => {
                                const hoverClass = tab === "ACTIVE" ? "hover:bg-emerald-50 hover:text-emerald-700" : "hover:bg-gray-100 hover:text-gray-700";
                                const tooltipText = tab === "ACTIVE" ? "View active employees" : tab === "INACTIVE" ? "View inactive employees" : "View all employees";

                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        title={tooltipText}
                                        onClick={(e) => { e.preventDefault(); setActiveTab(tab); }}
                                        className={`px-5 py-1.5 flex-1 sm:flex-none text-sm font-medium rounded-md cursor-pointer transition-all duration-200 h-full flex items-center justify-center ${activeTab === tab ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100" : `text-gray-500 ${hoverClass}`}`}
                                    >
                                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                                    </button>
                                );
                            })}
                        </>
                    ) : (
                        <button type="button" title="View active employees" className="px-5 py-1.5 flex-1 sm:flex-none text-sm font-medium rounded-md bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100 cursor-default h-full flex items-center justify-center">
                            Active
                        </button>
                    )}
                </div>

                <div className="relative w-full sm:w-64 h-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full h-full pl-10 pr-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all shadow-sm bg-white text-gray-900 placeholder-gray-400"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="fade-in relative min-h-[300px]" style={{ animationDelay: '0.3s' }}>
                <EmployeesListTable
                    employees={filteredEmployees}
                    onToggleStatus={handleToggleStatus}
                    canAction={canSeeInactive}
                    isLoading={loading}
                />
            </div>

            {toast.show && (
                <ToastMessage
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: "", type: "success" })}
                />
            )}

            <PermissionModal
                isOpen={permissionModalOpen}
                onClose={() => setPermissionModalOpen(false)}
            />

            <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s ease-out backwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
