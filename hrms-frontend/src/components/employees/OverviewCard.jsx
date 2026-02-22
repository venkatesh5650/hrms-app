import React from "react";

export default function OverviewCard({ icon, title, count, bgColor }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:scale-[1.02] transition-all duration-200 ease-out flex items-center gap-5">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900">{count}</h3>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{title}</p>
            </div>
        </div>
    );
}
