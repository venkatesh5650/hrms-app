import React from "react";

export default function AppSpinner({ className = "" }) {
    // Use border-solid explicitly to avoid Tailwind preflight issues
    return (
        <div
            className={`border-solid h-8 w-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin ${className}`}
        ></div>
    );
}
