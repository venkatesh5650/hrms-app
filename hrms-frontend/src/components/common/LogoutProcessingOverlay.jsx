export default function LogoutProcessingOverlay() {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm"
            style={{ animation: "fadeIn 200ms ease-out" }}
            aria-live="assertive"
            aria-label="Logging out"
        >
            <div className="flex items-center gap-3 bg-white/90 rounded-2xl border border-gray-200 shadow-lg px-6 py-4 backdrop-blur-sm">
                {/* Spinner */}
                <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin flex-shrink-0" />
                <p className="text-[13px] font-semibold text-gray-700 tracking-tight whitespace-nowrap">
                    Logging you out securely…
                </p>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
