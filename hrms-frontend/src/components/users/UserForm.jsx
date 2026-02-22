import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DemoRestrictionModal from "../common/DemoRestrictionModal";

export default function UserForm({ user, restrictedRole, onClose, onSaved }) {
  const { user: currentUser } = useAuth();
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    role: user.role || restrictedRole || "MANAGER"
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    console.log("Demo check - currentUser:", currentUser);

    // Check if user is a demo account using multiple possible flags
    const isDemo = currentUser?.accountType === "DEMO"
      || currentUser?.is_demo === true
      || currentUser?.email?.toLowerCase().includes("demo");

    if (isDemo) {
      setShowRestrictionModal(true);
      return;
    }

    try {
      if (user.id) {
        await api.put(`/users/${user.id}`, form);
      } else {
        await api.post("/users", form);
      }
      onSaved();
      onClose();
    } catch (err) {
      // Fallback: If backend returns 403 DEMO_ACCOUNT_READ_ONLY error directly
      if (err.response?.data?.code === "DEMO_ACCOUNT_READ_ONLY") {
        setShowRestrictionModal(true);
      } else {
        console.error("Save failed:", err);
      }
    }
  };

  if (showRestrictionModal) {
    return (
      <DemoRestrictionModal
        isOpen={true}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {user.id ? "Edit User" : "Create User"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {!user.id && (
            <div>
              <label className="block text-sm text-gray-500 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 pr-16"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Role: <strong className="text-gray-900">{form.role}</strong>
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium px-4 py-2 rounded-lg transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
