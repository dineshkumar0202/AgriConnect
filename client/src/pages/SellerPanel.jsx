import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useApp } from "../context.jsx";
import { UploadCloud, CheckCircle2, Eye, MessageSquare, IndianRupee, MapPin } from "lucide-react";

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
  const [stats, setStats] = useState({ views: 0, inquiries: 0, revenue: 0 });
  
  // Refactored UI: 3-step form
  const [step, setStep] = useState(1);

  const loadMyPosts = async () => {
    const res = await axios.get(`${API_BASE}/api/posts/my`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    setMyPosts(res.data);
  };

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/posts/my/stats`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  useEffect(() => {
    if (user?.role === "seller") {
       loadMyPosts();
       loadStats();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setImageFile(e.target.files[0]);
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };
  const prevStep = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
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
      setStep(1); // Reset to first step
      // Also clear the file input manually
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";

      await loadMyPosts();
      toast.success("Post created successfully");
    } catch (err) {
      console.error("Upload error:", err);
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
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 transition-colors">
      <div className="grid lg:grid-cols-[1fr,1.3fr] gap-8 items-start">
        
        {/* LEFT COLUMN: Create New Post Form */}
        <div className="bg-white dark:bg-[#0B1116] rounded-[24px] shadow-sm border border-slate-200 dark:border-[#1C2632] p-8 overflow-hidden transition-colors">
          <h2 className="text-2xl font-bold dark:text-white mb-1">Create New Post</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Reach more buyers with high-quality details.</p>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 relative">
             {/* Progress Line */}
             <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-slate-100 dark:bg-slate-800 -z-0">
                <div 
                   className="h-full bg-emerald-500 transition-all duration-300" 
                   style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
             </div>
             
             {/* Step 1 */}
             <div className="flex flex-col items-center gap-2 z-10 bg-white dark:bg-[#0B1116] px-2 transition-colors">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>1</div>
               <span className={`text-[10px] font-bold tracking-wider ${step >= 1 ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}>INFO</span>
             </div>
             
             {/* Step 2 */}
             <div className="flex flex-col items-center gap-2 z-10 bg-white dark:bg-[#0B1116] px-2 transition-colors">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>2</div>
               <span className={`text-[10px] font-bold tracking-wider ${step >= 2 ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}>PRICE</span>
             </div>
             
             {/* Step 3 */}
             <div className="flex flex-col items-center gap-2 z-10 bg-white dark:bg-[#0B1116] px-2 transition-colors">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>3</div>
               <span className={`text-[10px] font-bold tracking-wider ${step >= 3 ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}>LOCATION</span>
             </div>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : nextStep} className="space-y-5">
            {step === 1 && (
               <div className="space-y-5 animate-fade-in">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Product Type</label>
                     <select name="type" value={form.type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-colors">
                       <option value="vegetable">Vegetable</option>
                       <option value="fruit">Fruit</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Available Date</label>
                     <input type="date" name="availableDate" value={form.availableDate} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-colors [&::-webkit-calendar-picker-indicator]:dark:invert" />
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Product Title</label>
                   <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Fresh Organic Roma Tomatoes" required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors" />
                 </div>

                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Description</label>
                   <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your harvest conditions, variety, etc..." required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm h-28 resize-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors" />
                 </div>

                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 block">Upload Media</label>
                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-[#202E36] rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-[#182329] dark:hover:bg-[#121A21] transition-colors relative overflow-hidden group">
                     {imageFile ? (
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center flex-col">
                           <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                           <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{imageFile.name}</span>
                        </div>
                     ) : (
                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
                         <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2 group-hover:text-emerald-500 transition-colors" />
                         <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop or <span className="text-emerald-500 font-semibold">browse</span></p>
                       </div>
                     )}
                     <input id="file-upload" type="file" className="hidden" onChange={handleFile} />
                   </label>
                 </div>
                 <button type="submit" className="w-full py-4 mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                   Next Step
                 </button>
               </div>
            )}

            {step === 2 && (
               <div className="space-y-5 animate-fade-in">
                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Price per Kg (₹)</label>
                   <input type="number" name="pricePerKg" value={form.pricePerKg} onChange={handleChange} placeholder="e.g. 25" required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 transition-colors" />
                 </div>
                 
                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Additional Charges (Optional)</label>
                   <input type="number" name="extraPrice" value={form.extraPrice} onChange={handleChange} placeholder="e.g. 0" className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 transition-colors" />
                 </div>

                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Total Quantity (Kg)</label>
                   <input type="number" name="quantityKg" value={form.quantityKg} onChange={handleChange} placeholder="e.g. 500" required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 transition-colors" />
                 </div>

                 <div className="flex gap-3 pt-4">
                   <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-[#1C2632] hover:bg-slate-200 dark:hover:bg-[#202E36] text-slate-600 dark:text-slate-300 font-bold transition-all active:scale-[0.98]">
                     Back
                   </button>
                   <button type="submit" className="flex-1 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                     Next Step
                   </button>
                 </div>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-5 animate-fade-in">
                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Farm / Pickup Location</label>
                   <input name="locationText" value={form.locationText} onChange={handleChange} placeholder="e.g. Erode Market, Tamil Nadu" required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 transition-colors" />
                 </div>
                 
                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Live Location Map Link</label>
                   <input name="liveLocationUrl" value={form.liveLocationUrl} onChange={handleChange} placeholder="https://maps.google.com/..." className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 transition-colors" />
                 </div>

                 <div>
                   <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Contact Phone Number</label>
                   <input name="sellerPhone" value={form.sellerPhone} onChange={handleChange} placeholder="+91 9876543210" required className="w-full bg-slate-50 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white placeholder-slate-400 transition-colors" />
                 </div>

                 <div className="flex gap-3 pt-4">
                   <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-[#1C2632] hover:bg-slate-200 dark:hover:bg-[#202E36] text-slate-600 dark:text-slate-300 font-bold transition-all active:scale-[0.98]">
                     Back
                   </button>
                   <button type="submit" disabled={loading} className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50">
                     {loading ? "Publishing..." : "Publish Post"}
                   </button>
                 </div>
               </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: Dashboard & Recent Posts */}
        <div className="space-y-6">
           
           {/* Real Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white dark:bg-[#0B1116] rounded-2xl p-5 border border-slate-200 dark:border-[#1C2632] shadow-sm flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500"><Eye className="w-4 h-4" /></span>
                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Stock (Kg)</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.views.toLocaleString()}</h4>
                  <p className="text-[10px] font-bold text-emerald-500">Listed Inventory</p>
               </div>
               
               <div className="bg-white dark:bg-[#0B1116] rounded-2xl p-5 border border-slate-200 dark:border-[#1C2632] shadow-sm flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500"><MessageSquare className="w-4 h-4" /></span>
                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Orders/Inquiries</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stats.inquiries}</h4>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Lifetime transactions</p>
               </div>
               
               <div className="bg-white dark:bg-[#0B1116] rounded-2xl p-5 border border-slate-200 dark:border-[#1C2632] shadow-sm flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500"><IndianRupee className="w-4 h-4" /></span>
                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revenue</span>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">₹{stats.revenue.toLocaleString()}</h4>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Lifetime generated</p>
               </div>
           </div>

           {/* My Recent Posts List */}
           <div className="bg-white dark:bg-[#0B1116] rounded-[24px] shadow-sm border border-slate-200 dark:border-[#1C2632] p-6 lg:p-8 transition-colors">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Recent Posts</h3>
                  <div className="flex gap-2">
                     <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#182329] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     </button>
                     <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#182329] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                     </button>
                  </div>
              </div>

              <div className="space-y-0 text-sm">
                {myPosts.length === 0 ? (
                  <p className="text-slate-500 py-10 text-center">No posts created yet. Start typing on the left!</p>
                ) : (
                  myPosts.map((p, index) => (
                    <div key={p._id} className={`flex items-center justify-between py-4 ${index !== myPosts.length - 1 ? 'border-b border-slate-100 dark:border-[#1C2632]' : ''}`}>
                       
                       <div className="flex items-start gap-4 flex-1 pr-4">
                           {/* Thumbnail with Status Tag */}
                           <div className="relative flex-shrink-0">
                               <img 
                                 src={p.imageUrl ? (p.imageUrl.startsWith("http") || p.imageUrl.includes("cloudinary.com") ? p.imageUrl : `${API_BASE}/${p.imageUrl.replace(/\\/g, "/")}`) : "https://via.placeholder.com/100"} 
                                 className="w-[72px] h-[72px] lg:w-[84px] lg:h-[84px] rounded-xl object-cover border border-slate-200 dark:border-transparent opacity-95 hover:opacity-100 transition-opacity" 
                               />
                               {/* Absolute Positioned Tag Overlay */}
                               <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide shadow-sm border ${p.isActive ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-slate-400 dark:bg-slate-600 border-slate-500 text-white'} uppercase`}>
                                     {p.isActive ? "ACTIVE" : "DRAFT"}
                                  </span>
                               </div>
                           </div>

                           {/* Details */}
                           <div className="flex flex-col justify-between py-1 mt-1">
                               <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{p.title}</h4>
                               <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
                                   <span>₹{p.pricePerKg}/kg</span>
                                   <div className="flex items-center gap-1">
                                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                       <span>{p.quantityKg}kg</span>
                                   </div>
                               </div>
                               <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                                   <MapPin className="w-3 h-3" />
                                   <span className="truncate max-w-[150px]">{p.locationText}</span>
                               </div>
                           </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="flex flex-col gap-2 flex-shrink-0 min-w-[70px]">
                           <button onClick={() => togglePost(p._id)} className="w-full text-center px-2 py-1.5 border border-slate-200 dark:border-[#202E36] rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#182329] transition-colors">
                              {p.isActive ? 'Draft' : 'Publish'}
                           </button>
                           <button onClick={() => deletePost(p._id)} className="w-full text-center px-2 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                              Delete
                           </button>
                       </div>

                    </div>
                  ))
                )}
              </div>
              
              {myPosts.length > 0 && (
                <div className="pt-6 mt-4 text-center border-t border-slate-100 dark:border-[#1C2632]">
                   <button className="text-emerald-600 dark:text-emerald-500 font-bold text-sm tracking-wide hover:underline underline-offset-4 decoration-2">
                      View All Posts
                   </button>
                </div>
              )}
           </div>

        </div>
      </div>
    </section>
  );
};

export default SellerPanel;
