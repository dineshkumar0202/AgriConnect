import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const SellerPanel = () => {
  const { strings, user } = useApp();

  const [form, setForm] = useState({
    type: "vegetable",
    title: "",
    description: "",
    pricePerKg: "",
    quantityKg: "",
    locationText: "",
    liveLocationUrl: "",
    availableDate: "",
    sellerPhone: "", 
  } );

  const [imageFile, setImageFile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyPosts = async () => {
    const res = await axios.get(`${API_BASE}/api/posts/my`, {
      headers: { Authorization: `Bearer ${user?.token}` },
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
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        type: "vegetable",
        title: "",
        description: "",
        pricePerKg: "",
        quantityKg: "",
        locationText: "",
        liveLocationUrl: "",
        availableDate: "",
        sellerPhone: "",
      });

      setImageFile(null);
      await loadMyPosts();
    } catch (err) {
      console.error("Upload error:", err);
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
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await axios.delete(`${API_BASE}/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    loadMyPosts();
  };

  if (!user || user.role !== "seller") return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 space-y-6">
      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 animate-fade-up">
        <span className="text-2xl">👨‍🌾</span> {strings.sellerPanel}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-900 
          border border-slate-200 dark:border-slate-700 space-y-4 
          transform transition-all duration-300 hover:shadow-2xl animate-fade-up"
        >
          <h3 className="text-lg font-semibold">{strings.createPost}</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">
                {strings.productType}
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input w-full py-3 px-4 rounded-xl border border-slate-300 
                dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="vegetable">{strings.vegetable}</option>
                <option value="fruit">{strings.fruit}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">
                {strings.availableDate}
              </label>
              <input
                type="date"
                name="availableDate"
                value={form.availableDate}
                onChange={handleChange}
                className="input w-full py-3 px-4 rounded-xl border border-slate-300 
                dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <input
            name="sellerPhone"
            value={form.sellerPhone}
            onChange={handleChange}
            placeholder=" Mobile Number"
            className="input w-full py-3 px-4 rounded-xl border border-slate-300 
            dark:border-slate-700 dark:bg-slate-800"
            required
          />

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter product title"
            className="input w-full py-3 px-4 rounded-xl border border-slate-300 
            dark:border-slate-700 dark:bg-slate-800"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description..."
            className="input w-full h-24 py-3 px-4 rounded-xl border border-slate-300 
            dark:border-slate-700 dark:bg-slate-800"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="pricePerKg"
              value={form.pricePerKg}
              onChange={handleChange}
              placeholder="Price per kg"
              className="input w-full py-3 px-4 rounded-xl border border-slate-300 
              dark:border-slate-700 dark:bg-slate-800"
              required
            />
            <input
              type="number"
              name="quantityKg"
              value={form.quantityKg}
              onChange={handleChange}
              placeholder="Quantity (Kg)"
              className="input w-full py-3 px-4 rounded-xl border border-slate-300 
              dark:border-slate-700 dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Upload Image</label>
            <input type="file" onChange={handleFile} className="text-xs mt-1" />
          </div>

          <input
            name="locationText"
            value={form.locationText}
            onChange={handleChange}
            placeholder="Enter location"
            className="input w-full py-3 px-4 rounded-xl border border-slate-300 
            dark:border-slate-700 dark:bg-slate-800"
            required
          />

          <input
            name="liveLocationUrl"
            value={form.liveLocationUrl}
            onChange={handleChange}
            placeholder="Google Maps link"
            className="input w-full py-3 px-4 rounded-xl border border-slate-300 
            dark:border-slate-700 dark:bg-slate-800"
          />

          <button
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 
            text-white font-semibold transition-all shadow-md"
          >
            {loading ? "Uploading..." : strings.save}
          </button>
        </form>

        {/* POSTS LIST */}
        <div className="space-y-4 animate-fade-up">
          <h3 className="text-lg font-semibold">{strings.myPosts}</h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {myPosts.map((p) => (
              <div
                key={p._id}
                className="p-4 rounded-2xl shadow-md bg-white dark:bg-slate-900 
                border border-slate-200 dark:border-slate-700 flex items-center 
                justify-between gap-4 hover:shadow-xl transition-all animate-slide-up"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      p.imageUrl
                        ? `${API_BASE}${p.imageUrl.replace(/\\/g, "/")}`
                        : "https://via.placeholder.com/100"
                    }
                    className="w-20 h-20 rounded-xl object-cover shadow-md"
                  />

                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      ₹ {p.pricePerKg} / Kg • {p.quantityKg} Kg
                    </p>
                    <p className="text-xs text-slate-500">{p.locationText}</p>
                    <p className="text-xs text-slate-500">📞 {p.sellerPhone}</p>

                    <p
                      className={`text-xs font-semibold ${
                        p.isActive ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {p.isActive ? strings.active : strings.inactive}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => togglePost(p._id)}
                    className="px-3 py-1 rounded-full text-xs border border-slate-300 
                    hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {strings.toggleActive}
                  </button>
                  <button
                    onClick={() => deletePost(p._id)}
                    className="px-3 py-1 rounded-full text-xs bg-red-500 
                    text-white hover:bg-red-400"
                  >
                    {strings.delete}
                  </button>
                </div>
              </div>
            ))}

            {!myPosts.length && (
              <p className="text-sm text-slate-500">No posts created yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerPanel;
