import React, { useState } from "react";
import { AppProvider, useApp } from "./context.jsx";
import TopBar from "./components/TopBar.jsx";
import AuthForm from "./components/AuthForm.jsx";
import Home from "./pages/Home.jsx";
import SellerPanel from "./pages/SellerPanel.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ExternalNews from "./pages/ExternalNews.jsx";
import homeImg from "./assets/home-1.png";

const InnerApp = () => {
  const { user, strings, theme } = useApp();
  const [view, setView] = useState("home");

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 text-slate-900"
      }`}
    >
      <TopBar view={view} setView={setView} />
      <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-6 pb-10">
        {!user && (
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4 animate-fade-up">
              {/* <h2 className="text-2xl md:text-3xl font-bold">
                {strings.appName}
              </h2> */}
              {/* Remove text & bullet points, add agriculture banner */}
              <div className="w-full flex justify-center mt-2">
                <img
                  src={homeImg}
                  alt="Agri Marketplace"
                  className="w-full max-w-lg rounded-2xl shadow-md object-cover"
                />
              </div>
            </div>
            <div>
              <AuthForm />
            </div>
          </div>
        )}

        {user && (
          <>
            {view === "home" && <Home />}
            {view === "news" && <ExternalNews />}
            {view === "seller" && user?.role === "seller" && <SellerPanel />}
            {view === "admin" && user?.role === "admin" && <AdminPanel />}
          </>
        )}
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <InnerApp />
  </AppProvider>
);

export default App;
