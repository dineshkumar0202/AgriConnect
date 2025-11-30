import React from "react";
import { useApp } from "../context.jsx";
import {
  Leaf,
  Sprout,
  Wheat,
  Tractor,
  TreePine,
  PhoneCall,
  MapPin,
  ShoppingBasket,
  Users,
} from "lucide-react";

const Home = () => {
  const { strings, user, setView } = useApp();

  const isBuyer = user && user.role === "user";
  const isSeller = user && user.role === "seller";
  const isAdmin = user && user.role === "admin";

  return (
    <main className="w-full min-h-screen bg-white dark:bg-slate-950">

      {/* ---------------- HERO SECTION (NEW BG + NEW CONTENT) ---------------- */}
      <section
        className="w-full h-[92vh] bg-cover bg-center bg-no-repeat relative flex items-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/5029855/pexels-photo-5029855.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 text-white space-y-6">
          <p className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-1 rounded-full text-xs tracking-wider">
            <Leaf size={16} />
            Smart Agriculture Platform
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Grow Smarter with <span className="text-emerald-400">AgriConnect</span>
          </h1>

          <p className="text-sm md:text-base max-w-xl opacity-90">
            Buy and sell fresh produce directly from real farmers.  
            Transparent prices, verified sellers, real-time marketplace.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {!user && (
              <>
                <button
                  onClick={() => setView("register")}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full font-semibold shadow-lg"
                >
                  Join the Community
                </button>
                <button
                  onClick={() => setView("login")}
                  className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/40"
                >
                  {strings.login}
                </button>
              </>
            )}

            {isBuyer && (
              <>
                <button
                  onClick={() => setView("posts")}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full font-semibold shadow-lg"
                >
                  Browse Fresh Crops
                </button>
                <button
                  onClick={() => setView("news")}
                  className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/40"
                >
                  Read Agri News
                </button>
              </>
            )}

            {isSeller && (
              <>
                <button
                  onClick={() => setView("seller")}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full font-semibold shadow-lg"
                >
                  Seller Dashboard
                </button>
                <button
                  onClick={() => setView("posts")}
                  className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/40"
                >
                  Buyer Enquiries
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => setView("admin")}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full font-semibold shadow-lg"
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => setView("news")}
                  className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/40"
                >
                  Manage News
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT SECTION (NEW CONTENT + IMAGE) ---------------- */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

          <img
            src="https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=1200"
            className="rounded-3xl shadow-xl"
            alt="Farmer holding plant"
          />

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Connecting Farmers & Buyers for a Better Future
            </h2>

            <p className="text-slate-600 dark:text-slate-300">
              AgriConnect helps farmers reach more customers while enabling buyers
              to access fresh and high-quality agricultural products directly from the source.
            </p>

            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                Direct Farmer Relationships
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                Transparent Pricing System
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                Trusted Buyer-Seller Community
              </li>
            </ul>

            <button className="px-6 py-2 rounded-full bg-emerald-600 text-white">
              Learn More →
            </button>
          </div>

        </div>
      </section>

      {/* ---------------- SERVICES SECTION (NEW CONTENT) ---------------- */}
      <section className="py-14 bg-emerald-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-10">
            Our Agriculture Marketplace Services
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* SELLER POSTING */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow hover:-translate-y-1 transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-full mb-4">
                <Tractor size={24} />
              </div>
              <h3 className="font-semibold text-lg">Sell Your Produce</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Farmers can post products quickly with images, pricing & quantity.
              </p>
            </div>

            {/* BUYER BROWSING */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow hover:-translate-y-1 transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-full mb-4">
                <Sprout size={24} />
              </div>
              <h3 className="font-semibold text-lg">Buy Fresh Crops</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Browse vegetables, fruits, grains & more from nearby farmers.
              </p>
            </div>

            {/* SMART PRICING */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow hover:-translate-y-1 transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-full mb-4">
                <ShoppingBasket size={24} />
              </div>
              <h3 className="font-semibold text-lg">Smart Price Calculator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Transparent pricing with seller add-on extras for delivery or services.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- CONTACT STRIP ---------------- */}
      <section className="bg-emerald-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3 items-center">
            <PhoneCall size={20} />
            <span className="font-medium">Need assistance? Contact your local admin.</span>
          </div>

          <div className="flex gap-3 items-center">
            <MapPin size={18} className="opacity-80" />
            <span>Smart Village Marketplace</span>

            <button
              onClick={() => setView("posts")}
              className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-full"
            >
              Explore Products
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
