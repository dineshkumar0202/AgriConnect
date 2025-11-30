import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useApp } from "../context.jsx";
import { Upload, PlusCircle, Package, MapPin, Phone, Trash2, CheckCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const SellerPanel = () => {
  const { strings, user } = useApp();

  const [form, setForm] = useState({
    type: "vegetable",
    title: "",
    description: "",
    pricePerKg: "",
    extraPrice: "",
    quantityKg: "",
    locationText: "",
    liveLocationUrl: "",
    availableDate: "",
    sellerPhone: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyPosts = async () => {
    const res = await axios.get(`${API_BASE}/api/posts/my`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    setMyPosts(res.data);
  };

  useEffect(() => {
    if (user?.role === "seller") loadMyPosts();
  }, [user]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      if (imageFile) fd.append("image", imageFile);

      await axios.post(`${API_BASE}/api/posts`, fd, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setForm({
        type: "vegetable",
        title: "",
        description: "",
        pricePerKg: "",
        extraPrice: "",
        quantityKg: "",
        locationText: "",
        liveLocationUrl: "",
        availableDate: "",
        sellerPhone: ""
      });
      setImageFile(null);
      await loadMyPosts();
      toast.success("Post created successfully");
    } catch (err) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const togglePost = async (id) => {
    await axios.patch(
      `${API_BASE}/api/posts/${id}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );
    await loadMyPosts();
    toast.success("Post status updated");
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await axios.delete(`${API_BASE}/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    loadMyPosts();
    toast.success("Post deleted");
  };

  if (!user || user.role !== "seller") return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-14 space-y-10">
      
      {/* ------------------ HEADER ------------------ */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl p-6 shadow-lg flex items-center justify-between animate-fade-up">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">👨‍🌾</span> Seller Dashboard
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Manage your agriculture posts and sales
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* ------------------ CREATE POST CARD ------------------ */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl 
            border border-slate-200 dark:border-slate-700 space-y-5 
            backdrop-blur-lg animate-slide-up
          "
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <PlusCircle size={20} className="text-emerald-600" /> Create New Post
          </h3>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold">Product Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input"
              >
                <option value="vegetable">Vegetable</option>
                <option value="fruit">Fruit</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Available Date</label>
              <input
                type="date"
                name="availableDate"
                value={form.availableDate}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <input
            name="sellerPhone"
            value={form.sellerPhone}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="input"
            required
          />

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="input"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the product..."
            className="input h-24"
          />

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="pricePerKg"
              value={form.pricePerKg}
              onChange={handleChange}
              placeholder="₹/Kg"
              className="input"
              required
            />
            <input
              type="number"
              name="extraPrice"
              value={form.extraPrice}
              onChange={handleChange}
              placeholder="Extra ₹"
              className="input"
            />
            <input
              type="number"
              name="quantityKg"
              value={form.quantityKg}
              onChange={handleChange}
              placeholder="Qty (Kg)"
              className="input"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <Upload size={22} className="mx-auto text-emerald-600" />
            <p className="text-xs mt-1">Upload Product Image</p>
            <input type="file" onChange={handleFile} className="text-xs mt-2" />
          </div>

          <input
            name="locationText"
            value={form.locationText}
            onChange={handleChange}
            placeholder="Location"
            className="input"
            required
          />

          <input
            name="liveLocationUrl"
            value={form.liveLocationUrl}
            onChange={handleChange}
            placeholder="Google Maps URL"
            className="input"
          />

          <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all">
            {loading ? "Uploading..." : "Save Post"}
          </button>
        </form>

        {/* ------------------ POSTS LIST ------------------ */}
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <Package size={20} className="text-emerald-600" /> My Posts
          </h3>

          {myPosts.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4 animate-fade-up"
            >
              <img
                src={
                  p.imageUrl
                    ? `${API_BASE}${p.imageUrl.replace(/\\/g, "/")}`
                    : "https://via.placeholder.com/100"
                }
                className="w-20 h-20 rounded-xl object-cover shadow"
              />

              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-white">
                  {p.title}
                </p>
                <p className="text-xs text-slate-500">
                  ₹ {p.pricePerKg} / Kg • {p.quantityKg} Kg
                </p>
                <p className="text-xs flex items-center gap-1 text-slate-500">
                  <MapPin size={14} /> {p.locationText}
                </p>
                <p className="text-xs flex items-center gap-1 text-slate-500">
                  <Phone size={14} /> {p.sellerPhone}
                </p>

                <p
                  className={`text-xs font-semibold mt-1 ${
                    p.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => togglePost(p._id)}
                  className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                >
                  Toggle
                </button>

                <button
                  onClick={() => deletePost(p._id)}
                  className="px-3 py-1 rounded-full text-xs bg-red-500 text-white hover:bg-red-400 transition flex items-center gap-1"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}

          {!myPosts.length && (
            <p className="text-sm text-slate-500">No posts created yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SellerPanel;
