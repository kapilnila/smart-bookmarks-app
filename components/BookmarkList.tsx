"use client";

import { supabase } from "@/lib/supabase";

export default function BookmarkList({ bookmarks, setBookmarks }: any) {
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);

    // Optimistic remove
    setBookmarks((prev: any[]) =>
      prev.filter((b) => b.id !== id)
    );
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        No bookmarks yet 🚀
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark: any) => (
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
  );
}
