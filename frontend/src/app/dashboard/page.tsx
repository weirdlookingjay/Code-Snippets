"use client"

import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";

const pinnedNotes = [
  { id: 1, title: "Regex Cheatsheet", preview: "Common regex patterns..." },
  { id: 2, title: "React Patterns", preview: "Hooks, Context, HOCs..." },
];

const recentNotes = [
  { id: 3, title: "How to use Redux Toolkit", updated: "2 hours ago" },
  { id: 4, title: "Python Regex Cheat Sheet", updated: "Yesterday" },
  { id: 5, title: "VSCode Shortcuts", updated: "3 days ago" },
];

const tags = ["React", "Python", "Regex", "All"];

const Page = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedNotes.map(note => (
              <div key={note.id} className="bg-card p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer border-l-4 border-blue-500 dark:border-blue-400">
                <div className="font-bold text-blue-700 dark:text-blue-400 mb-1">{note.title}</div>
                <div className="text-muted-foreground text-sm">{note.preview}</div>
              </div>
            ))}
          </div>
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
          <div className="bg-card rounded-lg shadow divide-y divide-border">
            {recentNotes.map(note => (
              <div key={note.id} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition">
                <div>
                  <div className="font-medium text-foreground">{note.title}</div>
                  <div className="text-xs text-muted-foreground">Last updated: {note.updated}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/notes/${note.id}/edit`} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</Link>
                  <button className="text-red-500 dark:text-red-400 hover:underline text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;