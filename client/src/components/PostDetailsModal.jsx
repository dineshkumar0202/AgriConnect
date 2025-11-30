import React from "react";
import { useApp } from "../context.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PostDetailsModal = ({ post, onClose }) => {
  const { strings } = useApp();
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-up">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {strings.close}
          </button>
        </div>

        <img
          src={
            post.imageUrl
              ? `${API_BASE}${post.imageUrl.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/600x400"
          }
          alt={post.title}
          className="w-full h-56 md:h-64 rounded-2xl object-cover mb-3"
        />

        <div className="space-y-2 text-sm">
          <p className="text-slate-700 dark:text-slate-200">{post.description}</p>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400">
            ₹ {post.pricePerKg} / Kg • {post.quantityKg} Kg
          </p>
          <p className="text-slate-600 dark:text-slate-300">📍 {post.locationText}</p>
          {post.availableDate && (
            <p className="text-slate-500 text-xs">
              {strings.availableDate}:{" "}
              {new Date(post.availableDate).toLocaleDateString()}
            </p>
          )}
          {post.seller && (
            <p className="text-slate-600 dark:text-slate-300">
              👨‍🌾 {post.seller.name}
            </p>
          )}
          {post.sellerPhone && (
            <p className="text-slate-600 dark:text-slate-300">📞 {post.sellerPhone}</p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {post.sellerPhone && (
            <a
              href={`tel:${post.sellerPhone}`}
              className="btn-primary flex-1 text-center"
            >
              {strings.callSeller}
            </a>
          )}
          {post.liveLocationUrl && (
            <a
              href={post.liveLocationUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline flex-1 justify-center"
            >
              📍 Live Map
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsModal;
