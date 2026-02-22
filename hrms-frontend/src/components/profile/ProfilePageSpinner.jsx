import React from "react";
import AppSpinner from "../common/AppSpinner";

export default function ProfilePageSpinner() {
    return (
        <div className="flex flex-col justify-center items-center py-24" style={{ minHeight: "200px" }}>
            <AppSpinner />
        </div>
    );
}
