import { Loader2 } from "lucide-react";

/**
 * ApprovalProcessingOverlay
 * 
 * A reusable, non-blocking overlay to show processing feedback during 
 * approval actions (CREATE or LOGIN_ACCESS).
 * 
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether the overlay is shown
 * @param {string} props.type - The approval type (CREATE, LOGIN_ACCESS)
 * @param {string} props.action - The action being performed (APPROVE, REJECT)
 */
export default function ApprovalProcessingOverlay({ isVisible, type, action }) {
    if (!isVisible) return null;

    const getActionText = () => {
        const isApprove = action === "APPROVE";
        const typeLabel = type === "CREATE" ? "employee creation" : "login access";

        if (isApprove) {
            return type === "CREATE"
                ? "Approving employee creation request..."
                : "Granting login access...";
        } else {
            return type === "CREATE"
                ? "Rejecting employee creation request..."
                : "Rejecting login access...";
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Glassmorphism Backdrop (non-blocking) */}
            <div className="absolute inset-0 bg-gray-50/10 backdrop-blur-[0.5px] pointer-events-none" />

            {/* Feedback Card */}
            <div className="relative bg-white border border-gray-100 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 pointer-events-auto">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Loader2 size={24} className="animate-spin" />
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 tracking-tight">
                        Processing Approval
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                        {getActionText()}
                    </p>
                </div>
            </div>
        </div>
    );
}
