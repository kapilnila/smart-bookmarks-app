Smart Bookmark App
🔗 Live Demo
https://smart-bookmarks-app-git-main-kapil-nilas-projects.vercel.app/

📦 GitHub Repo

https://github.com/kapilnila/smart-bookmarks-app

🚀 Tech Stack

Next.js (App Router)

Supabase (Auth, Postgres, Realtime)

Tailwind CSS

Vercel Deployment

✨ Features

Google OAuth login (no email/password)

Private bookmarks per user

Real-time updates across tabs

Add & delete bookmarks

Secure Row Level Security (RLS)

🔐 Security Implementation

Row Level Security policies ensure users can:

View only their bookmarks

Insert only their own bookmarks

Delete only their own bookmarks

Implemented using:

auth.uid() = user_id

⚡ Real-time Updates

Implemented using Supabase Realtime subscriptions:

Listens to Postgres changes

Automatically refreshes bookmarks

Works across multiple tabs

🧠 Challenges Faced

Configuring Google OAuth redirect URIs correctly

Setting up proper RLS policies

Managing Supabase Realtime subscriptions without memory leaks

🛠️ Setup Instructions
npm install
npm run dev


Add .env.local:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=