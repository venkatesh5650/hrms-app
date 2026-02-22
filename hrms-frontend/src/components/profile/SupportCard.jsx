import "../../styles/dashboard/supportCard.css";

export default function SupportCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded bg-gray-50 text-indigo-600 flex items-center justify-center text-sm border border-gray-100">
          💬
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-none">
          Help & Support
        </h3>
      </div>

      <div className="flex flex-col space-y-4">
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          For account access or team changes, please follow the protocol:
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 group/help">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/help:bg-indigo-400 transition-colors" />
            <span className="text-xs font-semibold text-gray-600">
              HR Representative
            </span>
          </div>
          <div className="flex items-center gap-2 group/help">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/help:bg-indigo-400 transition-colors" />
            <span className="text-xs font-semibold text-gray-600">
              Point Manager
            </span>
          </div>
        </div>

        <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            General Inquiries
          </span>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:underline cursor-pointer">
            View Docs
          </span>
        </div>
      </div>
    </div>
  );
}
