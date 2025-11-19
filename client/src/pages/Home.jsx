import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";
import PostCard from "../components/PostCard.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = () => {
  const { strings } = useApp();
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);

  const loadData = async () => {
    const [p, n] = await Promise.all([
      axios.get(`${API_BASE}/api/posts?limit=20`),
      axios.get(`${API_BASE}/api/news?limit=20`)
    ]);
    setPosts(p.data);
    setNews(n.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <section className="grid md:grid-cols-[2fr,1fr] gap-4 md:gap-6">
        <div className="space-y-3">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <span>🧺</span> {strings.latestPosts}
          </h2>
          <div className="grid gap-3">
            {posts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
            {posts.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                No posts yet. Ask nearby farmers to join!
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <span>📰</span> {strings.agriNews}
          </h2>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {news.map((n) => (
              <article key={n._id} className="card p-3 flex flex-col gap-2 animate-fade-up">
                <div className="flex gap-3">
                  {n.imageUrl && (
                    <img
                      src={n.imageUrl}
                      alt={n.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-semibold line-clamp-2">{n.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                      {n.summary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{n.source}</span>
                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 underline dark:text-emerald-400"
                    >
                      Read
                    </a>
                  )}
                </div>
              </article>
            ))}
            {news.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Admin can add daily agriculture news from the admin panel.
              </p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Home;