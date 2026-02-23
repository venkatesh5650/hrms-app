import { useState } from "react";
import { Headphones, Send, CheckCircle } from "lucide-react";
import { createSupportRequest } from "../../services/supportApi";

const CATEGORIES = [
    "Access Issue",
    "Team Change",
    "Profile Update",
    "Team Collaboration",
    "Other",
];

export default function SelfServiceActionCard() {
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    function resetForm() {
        setCategory("");
        setMessage("");
        setError("");
        setSuccess(false);
    }

    function handleOpen() {
        resetForm();
        setShowModal(true);
    }

    function handleClose() {
        if (isSubmitting) return;
        setShowModal(false);
        resetForm();
    }

    async function handleSubmit() {
        if (!category) {
            setError("Please select a category.");
            return;
        }
        if (!message.trim()) {
            setError("Please enter a message.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            await createSupportRequest({ category, message: message.trim() });
            setSuccess(true);
            // Dispatch global success toast (matches existing api.js pattern)
            window.dispatchEvent(
                new CustomEvent("show-toast", {
                    detail: "Support request submitted successfully!",
                })
            );
            setTimeout(() => {
                setShowModal(false);
                resetForm();
            }, 2200);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to submit request. Please try again.";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                {/* Card Header */}
                <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                        <Headphones size={17} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Self-Service</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">HR &amp; support requests</p>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col justify-between flex-1 px-6 py-5">
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                        Need help with your account, team assignment, or HR query? Our team
                        typically responds within 24 hours.
                    </p>

                    <button
                        onClick={handleOpen}
                        className="w-full py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
                    >
                        Request Support
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-sm overflow-hidden">
                        <div className="p-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                                <Headphones size={22} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                                Support Request
                            </h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                                Your request will be routed to HR, your Manager, or the Admin
                                team based on the category you select.
                            </p>

                            {success ? (
                                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                                    <span className="text-[13px] font-semibold text-emerald-700">
                                        Request submitted successfully!
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {/* Category dropdown */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Category
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-full text-[13px] text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all appearance-none"
                                        >
                                            <option value="">Select a category…</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Message textarea */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            disabled={isSubmitting}
                                            rows={4}
                                            placeholder="Describe your issue or request…"
                                            className="w-full text-[13px] text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Inline error */}
                                    {error && (
                                        <p className="text-[12px] text-red-600 font-medium -mt-1">
                                            {error}
                                        </p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                        className="w-full py-3 bg-indigo-600 text-white text-[13px] font-semibold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Submitting support request…
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} />
                                                Submit Request
                                            </>
                                        )}
                                    </button>

                                    <button
                                        disabled={isSubmitting}
                                        onClick={handleClose}
                                        className="w-full py-3 text-gray-500 text-[13px] font-semibold rounded-2xl hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
