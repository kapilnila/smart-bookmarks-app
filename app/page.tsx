"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
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
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

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

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: session.user.id,
    });

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

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
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Smart Bookmark</h1>
            <p className="text-gray-500 text-sm">
              Logged in as {session.user.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Add Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <button
            onClick={addBookmark}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Bookmark
          </button>
        </div>

        {/* Bookmark List */}
        {bookmarks.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No bookmarks yet 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex justify-between items-center border p-3 rounded-xl hover:shadow transition"
              >
                <a
                  href={bookmark.url}
                  target="_blank"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {bookmark.title}
                </a>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
