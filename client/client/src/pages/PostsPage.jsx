import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";
import PostCard from "../components/PostCard.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PostsPage = () => {
  const { strings } = useApp();
  const [posts, setPosts] = useState([]);

  const load = async () => {
    const res = await axios.get(`${API_BASE}/api/posts?limit=20`);
    setPosts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <span>🧺</span> {strings.todaysPosts}
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
    </main>
  );
};

export default PostsPage;
