import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";
import PostDetailsModal from "./PostDetailsModal.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PostCard = ({ post }) => {
  const { strings, user } = useApp();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  const loadComments = async () => {
    const res = await axios.get(`${API_BASE}/api/comments/post/${post._id}`);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, [post._id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const res = await axios.post(
      `${API_BASE}/api/comments`,
      { postId: post._id, text: newComment },
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );
    setNewComment("");
    setComments((c) => [...c, res.data]);
  };

  const handleReply = async (commentId) => {
    const reply = replyMap[commentId];
    if (!reply?.trim()) return;
    const res = await axios.patch(
      `${API_BASE}/api/comments/${commentId}/reply`,
      { reply },
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? res.data : c))
    );
    setReplyMap((m) => ({ ...m, [commentId]: "" }));
  };

  return (
    <>
      <article className="card flex flex-col gap-3 animate-fade-up">
        <div className="flex gap-3">
          <img
            src={
              post.imageUrl
                ? `${API_BASE}${post.imageUrl.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/150"
            }
            alt={post.title}
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover flex-shrink-0"
          />

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-base md:text-lg">
                {post.title}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {post.type === "vegetable" ? "🥦" : "🍎"} {post.type}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {post.description}
            </p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ₹ {post.pricePerKg} / Kg • {post.quantityKg} Kg
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              📍 {post.locationText} • {strings.availableDate}:{" "}
              {new Date(post.availableDate).toLocaleDateString()}
            </p>
            {post.seller && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                👨‍🌾 {post.seller.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setShowDetails(true)}
            className="btn-outline flex-1 justify-center"
          >
            {strings.viewDetails}
          </button>
          {post.seller && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              👨‍🌾 {post.seller.name}
            </p>
          )}

          {post.sellerPhone && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              📞 {post.sellerPhone}
            </p>
          )}
        </div>

        <div className="mt-2 border-t border-slate-200 dark:border-slate-800 pt-2 space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {strings.comments}
          </p>

          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {comments.map((c) => (
              <div
                key={c._id}
                className="text-xs bg-slate-50 rounded-xl px-3 py-2 dark:bg-slate-800/80"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {c.user?.name}{" "}
                  <span className="text-[10px] text-slate-500">
                    {c.user?.email}
                  </span>
                </p>
                <p className="text-slate-700 dark:text-slate-200">{c.text}</p>
                {c.sellerReply && (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-300">
                    👨‍🌾 {strings.reply}: {c.sellerReply}
                  </p>
                )}

                {user?.role === "seller" &&
                  post.seller &&
                  user?._id === post.seller._id &&
                  !c.sellerReply && (
                    <div className="mt-1 flex gap-1">
                      <input
                        className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-2 py-1 text-[11px] dark:bg-slate-900 dark:border-slate-700"
                        placeholder={strings.reply}
                        value={replyMap[c._id] || ""}
                        onChange={(e) =>
                          setReplyMap((m) => ({
                            ...m,
                            [c._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => handleReply(c._id)}
                        className="text-[11px] px-2 rounded-full bg-emerald-500 text-white"
                      >
                        OK
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {user && (
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                placeholder={strings.addComment}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment} className="btn-primary px-3">
                {strings.post}
              </button>
            </div>
          )}
        </div>
      </article>

      {showDetails && (
        <PostDetailsModal post={post} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
};

export default PostCard;
