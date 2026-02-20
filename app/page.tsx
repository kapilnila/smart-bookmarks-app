"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) fetchBookmarks();
  }, [session]);

  const fetchBookmarks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
    setLoading(false);
  };

  // 🔥 Realtime
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <button
          onClick={login}
          className="bg-black text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Smart Bookmark</h1>
            <p className="text-gray-500 text-sm">
              {session.user.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <BookmarkForm
          userId={session.user.id}
          onAdd={(newBookmark) =>
            setBookmarks((prev) => [newBookmark, ...prev])
          }
        />

        <BookmarkList
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
        />
      </div>
    </div>
  );
}
