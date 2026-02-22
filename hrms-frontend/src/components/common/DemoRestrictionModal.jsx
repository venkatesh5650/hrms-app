import React from 'react';

export default function DemoRestrictionModal({ isOpen, onClose, message = "Write operations are disabled for demo accounts." }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Demo Account Restriction
                </h3>
                <p className="text-sm text-gray-600 mb-6 font-medium">
                    {message}
                </p>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
