import { useState } from "react";
import { Headphones, Send, CheckCircle } from "lucide-react";

export default function SelfServiceActionCard() {
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRequest = async () => {
        setIsProcessing(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsProcessing(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setShowModal(false);
        }, 2500);
    };

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
                        <p className="text-[11px] text-gray-400 mt-0.5">HR & support requests</p>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col justify-between flex-1 px-6 py-5">
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                        Need help with your account, team assignment, or HR query? Our team typically responds within 24 hours.
                    </p>

                    <button
                        onClick={() => setShowModal(true)}
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
                        onClick={() => !isProcessing && setShowModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-sm overflow-hidden">
                        <div className="p-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
                                <Headphones size={22} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Support Request</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed mb-7">
                                Your request will be routed to HR or your Manager for review. We typically respond within 24 hours.
                            </p>

                            {success ? (
                                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                                    <span className="text-[13px] font-semibold text-emerald-700">Request sent successfully!</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <button
                                        disabled={isProcessing}
                                        onClick={handleRequest}
                                        className="w-full py-3 bg-indigo-600 text-white text-[13px] font-semibold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Processing…
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} />
                                                Confirm Request
                                            </>
                                        )}
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setShowModal(false)}
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
