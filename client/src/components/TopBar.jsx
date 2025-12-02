import React, { useState } from "react";
import { useApp } from "../context.jsx";
import {
  Home,
  Newspaper,
  ShoppingBag,
  PlusCircle,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
} from "lucide-react";

const TopBar = () => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    strings,
    user,
    logout,
    view,
    setView,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);

  // ------- Role Checks -------
  const isBuyer = user?.role === "user";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  // ------- Nav Button -------
  const navButton = (id, label, Icon) => (
    <button
      key={id}
      onClick={() => setView(id)}
      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
        view === id
          ? "bg-emerald-600 text-white shadow-md"
          : "text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  // ------- Build Role-Based Nav -------
  let navItems = [navButton("home", strings.home, Home)];

  if (isBuyer) {
    navItems.push(navButton("posts", strings.todaysPosts, ShoppingBag));
    navItems.push(navButton("news", strings.todayNews, Newspaper));
  }

  if (isSeller) {
    navItems.push(navButton("posts", strings.todaysPosts, ShoppingBag));
    navItems.push(navButton("news", strings.todayNews, Newspaper));
    navItems.push(navButton("seller", strings.postCreate, PlusCircle));
  }

  if (isAdmin) {
    navItems.push(navButton("news", strings.createNews, Newspaper));
    navItems.push(navButton("admin", strings.adminPanel, User));
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-white dark:bg-slate-900 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* -------- Logo ---------- */}
        <div
          onClick={() => setView("home")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md text-white font-bold">
            Ag
          </div>
          <h1 className="text-lg font-semibold">{strings.appName}</h1>
        </div>

        {/* -------- Desktop Nav -------- */}
        <nav className="hidden md:flex items-center gap-3">{navItems}</nav>

        {/* -------- Actions -------- */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switch */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Switch */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-sm"
          >
            <option value="en">EN</option>
            <option value="ta">TA</option>
          </select>

          {/* Login / User */}
          {!user ? (
            <>
              <button
                onClick={() => setView("login")}
                className="text-sm text-emerald-600 hover:underline"
              >
                {strings.login}
              </button>
              <button
                onClick={() => setView("register")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-500"
              >
                {strings.register}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">
                {user.name}{" "}
                <span className="text-xs text-slate-500 dark:text-slate-300">
                  (
                  {user.role === "user"
                    ? "Buyer"
                    : user.role === "seller"
                    ? "Seller"
                    : user.role === "admin"
                    ? "Admin"
                    : ""}
                  )
                </span>
              </span>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded-lg"
              >
                <LogOut size={16} />
                {strings.logout}
              </button>
            </div>
          )}
        </div>

        {/* -------- Mobile Menu Button -------- */}
        <button
          className="md:hidden p-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* -------- Mobile Menu -------- */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-3 space-y-3 animate-fade-up">
          <div className="flex flex-col gap-2">{navItems}</div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800"
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800"
            >
              <option value="en">EN</option>
              <option value="ta">TA</option>
            </select>
          </div>

          {!user ? (
            <div className="flex gap-2">
              <button
                onClick={() => setView("login")}
                className="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg"
              >
                {strings.login}
              </button>
              <button
                onClick={() => setView("register")}
                className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg"
              >
                {strings.register}
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg mt-2"
            >
              <LogOut size={16} />
              {strings.logout}
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;
