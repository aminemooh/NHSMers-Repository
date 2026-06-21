"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials as requested
    if (email === "mahfoud.mohamed.alamine13@gmail.com" && password === "131313") {
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-foreground focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-foreground focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-foreground font-bold py-2 px-4 rounded mt-2 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
