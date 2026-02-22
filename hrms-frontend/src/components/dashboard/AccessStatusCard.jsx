import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AccessStatusCard({ approvals = [], loading }) {
    // 1. Simple Lifecycle Logic
    const hrSubmitted = true; // Implicitly true if they can log in to see this
    const managerApproved = approvals.some(a => a.type === "CREATE" && a.status === "APPROVED");
    const adminActive = approvals.some(a => a.type === "LOGIN_ACCESS" && a.status === "APPROVED");

    const steps = [
        {
            label: "HR Request Submitted",
            status: "completed",
            desc: "Onboarding initiated"
        },
        {
            label: "Manager Approved",
            status: managerApproved ? "completed" : "pending",
            desc: managerApproved ? "Resource allocated" : "Pending Team Lead"
        },
        {
            label: "Admin Access Granted",
            status: adminActive ? "completed" : "pending",
            desc: adminActive ? "Identity provisioned" : "System activation pending"
        }
    ];

    const getStatusBadge = () => {
        if (adminActive) return { text: "Credentials Issued", color: "bg-emerald-50 text-emerald-600 border-emerald-100" };
        if (managerApproved) return { text: "Pending Admin", color: "bg-blue-50 text-blue-600 border-blue-100" };
        return { text: "Pending Manager", color: "bg-amber-50 text-amber-600 border-amber-100" };
    };

    const badge = getStatusBadge();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 shadow-sm p-6 w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm border border-indigo-100">
                        <CheckCircle2 size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-none">Access Lifecycle</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${badge.color}`}>
                    {badge.text}
                </span>
            </div>

            <div className="flex flex-col gap-5 flex-1 justify-center">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-gray-100" />
                                <div className="h-2 w-24 bg-gray-100 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${step.status === "completed"
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "bg-white border-gray-200 text-gray-300"
                                    }`}>
                                    {step.status === "completed" ? (
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                    )}
                                </div>
                                {idx !== steps.length - 1 && (
                                    <div className={`w-0.5 flex-1 my-1 transition-colors duration-300 ${step.status === "completed" && steps[idx + 1].status === "completed"
                                        ? "bg-emerald-500"
                                        : "bg-gray-100"
                                        }`} />
                                )}
                            </div>
                            <div className="pb-4">
                                <h4 className={`text-xs font-bold leading-none mb-1 transition-colors ${step.status === "completed" ? "text-gray-900" : "text-gray-400"
                                    }`}>
                                    {step.label}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    {step.status === "completed" ? step.desc : "Awaiting validation"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!adminActive && !loading && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2 items-start">
                    <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                        Full system access is pending final Administrator activation.
                    </p>
                </div>
            )}
        </div>
    );
}
