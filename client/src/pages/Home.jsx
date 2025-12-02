import React from "react";
import { useApp } from "../context.jsx";
import {
  Tractor,
  Leaf,
  ShoppingBasket,
  PhoneCall,
  MapPin,
  Users,
} from "lucide-react";

const Home = () => {
  const { strings, user, setView } = useApp();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-12">

      {/* ===================== HERO SECTION ===================== */}
      <section className="grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div className="space-y-5 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-snug text-slate-900 dark:text-white">
            Fresh Produce.  
            <span className="text-emerald-600">Direct from Farmers</span>.
          </h1>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-200 leading-relaxed">
            A simple platform connecting local farmers and buyers with live pricing,
            direct phone calls, comments, and location-based discovery.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <Leaf size={16} className="text-emerald-600" />
              <span>Real-time price updates</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin size={16} className="text-emerald-600" />
              <span>Location-based posts</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <PhoneCall size={16} className="text-emerald-600" />
              <span>Direct calling</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Users size={16} className="text-emerald-600" />
              <span>Buyer & Seller community</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            {!user ? (
              <>
                <button
                  onClick={() => setView("register")}
                  className="btn-primary text-sm px-5 py-2 rounded-full"
                >
                  {strings.register} (Farmer / Buyer)
                </button>

                <button
                  onClick={() => setView("login")}
                  className="btn-outline text-sm px-5 py-2 rounded-full"
                >
                  {strings.login}
                </button>
              </>
            ) : (
              <button
                onClick={() => setView("posts")}
                className="btn-primary text-sm px-5 py-2 rounded-full"
              >
                View Today’s Posts
              </button>
            )}
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="relative animate-slide-up">
          <div className="absolute inset-0 -z-10 blur-2xl rounded-[30px] bg-emerald-400/20 dark:bg-emerald-700/20"></div>
          <img
            src="https://images.pexels.com/photos/1425197/pexels-photo-1425197.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Agriculture Marketplace"
            className="rounded-[26px] shadow-2xl object-cover w-full h-72 md:h-96 border border-slate-200 dark:border-slate-800"
          />
        </div>

      </section>

      {/* ===================== BOTTOM CARDS ===================== */}
      <section className="grid md:grid-cols-3 gap-6">

        {/* Farmers */}
        <div className="card animate-fade-up flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-emerald-600">
            <Tractor size={22} />
            <h3 className="font-semibold text-lg">For Farmers</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Post fresh vegetables/fruits, share your live location and price. Sell directly to buyers without middlemen.
          </p>
        </div>

        {/* Buyers */}
        <div className="card animate-fade-up flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShoppingBasket size={22} />
            <h3 className="font-semibold text-lg">For Buyers</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Discover real farmers, check today’s prices, call instantly, and buy farm-fresh produce.
          </p>
        </div>

        {/* Admin */}
        <div className="card animate-fade-up flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-emerald-600">
            <Leaf size={22} />
            <h3 className="font-semibold text-lg">For Admin</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Manage farmers, buyers, platform safety, and publish verified agriculture news posts.
          </p>
        </div>

      </section>

    </main>
  );
};

export default Home;
