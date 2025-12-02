import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const stringsEN = {
  appName: "AgriConnect",
  tagline: "Direct marketplace for farmers & buyers",
  home: "Home",
  todaysPosts: "Today's Posts",
  todayNews: "Today News",
  createNews: "Create Agri News",
  adminPanel: "Admin Panel",
  postCreate: "Post Create",
  theme: "Theme",
  language: "Language",
  login: "Login",
  register: "Register",
  logout: "Logout",
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
  name: "Name",
  email: "Email",
  phone: "Phone",
  password: "Password",
  role: "Role",
  adminSecret: "Admin Secret",
  latestPosts: "Latest Wholesale Posts",
  agriNews: "Daily Agriculture News",
  createPost: "Create Post",
  productType: "Product Type",
  vegetable: "Vegetable",
  fruit: "Fruit",
  availableDate: "Available Date",
  title: "Title",
  description: "Description",
  pricePerKg: "Price per Kg",
  quantityKg: "Quantity (Kg)",
  locationText: "Location",
  liveLocationUrl: "Live Location URL",
  save: "Save",
  myPosts: "My Posts",
  active: "Active",
  inactive: "Inactive",
  toggleActive: "Toggle Active",
  delete: "Delete",
  comments: "Comments",
  addComment: "Write a comment...",
  post: "Post",
  reply: "Reply",
  close: "Close",
  viewDetails: "View Details",
  callSeller: "Call Seller",
  sellerPanel: "Seller Panel",
  buyerActivity: "Buyer Activity",
  sellerActivity: "Seller Activity",
  totalUsers: "Total Users",
  totalSellers: "Total Sellers",
  totalPosts: "Total Posts",
  sellerList: "Seller List",
  buyerList: "Buyer List",
  createdAt: "Created At",
  light: "Light",
  dark: "Dark"
};

const stringsTA = {
  ...stringsEN,
  appName: "அக்ரி கனெக்ட்",
  tagline: "விவசாயியும் வாங்குபவரும் நேரடி இணைப்பு",
  home: "முகப்பு",
  todaysPosts: "இன்றைய பதிவுகள்",
  todayNews: "இன்றைய செய்திகள்",
  createNews: "செய்தி உருவாக்கு",
  adminPanel: "நிர்வாகம்",
  postCreate: "பதிவு சேர்",
  login: "உள் நுழை",
  register: "பதிவு செய்",
  logout: "வெளியேறு",
  buyer: "வாங்குபவர்",
  seller: "விற்பவர்",
  admin: "நிர்வாகம்",
  name: "பெயர்",
  email: "மின்னஞ்சல்",
  phone: "கைபேசி",
  password: "கடவுச்சொல்",
  role: "பங்கு"
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedUser = localStorage.getItem("user");
    const savedLang = localStorage.getItem("lang");
    if (savedTheme) setTheme(savedTheme);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const login = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setView("home");
  };

  const strings = language === "en" ? stringsEN : stringsTA;

  return (
    <AppContext.Provider
      value={{ theme, setTheme, language, setLanguage, strings, user, login, logout, view, setView }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
