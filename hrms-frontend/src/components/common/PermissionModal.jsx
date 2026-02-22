import React from "react";

export default function PermissionModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-8 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Action Restricted
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Administrators can view teams but cannot modify ownership or assignments.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-md transition-all active:scale-[0.98]"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
}
