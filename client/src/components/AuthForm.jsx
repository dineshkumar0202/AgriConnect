import React, { useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AuthForm = () => {
  const { strings, login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminSecret: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { ...form };
      const res = await axios.post(API_BASE + url, payload);
      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-6 animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          {isLogin ? strings.login : strings.register}
        </h2>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-xs text-emerald-600 underline dark:text-emerald-400"
        >
          {isLogin ? strings.register : strings.login}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm mb-1">{strings.name}</label>
              <input
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm mb-1">{strings.email}</label>
          <input
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{strings.password}</label>
          <input
            type="password"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm mb-1">{strings.role}</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="user">{strings.buyer}</option>
                <option value="seller">{strings.seller}</option>
                <option value="admin">{strings.admin}</option>
              </select>
            </div>
            {form.role === "admin" && (
              <div>
                <label className="block text-sm mb-1">{strings.adminSecret}</label>
                <input
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
                  name="adminSecret"
                  value={form.adminSecret}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "..." : isLogin ? strings.login : strings.register}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;