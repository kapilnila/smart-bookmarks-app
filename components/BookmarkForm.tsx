"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkForm({ userId, onAdd }: any) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const validateURL = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    if (!validateURL(url)) {
      alert("Invalid URL format");
      return;
    }

    setLoading(true);

    const { data } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: userId,
      })
      .select()
      .single();

    if (data) {
      onAdd(data); // 🔥 Optimistic UI
    }

    setTitle("");
    setUrl("");
    setLoading(false);
  };

  return (
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
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded-lg"
      />
      <button
        onClick={addBookmark}
        disabled={!title || !url || loading}
        className={`rounded-lg text-white ${
          !title || !url
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        } transition`}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
