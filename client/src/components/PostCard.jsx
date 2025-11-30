import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useApp } from "../context.jsx";
import {
  Heart,
  MessageCircle,
  Phone,
  MapPin,
  User,
  ArrowLeft,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PostFullPage = ({ post, onBack }) => {
  const { strings, user } = useApp();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyMap, setReplyMap] = useState({});

  // Load comments
  const loadComments = async () => {
    const res = await axios.get(`${API_BASE}/api/comments/post/${post._id}`);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, [post._id]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await axios.post(
      `${API_BASE}/api/comments`,
      { postId: post._id, text: newComment },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    setNewComment("");
    setComments((prev) => [...prev, res.data]);
  };

  // Reply
  const handleReply = async (commentId) => {
    const reply = replyMap[commentId];
    if (!reply?.trim()) return;

    const res = await axios.patch(
      `${API_BASE}/api/comments/${commentId}/reply`,
      { reply },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? res.data : c))
    );

    setReplyMap((prev) => ({ ...prev, [commentId]: "" }));
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-white">
      
      {/* BACK BUTTON */}
      <div className="p-4 flex items-center gap-2 cursor-pointer" onClick={onBack}>
        <ArrowLeft size={22} />
        <span className="text-sm">Back</span>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6 p-4">

        {/* LEFT : FULL IMAGE */}
        <div className="w-full h-[70vh] bg-black rounded-xl overflow-hidden">
          <img
            src={
              post.imageUrl
                ? `${API_BASE}${post.imageUrl.replace(/\\/g, "/")}`
                : "https://images.pexels.com/photos/5945901/pexels-photo-5945901.jpeg"
            }
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT : DETAILS */}
        <div className="space-y-6">

          {/* SELLER INFO */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-xl">
              👨‍🌾
            </div>
            <div>
              <p className="font-semibold text-lg">{post.seller?.name}</p>
              <p className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <MapPin size={14} /> {post.locationText}
              </p>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold">{post.title}</h2>

          {/* DESCRIPTION */}
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {post.description}
          </p>

          {/* PRICE BOX */}
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl space-y-1 border border-emerald-200 dark:border-emerald-800">
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              ₹ {post.pricePerKg} / Kg
            </p>
            <p className="text-sm">
              Quantity: <strong>{post.quantityKg} Kg</strong>
            </p>
            {post.extraPrice && (
              <p className="text-sm">Extra Price: ₹ {post.extraPrice}</p>
            )}
            {post.availableDate && (
              <p className="text-sm">
                Available On: {new Date(post.availableDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* CALL BUTTON */}
          {post.sellerPhone && (
            <a
              href={`tel:${post.sellerPhone}`}
              className="block py-3 text-center bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-500 transition"
            >
              Call Seller ({post.sellerPhone})
            </a>
          )}

          {/* COMMENTS */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle size={18} /> Comments
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">

              {comments.map((c) => (
                <div key={c._id} className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                  <p className="font-semibold">
                    {c.user?.name}{" "}
                    <span className="text-[10px] text-slate-500">
                      {c.user?.email}
                    </span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">{c.text}</p>

                  {/* Seller reply */}
                  {c.sellerReply && (
                    <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-300 ml-4">
                      ↳ {c.sellerReply}
                    </p>
                  )}

                  {/* Reply box */}
                  {user?.role === "seller" &&
                    user?._id === post.seller?._id &&
                    !c.sellerReply && (
                      <div className="flex gap-2 mt-1 ml-4">
                        <input
                          value={replyMap[c._id] || ""}
                          onChange={(e) =>
                            setReplyMap((prev) => ({
                              ...prev,
                              [c._id]: e.target.value,
                            }))
                          }
                          placeholder="Reply..."
                          className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-[11px]"
                        />
                        <button
                          onClick={() => handleReply(c._id)}
                          className="px-3 text-[11px] bg-emerald-600 text-white rounded-lg"
                        >
                          OK
                        </button>
                      </div>
                    )}
                </div>
              ))}

            </div>

            {/* Add Comment */}
            {user && (
              <div className="flex gap-2 mt-3">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 bg-emerald-600 text-white rounded-full"
                >
                  Post
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFullPage;
