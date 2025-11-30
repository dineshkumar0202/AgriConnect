import React from "react";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context.jsx";
import TopBar from "./components/TopBar.jsx";
import Home from "./pages/Home.jsx";
import PostsPage from "./pages/PostsPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import SellerPanel from "./pages/SellerPanel.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AuthForm from "./components/AuthForm.jsx";

const App = () => {
  const { view, user } = useApp();

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      <TopBar />
      {renderView()}
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
