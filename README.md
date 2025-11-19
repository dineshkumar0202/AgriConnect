
# Agri Marketplace v3

Full-stack project matching your requirements:

1. **Animated, mobile responsive UI**
   - Built with React + Tailwind.
   - `animate-fade-up` animation and responsive layout.
2. **Dark / Light theme fixed**
   - Theme toggle in navbar.
   - Uses Tailwind `darkMode: "class"`.
   - Theme stored in `localStorage` and applied to `<html>` element.
3. **Default 10–20 posts & news**
   - Backend:
     - `/api/posts?limit=20` -> latest active posts (default limit=20).
     - `/api/news?limit=20` -> latest news (default limit=20).
   - Frontend home page uses `?limit=20` for both.
4. **Admin login with full control panel**
   - Admin account created by registering with role=admin and `adminSecret`
     that matches `ADMIN_SECRET` in backend `.env`.
   - Admin panel shows:
     - Total users, total sellers, total posts.
     - All sellers in table format.
     - Seller activity (latest posts with seller info, time).
     - Buyer activity (latest comments with user + post + time).
     - Form to create agriculture news items that appear on home page sidebar.
5. **Seller side: post details & delete**
   - Seller Panel:
     - Create posts: type (veg/fruit), title, description, price, quantity, image URL,
       location, live location URL, available date.
     - My Posts: shows image, price, quantity, contact (seller phone), location,
       active/inactive state.
     - Buttons: toggle Active/Inactive and Delete (with confirmation).
6. **Buyer side: view seller post details**
   - Home page feed shows short cards.
   - Each card has:
     - View Details -> opens modal with image, price, quantity,
       seller name + phone, location, date, call & live map buttons.
     - Call Seller button.
   - Comment system:
     - Buyers can comment on posts (requires login).
     - Seller can reply to comments on their posts.
7. **Agriculture news using external API key**
   - New navbar page: **Global Agri News**.
   - Uses `VITE_NEWS_API_KEY` and `VITE_NEWS_API_URL` from frontend `.env`.
   - Shows external agriculture news with images, title, summary, source, time and link.

---

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth:** JWT with roles: user (buyer), seller, admin.
- **DB Models:** User, Post, Comment, News.

---

## Running the Project

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI, JWT_SECRET, ADMIN_SECRET (optional)

npm install
npm run dev   # or npm start
```

Backend default URL: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend

# Create .env file (optional but recommended):
# VITE_API_BASE=http://localhost:5000
# VITE_NEWS_API_KEY=YOUR_NEWS_API_KEY
# VITE_NEWS_API_URL=https://newsapi.org/v2/everything?q=agriculture&language=en&sortBy=publishedAt&pageSize=20

npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

---

## Roles

### Buyer (user)
- Register with role **Buyer**.
- Can view posts, open post details modal, call seller, add comments.
- Can read both internal news (admin created) and external API news.

### Seller
- Register with role **Seller**.
- Seller Panel:
  - Create posts with full details.
  - Manage own posts (toggle active, delete).
  - See buyer comments & reply.

### Admin
- Register with role **Admin** using valid `adminSecret`.
- Admin Panel:
  - Dashboard stats.
  - Seller list table.
  - Seller activity (post feed).
  - Buyer activity (comment feed).
  - Create agriculture news shown on the home sidebar for all users.

---

This project is ready for local development and further customization
(animations, design tweaks, additional features).
