import React, { useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AuthForm = ({ mode }) => {
  const { strings, login, setView } = useApp();
  const isLogin = mode === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
      setView("home");
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 card animate-fade-up">
      <h2 className="text-lg md:text-xl font-semibold mb-3">
        {isLogin ? strings.login : strings.register}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm mb-1">{strings.name}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">{strings.phone}</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm mb-1">{strings.email}</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{strings.password}</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
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
                className="input"
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
                  name="adminSecret"
                  value={form.adminSecret}
                  onChange={handleChange}
                  className="input"
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
