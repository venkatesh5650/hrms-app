import { ShieldCheck, Users, ClipboardList, LifeBuoy } from "lucide-react";

const CAPABILITIES = [
    {
        icon: <Users size={15} />,
        title: "View Assigned Teams",
        desc: "See your current team placements and collaborators",
    },
    {
        icon: <ClipboardList size={15} />,
        title: "Track Approval History",
        desc: "Monitor the status of your HR requests",
    },
    {
        icon: <ShieldCheck size={15} />,
        title: "Manage Your Profile",
        desc: "Update identity, contact, and account details",
    },
    {
        icon: <LifeBuoy size={15} />,
        title: "Request Support",
        desc: "Raise tickets with HR or your manager",
    },
];

export default function EmployeeAccessInfo() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
            {/* Card Header */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                    <ShieldCheck size={17} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">Access Scope</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Your system capabilities</p>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-4 px-6 py-5 flex-1">
                {CAPABILITIES.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {cap.icon}
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-gray-700 leading-tight">{cap.title}</p>
                            <p className="text-[12px] text-gray-400 leading-relaxed mt-0.5">{cap.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 border-t border-gray-50 pt-4">
                <p className="text-[11px] text-gray-400 italic leading-relaxed">
                    Access is provisioned for internal collaboration and self-service only.
                </p>
            </div>
        </div>
    );
}
