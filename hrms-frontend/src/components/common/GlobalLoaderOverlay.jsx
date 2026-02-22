import React from "react";
import AppSpinner from "./AppSpinner";

export default function GlobalLoaderOverlay() {
    return (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <AppSpinner />
        </div>
    );
}
