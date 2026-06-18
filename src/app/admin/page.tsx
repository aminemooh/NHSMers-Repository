"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {/* Sidebar placeholders based on requirements */}
        <div className="bg-gray-900 p-4 rounded border border-gray-800 col-span-1 flex flex-col gap-2">
          <button className="text-left px-3 py-2 bg-gray-800 rounded hover:bg-gray-700">Inbox</button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-800">Resources Tree</button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-800">Content Manager</button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-800">Specialties</button>
        </div>

        {/* Content area placeholder */}
        <div className="bg-gray-900 p-6 rounded border border-gray-800 col-span-1 md:col-span-3 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Dashboard</h2>
          <p className="text-gray-400">Select a tab from the sidebar to manage content.</p>
        </div>
      </div>
    </div>
  );
}
