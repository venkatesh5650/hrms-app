import React, { useState } from "react";

export default function ManagerBadge({ manager }) {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!manager) {
        return (
            <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-3 py-1 font-medium">
                No manager assigned
            </span>
        );
    }

    return (
        <div
            className="relative inline-flex items-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className="bg-emerald-100 text-emerald-700 text-xs rounded-full px-3 py-1 font-medium cursor-default">
                {manager.first_name} {manager.last_name}
            </span>
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 animate-fade-in">
                    Team Manager
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
}
