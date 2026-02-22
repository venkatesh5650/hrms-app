import React from "react";

export default function MemberChip({ member, isManager }) {
    if (isManager) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                {member.first_name} {member.last_name}
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] items-center">
                    M
                </span>
            </span>
        );
    }

    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
            {member.first_name} {member.last_name}
        </span>
    );
}
