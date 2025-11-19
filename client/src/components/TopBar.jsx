import React from "react";
import { useApp } from "../context.jsx";

const TopBar = ({ view, setView }) => {
  const { theme, setTheme, language, setLanguage, strings, user, logout } = useApp();

  const navItem = (id, label) => (
    <button
      key={id}
      onClick={() => setView(id)}
      className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition ${
        view === id
          ? "bg-emerald-500 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="w-full sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:bg-slate-900/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="size-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-400 flex items-center justify-center shadow-lg">
            <span className="font-black text-slate-900">Ag</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold">{strings.appName}</h1>
            {/* <p className="text-xs md:text-sm text-slate-500 dark:text-slate-300">
              {strings.tagline}
            </p> */}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 hidden md:flex items-center justify-center gap-2">
          {navItem("home", strings.home)}
          {navItem("news", strings.globalNews)}

          {/* SHOW ONLY IF USER ROLE MATCHES */}
          {user?.role === "seller" && navItem("seller", strings.sellerPanel)}
          {user?.role === "admin" && navItem("admin", strings.adminPanel)}
        </div>

        {/* Tools (Theme, Language & User Info) */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn-outline !px-3 !py-1.5 text-xs md:text-sm"
          >
            {theme === "dark" ? "☀ " + strings.light : "🌙 " + strings.dark}
          </button>

          {/* Language Switch */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-xs md:text-sm rounded-full px-3 py-1.5 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
          >
            <option value="en">{strings.english}</option>
            <option value="ta">{strings.tamil}</option>
          </select>

          {/* If logged in → Show name + logout */}
          {user && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-slate-500 dark:text-slate-300">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-[11px] text-red-500 hover:underline"
              >
                {strings.logout}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-3 pb-2 flex gap-2 overflow-x-auto font-bold">
          {navItem("home", strings.home)}
          {navItem("news", strings.globalNews)}
          {user?.role === "seller" && navItem("seller", strings.sellerPanel)}
          {user?.role === "admin" && navItem("admin", strings.adminPanel)}
        </div>
      )}
    </header>
  );
};

export default TopBar;
