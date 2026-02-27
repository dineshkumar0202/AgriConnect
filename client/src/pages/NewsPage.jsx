import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context.jsx";
import { Search, Clock, Share2, Bookmark, MoreVertical, FileText, Grid } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const NewsPage = () => {
  const { strings } = useApp();
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);

  const load = async () => {
    const res = await axios.get(`${API_BASE}/api/news?limit=20`);
    if (res.data) {
      setNews(res.data);
      if (res.data.length > 0) {
        setSelectedNews(res.data[0]);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#070B0E] text-slate-800 dark:text-slate-200 w-full overflow-hidden font-sans transition-colors">
      {/* Sidebar ListView */}
      <aside className="w-full md:w-[380px] flex-shrink-0 border-r border-slate-200 dark:border-[#1C2632] flex flex-col bg-white dark:bg-[#0B1116] h-[calc(100vh-80px)] transition-colors">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-[#1C2632] transition-colors">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            <h2 className="font-bold text-lg text-slate-800 dark:text-white tracking-wide">Daily News</h2>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 text-[11px] font-bold px-3 py-1.5 rounded-full">
            {news.length} New Articles
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-5 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="செய்திகளைத் தேடுங்கள்..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#182329] border border-slate-200 dark:border-[#202E36] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {filteredNews.map((n) => {
            const isSelected = selectedNews?._id === n._id;
            return (
              <div
                key={n._id}
                onClick={() => setSelectedNews(n)}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex gap-4 items-center group
                  ${isSelected ? "bg-slate-100 dark:bg-[#182329] border border-slate-300 dark:border-[#2D3A42] shadow-sm dark:shadow-none" : "bg-transparent border border-slate-200 dark:border-[#1C2632] hover:bg-slate-50 dark:hover:bg-[#121A21] hover:border-slate-300 dark:hover:border-[#2D3A42]"}`}
              >
                {/* Image Handle */}
                {n.imageUrl ? (
                  <img
                    src={n.imageUrl.startsWith("http") || n.imageUrl.includes("cloudinary.com") ? n.imageUrl : `${API_BASE}/${n.imageUrl.replace(/\\/g, "/")}`}
                    alt={n.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-[#1C2632] flex-shrink-0 border border-slate-200 dark:border-transparent" />
                )}
                
                <div className="flex-1 min-w-0 pr-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500 mb-1 block tracking-wider">
                    {n.source || "NEWS"}
                  </span>
                  <h3 className={`text-xs md:text-sm font-semibold mb-2 leading-tight line-clamp-2 ${isSelected ? "text-emerald-900 dark:text-white" : "text-slate-700 dark:text-slate-300 group-hover:text-emerald-900 dark:group-hover:text-white"}`}>
                    {n.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredNews.length === 0 && (
             <p className="text-sm text-slate-500 text-center py-6">No articles found.</p>
          )}
        </div>
        
        {/* Footer actions or Grid View toggle */}
        <div className="p-4 flex flex-col items-center">
             {/* Small absolute bottom overlay or fixed item depending on preference */}
             <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-[#182329] px-5 py-2 rounded-full border border-slate-300 dark:border-[#202E36] shadow-md dark:shadow-none">
                <Grid className="w-4 h-4" />
                <span>Grid View</span>
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070B0E] relative h-[calc(100vh-80px)] custom-scrollbar transition-colors">
        {selectedNews ? (
          <article className="max-w-4xl mx-auto pb-16">
            <div className="relative h-[250px] md:h-[420px] w-full">
               <img
                  src={selectedNews.imageUrl ? (selectedNews.imageUrl.startsWith("http") || selectedNews.imageUrl.includes("cloudinary") ? selectedNews.imageUrl : `${API_BASE}/${selectedNews.imageUrl.replace(/\\/g, "/")}`) : "https://via.placeholder.com/800x400"}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Dark gradient overlay going upwards, remains dark even in light mode so white text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent dark:from-[#070B0E] dark:via-[#070B0E]/70 dark:to-[#070B0E]/10" />
               
                {/* Title inside the banner area at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 mb-2">
                  <span className="inline-block px-3 py-1 mb-4 bg-emerald-600 font-bold uppercase tracking-wider text-white text-[10px] rounded-sm shadow-md">
                    {selectedNews.source || "TECHNOLOGY & TRAINING"}
                  </span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-lg max-w-3xl">
                    {selectedNews.title}
                  </h1>
                </div>
            </div>

            <div className="px-6 md:px-10 mt-2">
              {/* Author & Action Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#1C2632] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#182329] flex items-center justify-center border border-slate-200 dark:border-[#202E36] overflow-hidden">
                    <span className="text-emerald-600 dark:text-emerald-500 text-lg">👩‍🌾</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">விவசாய செய்திகள்</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {selectedNews.createdAt ? new Date(selectedNews.createdAt).toLocaleDateString() : "Just now"} • 4 நிமிடம் வாசிப்பு
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                  <button className="p-2 rounded-full hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-[#182329] dark:hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-[#182329] dark:hover:text-emerald-500 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-[#182329] dark:hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="mt-8">
                <p className="text-base md:text-lg leading-relaxed mb-8 font-medium text-slate-700 dark:text-slate-200">
                  {selectedNews.summary}
                </p>

                {/* Example of extended content block for realism */}
                <div className="bg-white dark:bg-[#0B1116] p-6 rounded-2xl border border-slate-200 dark:border-[#1C2632] shadow-sm dark:shadow-none transition-colors">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">பயிற்சியின் முக்கிய அம்சங்கள்:</h3>
                  <ul className="space-y-4 text-sm md:text-base text-slate-600 dark:text-slate-300">
                    <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5">•</span>
                        <span>வறட்சியைத் தாங்கும் பயிர் சாகுபடி முறைகள்.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5">•</span>
                        <span>கிடைக்கக்கூடிய அரசு மானியங்களை பெறுவதற்கான வழிகாட்டுதல்.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5">•</span>
                        <span>ட்ரோன் போன்ற நவீன கருவிகளை விவசாயத்தில் பயன்படுத்துதல்.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5">•</span>
                        <span>அறுவடைக்கு பின் விளைபொருட்களை பதப்படுத்தும் முறைகள்.</span>
                    </li>
                  </ul>
                </div>

                {selectedNews.link && (
                   <div className="mt-8">
                     <a 
                       href={selectedNews.link} 
                       target="_blank" 
                       rel="noreferrer" 
                       className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full transition-colors shadow-lg shadow-emerald-500/20"
                     >
                       Read Full Article
                     </a>
                   </div>
                )}
              </div>
            </div>
          </article>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 min-h-[500px]">
             <FileText className="w-16 h-16 mb-4 opacity-50 text-slate-300 dark:text-slate-600" />
             <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Select an article to read</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPage;
