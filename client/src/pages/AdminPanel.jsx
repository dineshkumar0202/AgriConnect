import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminPanel = () => {
  const { strings, user } = useApp();
  const [stats, setStats] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    imageUrl: "",
    source: "Admin",
    link: ""
  });

  const loadData = async () => {
    const [s, sellersRes, buyersRes] = await Promise.all([
      axios.get(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      }),
      axios.get(`${API_BASE}/api/admin/sellers`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      }),
      axios.get(`${API_BASE}/api/admin/buyers`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
    ]);
    setStats(s.data);
    setSellers(sellersRes.data);
    setBuyers(buyersRes.data);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadData();
    }
  }, [user]);

  const handleNewsChange = (e) => {
    setNewsForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submitNews = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/api/news`, newsForm, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    setNewsForm({ title: "", summary: "", imageUrl: "", source: "Admin", link: "" });
  };

  if (!user || user.role !== "admin") return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <span>🛠</span> {strings.adminPanel}
      </h2>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {strings.totalUsers}
          </p>
          <p className="text-2xl font-semibold">{stats?.totalUsers ?? "-"}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {strings.totalSellers}
          </p>
          <p className="text-2xl font-semibold">{stats?.totalSellers ?? "-"}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {strings.totalPosts}
          </p>
          <p className="text-2xl font-semibold">{stats?.totalPosts ?? "-"}</p>
        </div>
      </div>

      {/* Lists + News form */}
      <div className="grid md:grid-cols-[2fr,1.5fr] gap-4">
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-sm mb-2">{strings.sellerList}</h3>
          <table className="w-full text-xs md:text-sm mb-3">
            <thead className="text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left py-1 pr-2">#</th>
                <th className="text-left py-1 pr-2">{strings.name}</th>
                <th className="text-left py-1 pr-2">{strings.email}</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s, idx) => (
                <tr
                  key={s._id}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="py-1 pr-2">{idx + 1}</td>
                  <td className="py-1 pr-2">{s.name}</td>
                  <td className="py-1 pr-2">{s.email}</td>
                </tr>
              ))}
              {!sellers.length && (
                <tr>
                  <td colSpan={3} className="py-2 text-slate-500">
                    No sellers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <h3 className="font-semibold text-sm mb-2">{strings.buyerList}</h3>
          <table className="w-full text-xs md:text-sm">
            <thead className="text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left py-1 pr-2">#</th>
                <th className="text-left py-1 pr-2">{strings.name}</th>
                <th className="text-left py-1 pr-2">{strings.email}</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b, idx) => (
                <tr
                  key={b._id}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="py-1 pr-2">{idx + 1}</td>
                  <td className="py-1 pr-2">{b.name}</td>
                  <td className="py-1 pr-2">{b.email}</td>
                </tr>
              ))}
              {!buyers.length && (
                <tr>
                  <td colSpan={3} className="py-2 text-slate-500">
                    No buyers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={submitNews} className="card space-y-2">
          <h3 className="font-semibold text-sm mb-1">{strings.createNews}</h3>
          <input
            name="title"
            value={newsForm.title}
            onChange={handleNewsChange}
            placeholder="Headline"
            className="input"
            required
          />
          <textarea
            name="summary"
            value={newsForm.summary}
            onChange={handleNewsChange}
            placeholder="Short summary"
            className="input h-24"
            required
          />
          <input
            name="imageUrl"
            value={newsForm.imageUrl}
            onChange={handleNewsChange}
            placeholder="Image URL"
            className="input"
          />
          <input
            name="source"
            value={newsForm.source}
            onChange={handleNewsChange}
            placeholder="Source"
            className="input"
          />
          <input
            name="link"
            value={newsForm.link}
            onChange={handleNewsChange}
            placeholder="Article link"
            className="input"
          />
          <button type="submit" className="btn-primary w-full">
            Save News
          </button>
        </form>
      </div>

      {/* Activity */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
            <span>📊</span> {strings.sellerActivity}
          </h3>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-xs">
            {stats?.latestPosts?.map((p) => (
              <div
                key={p._id}
                className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 py-1"
              >
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {p.seller?.name} ({p.seller?.email}) • ₹ {p.pricePerKg} / Kg •{" "}
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {!stats?.latestPosts?.length && (
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                No seller activity yet.
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
            <span>💬</span> {strings.buyerActivity}
          </h3>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-xs">
            {stats?.latestComments?.map((c) => (
              <div
                key={c._id}
                className="border-b border-slate-100 dark:border-slate-800 py-1"
              >
                <p className="font-semibold">
                  {c.user?.name}{" "}
                  <span className="text-[11px]">({c.user?.email})</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-300">
                  on {c.post?.title}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-200">{c.text}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {!stats?.latestComments?.length && (
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                No buyer comments yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
