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
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
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
      <div className="flex h-screen items-center justify-center">
        <button
          onClick={login}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Smart Bookmark App</h1>
        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {bookmarks.length === 0 && (
        <p className="text-gray-500">No bookmarks yet</p>
      )}

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border p-3 rounded mb-2 flex justify-between"
        >
          <a
            href={bookmark.url}
            target="_blank"
            className="text-blue-600"
          >
            {bookmark.title}
          </a>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
