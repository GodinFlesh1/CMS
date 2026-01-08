import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthForm = ({ isAdmin = false }) => {
  const location = useLocation(); // optional: detect path if not passed via prop
  const adminFromPath = location.pathname.startsWith("/admin");
  const adminMode = isAdmin || adminFromPath;

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(adminMode ? "manager" : "consumer"); // default role on signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiBase = "/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let url = "";
      let body = {};

      if (mode === "login") {
       
        url = adminMode ? `${apiBase}/admin/login` : `${apiBase}/login`;
        body = { email, password };
      } else {
       
        url = `${apiBase}/register`;
        body = { email, password, role };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

     
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "manager") navigate("/manager/dashboard");
      else navigate("/consumer/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          {mode === "login" ? (adminMode ? "Admin Sign in" : "Log in to your account") : "Create an account"}
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          {adminMode ? "Admin / Manager portal" : `${role.charAt(0).toUpperCase() + role.slice(1)} portal`}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300"
                >
                  {/* Only allow admin creation via admin route (you can enforce on backend as well) */}
                  <option value="consumer">Consumer</option>
                  <option value="manager">Manager</option>
                  {adminMode && <option value="admin">Admin</option>}
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>
              Not a member?{" "}
              <button onClick={() => setMode("signup")} className="font-semibold text-indigo-600 hover:text-indigo-500">
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
