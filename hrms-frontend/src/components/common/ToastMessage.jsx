import React, { useEffect } from "react";

export default function ToastMessage({ message, type = "success", onClose, duration = 2500 }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const getStyle = () => {
        switch (type) {
            case "success": return "bg-emerald-50 text-emerald-800 border-emerald-200";
            case "error": return "bg-red-50 text-red-800 border-red-200";
            default: return "bg-gray-50 text-gray-800 border-gray-200";
        }
    };

    const getIcon = () => {
        if (type === "success") {
            return (
                <svg className="w-5 h-5 text-emerald-500 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5 text-red-500 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    };

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
            <div className={`flex items-center px-4 py-3 rounded-xl shadow-lg border ${getStyle()}`}>
                {getIcon()}
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <style jsx>{`
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
