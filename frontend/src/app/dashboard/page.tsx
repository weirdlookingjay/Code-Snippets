"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: number[];
  created_at: string;
  updated_at: string;
  favorite: boolean;
  preview?: string;
}


const tags = ["React", "Python", "Regex", "All"];

const Page = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/api/notes/?deleted=false", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        // Sort: favorites first, then by updated_at desc
        data.sort((a: Note, b: Note) => {
          if (a.favorite && !b.favorite) return -1;
          if (!a.favorite && b.favorite) return 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        setNotes(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const pinnedNotes = notes.filter(note => note.favorite);
  const recentNotes = notes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Dashboard */}
      <main className="max-w-6xl mx-auto p-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2 items-center">
            <form className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-card shadow-sm text-foreground dark:bg-neutral-900 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </form>
            <Link href="/notes/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
              <FaPlus /> New Note
            </Link>
          </div>
        </div>

        {/* Pinned Notes */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Pinned Notes</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : pinnedNotes.length === 0 ? (
            <div className="text-muted-foreground">No pinned notes.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedNotes.map(note => (
                <div key={note.id} className="bg-card p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer border-l-4 border-blue-500 dark:border-blue-400">
                  <div className="font-bold text-blue-700 dark:text-blue-400 mb-1">{note.title}</div>
                  <div className="text-muted-foreground text-sm">{note.preview || note.content?.slice(0, 80) + (note.content?.length > 80 ? "..." : "")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tags */}
        <section className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Recent Notes */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Recent Notes</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : recentNotes.length === 0 ? (
            <div className="text-muted-foreground">No recent notes.</div>
          ) : (
            <div className="bg-card rounded-lg shadow divide-y divide-border">
              {recentNotes.map(note => (
                <div key={note.id} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition">
                  <div>
                    <div className="font-medium text-foreground">{note.title}</div>
                    <div className="text-xs text-muted-foreground">Last updated: {new Date(note.updated_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/notes/${note.id}/`} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</Link>
                    <button
                      className="text-red-500 dark:text-red-400 hover:underline text-xs"
                      onClick={() => setNoteToDelete(note)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      {/* Delete Confirmation Dialog */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">Delete Note?</h2>
            <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{noteToDelete.title}</span>?</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                onClick={() => setNoteToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={async () => {
                  if (!noteToDelete) return;
                  setError(null);
                  setDeleting(true);
                  try {
                    await fetch(`http://localhost:8000/api/notes/${noteToDelete.id}/`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ deleted: true }),
                    });
                    // Refresh notes
                    const res = await fetch("http://localhost:8000/api/notes/?deleted=false", {
                      credentials: "include",
                    });
                    if (!res.ok) throw new Error("Failed to fetch notes");
                    const data = await res.json();
                    data.sort((a: Note, b: Note) => {
                      if (a.favorite && !b.favorite) return -1;
                      if (!a.favorite && b.favorite) return 1;
                      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                    });
                    setNotes(data);
                    setNoteToDelete(null);
                  } catch (err) {
                    setError(getErrorMessage(err));
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </main>
  </div>
  );
};

export default Page;