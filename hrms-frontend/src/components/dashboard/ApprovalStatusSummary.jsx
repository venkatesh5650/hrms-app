import { Clock, CheckCircle2, XCircle } from "lucide-react";
import "../../styles/dashboard/approvalStatusSummary.css";

export default function ApprovalStatusSummary({ pending = 0, approved = 0, rejected = 0 }) {
  return (
    <div className="card status-card">
      <div className="card-header">
        <h3>My Requests</h3>
        <span className="subtitle">Your approval outcomes</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-50 border border-amber-100 hover:shadow-md transition-shadow cursor-pointer">
          <Clock size={20} className="text-amber-500 mb-2" />
          <span className="text-xs font-medium text-amber-600 mb-1 tracking-wide uppercase">Pending</span>
          <strong className="text-2xl font-bold text-amber-700">{pending}</strong>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 border border-green-100 hover:shadow-md transition-shadow cursor-pointer">
          <CheckCircle2 size={20} className="text-green-500 mb-2" />
          <span className="text-xs font-medium text-green-600 mb-1 tracking-wide uppercase">Approved</span>
          <strong className="text-2xl font-bold text-green-700">{approved}</strong>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <XCircle size={20} className="text-gray-400 mb-2" />
          <span className="text-xs font-medium text-gray-500 mb-1 tracking-wide uppercase">Rejected</span>
          <strong className="text-2xl font-bold text-gray-700">{rejected}</strong>
        </div>
      </div>
    </div>
  );
}
