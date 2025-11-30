import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";
import {
  Newspaper,
  Clock,
  ArrowUpRight,
  Flower2,
  Sprout,
  Leaf,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const NewsPage = () => {
  const { strings } = useApp();
  const [news, setNews] = useState([]);

  const load = async () => {
    const res = await axios.get(`${API_BASE}/api/news?limit=20`);
    setNews(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Banner */}
      <section className="relative w-full py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1300971/pexels-photo-1300971.jpeg')] bg-cover bg-center opacity-30 dark:opacity-20" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-900/40 px-4 py-2 rounded-full shadow backdrop-blur">
            <Leaf className="text-emerald-600 dark:text-emerald-400" size={18} />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Fresh Agriculture Updates
            </span>
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow">
            Agriculture News & Insights
          </h1>

          <p className="max-w-lg mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base">
            Stay informed with the latest agriculture trends, market prices, new technologies, 
            farming tips, and important rural updates curated daily.
          </p>
        </div>
      </section>

      {/* News section */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <div className="flex items-center gap-3">
          <Newspaper size={24} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
            {strings.agriNews}
          </h2>
        </div>

        {news.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No news yet. Admin can add daily agriculture news from the admin page.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <article
              key={n._id}
              className="group rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/70 backdrop-blur border border-emerald-100 dark:border-emerald-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden">
                <img
                  src={n.imageUrl}
                  alt={n.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">
                  {n.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                  {n.summary}
                </p>

                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Sprout size={14} />
                    <span>{n.source || "Unknown"}</span>
                  </div>

                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Read <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default NewsPage;
