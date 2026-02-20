📌 Smart Bookmark App

A secure, real-time bookmark manager built using Next.js (App Router) and Supabase.

🔗 Live Demo https://smart-bookmarks-app-puce.vercel.app/

📦 GitHub Repository https://github.com/kapilnila/smart-bookmarks-app

🚀 Overview

Smart Bookmark App allows users to:

Sign in securely using Google OAuth

Save personal bookmarks

View only their own bookmarks

See real-time updates across tabs

Add and delete bookmarks instantly

The application demonstrates authentication, database security, real-time subscriptions, optimistic UI updates, and production deployment.

🛠️ Tech Stack

Frontend: Next.js (App Router)

Authentication & Backend: Supabase

Database: PostgreSQL (via Supabase)

Styling: Tailwind CSS

Deployment: Vercel

Realtime: Supabase Postgres Change Subscriptions

✨ Features 🔐 Google OAuth Authentication

Users log in securely via Google. No custom password handling required.

🔒 Row-Level Security (RLS)

Bookmarks are private to each user.

Implemented policies ensure:

Users can only view their own bookmarks

Users can only insert their own bookmarks

Users can only delete their own bookmarks

Example policy:

auth.uid() = user_id

This ensures database-level security.

⚡ Real-Time Updates

The app subscribes to Postgres changes using Supabase Realtime.

Whenever a bookmark is added or deleted:

All open tabs update instantly

No manual refresh required

🚀 Optimistic UI

Bookmarks appear instantly upon creation and disappear instantly upon deletion, providing a fast and responsive experience.

✅ Input Validation

URL validation using JavaScript new URL()

Disabled add button if fields are empty

Loading states for better UX

🧠 Architecture Browser (Next.js Client) ↓ Supabase • Google OAuth • PostgreSQL Database • Row-Level Security • Realtime Subscriptions

Supabase handles authentication, database operations, and real-time updates.

🔧 Local Setup Instructions 1️⃣ Clone the repository git clone https://github.com/kapilnila/smart-bookmarks-app.git cd smart-bookmarks-app

2️⃣ Install dependencies npm install

3️⃣ Create environment variables

Create a .env.local file in root:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4️⃣ Run locally npm run dev

Open:

http://localhost:3000

🧩 Challenges Faced

Correctly configuring Google OAuth redirect URIs

Implementing secure Row-Level Security policies

Managing real-time subscriptions without memory leaks

Handling optimistic UI updates properly

📈 Future Improvements

Edit bookmark functionality

Bookmark tags and filtering

Pagination for large datasets

Dark mode support

Toast notifications

User profile customization

🎯 Why This Project Matters

This project demonstrates:

Secure authentication flows

Database-level access control

Real-time event handling

Clean component architecture

Production deployment practices

It reflects practical, full-stack application development using modern tools.


📄 License

This project is open for educational and demonstration purposes.


👤 Author

Kapil Nila B.Tech Electrical Engineering – IIT Ropar Aspiring Software Development Engineer