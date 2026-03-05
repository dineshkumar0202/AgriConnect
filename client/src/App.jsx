import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { useApp } from "./context.jsx";
import TopBar from "./components/TopBar.jsx";
import Home from "./pages/Home.jsx";
import PostsPage from "./pages/PostsPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import SellerPanel from "./pages/SellerPanel.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AuthForm from "./components/AuthForm.jsx";
 
const API_BASE = import.meta.env.VITE_API_BASE || "https://agriconnect-vhwd.onrender.com";

const App = () => {
  const { view, user, setView } = useApp();

  useEffect(() => {
    // Connect to the socket server
    const socket = io(API_BASE, {
      withCredentials: true
    });

    if (user && user._id) {
       socket.emit("join", user._id);
    }

    // Existing "New broadcast post" Listener
    socket.on("new_post", (data) => {
      // Show notification popup globally when any new post arrives
      toast(
        (t) => (
          <div className="flex flex-col gap-1 items-start">
            <span className="font-bold text-emerald-700">🌾 Fresh Listing Alert!</span>
            <span className="text-sm">{data.message}</span>
            <button 
                onClick={() => {
                   setView("posts");
                   toast.dismiss(t.id);
                }}
                className="mt-1 text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-semibold hover:bg-emerald-200"
            >
              View Market
            </button>
          </div>
        ),
        { duration: 8000 }
      );
    });

    // Targeted Direct Notification Listener (Orders & Comments specific to the user)
    socket.on("personal_alert", (data) => {
       toast.success(data.message, { 
           duration: 8000, 
           style: { background: "#0B1116", color: "#fff", border: "1px solid #1C2632" } 
       });
    });

    return () => socket.disconnect();
  }, [user]);

  const renderView = () => {
    if (view === "login") return <AuthForm mode="login" />;
    if (view === "register") return <AuthForm mode="register" />;

    if (view === "posts") return <PostsPage />;
    if (view === "news") return <NewsPage />;
    if (view === "seller" && user?.role === "seller") return <SellerPanel />;
    if (view === "admin" && user?.role === "admin") return <AdminPanel />;

    return <Home />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:bg-[#070B0E] dark:from-[#070B0E] dark:via-[#070B0E] dark:to-[#070B0E] transition-colors duration-500">
      <TopBar />
      {renderView()}
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
