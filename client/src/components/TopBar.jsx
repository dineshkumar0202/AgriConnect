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
      onClick={() => {
        setView(id);
        setMobileOpen(false); // Auto close mobile nav on selection
      }}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition ${
        view === id
          ? "bg-emerald-600 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#1C2632] dark:hover:text-white"
      }`}
    >
      <Icon size={18} />
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
    <header className="w-full sticky top-0 z-40 bg-white dark:bg-[#0B1116] border-b border-transparent dark:border-[#1C2632]">
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
            className="p-2 rounded-lg bg-slate-200 dark:bg-[#182329] dark:text-slate-200"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Switch */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-[#182329] text-sm dark:text-slate-200"
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
          className="md:hidden p-2 bg-slate-200 dark:bg-[#182329] dark:text-slate-200 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-[60px] inset-x-0 mx-4 mt-2 p-3 bg-white dark:bg-[#0B1116] border border-slate-200 dark:border-[#1C2632] rounded-2xl shadow-2xl z-50 animate-fade-up">
          <div className="flex flex-col gap-1">{navItems}</div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-slate-100 dark:bg-[#1C2632] text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-[#202E36] transition-colors"
            >
              {theme === "dark" ? "🌙 Dark" : "☀ Light"}
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#1C2632] text-slate-700 dark:text-slate-200 font-semibold text-sm appearance-none cursor-pointer outline-none hover:bg-slate-200 dark:hover:bg-[#202E36] transition-colors"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="en">EN</option>
              <option value="ta">TA</option>
            </select>
          </div>

          <div className="mt-3">
             {!user ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setView("login"); setMobileOpen(false); }}
                    className="flex-1 px-3 py-3 bg-emerald-100 text-emerald-700 font-bold rounded-xl active:scale-[0.98] transition-transform"
                  >
                    {strings.login}
                  </button>
                  <button
                    onClick={() => { setView("register"); setMobileOpen(false); }}
                    className="flex-1 px-3 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-transform"
                  >
                    {strings.register}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-[#EF4444] text-white font-bold rounded-xl active:scale-[0.98] transition-transform hover:bg-red-600 shadow-sm"
                >
                  <LogOut size={16} />
                  {strings.logout}
                </button>
              )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
