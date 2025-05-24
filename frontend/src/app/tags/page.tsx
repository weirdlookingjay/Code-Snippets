"use client"

import React, { useEffect, useState } from "react";

interface Tag {
  id: number;
  name: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/tags/", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data);
    } catch {
      setError("Could not load tags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("http://localhost:8000/api/tags/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newTag }),
      });
      if (!res.ok) throw new Error("Failed to create tag");
      setNewTag("");
      setSuccess("Tag created!");
      await fetchTags();
    } catch {
      setError("Could not create tag. Tag names must be unique.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`http://localhost:8000/api/tags/${tagId}/`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete tag");
      setSuccess("Tag deleted.");
      await fetchTags();
    } catch {
      setError("Could not delete tag.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Tags</h1>
      <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-4">
        <form className="flex gap-2 mb-4" onSubmit={handleAddTag}>
          <input
            type="text"
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="New tag name"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            required
            disabled={processing}
          />
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            type="submit"
            disabled={processing || !newTag.trim()}
          >
            Add Tag
          </button>
        </form>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {loading ? (
          <div>Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="text-muted-foreground text-sm">No tags yet. Tags help you organize your notes and snippets.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {tags.map(tag => (
              <li key={tag.id} className="flex items-center gap-4 p-2 rounded bg-zinc-100 dark:bg-zinc-800">
                <span className="font-semibold text-blue-700 dark:text-blue-300">{tag.name}</span>
                <span className="text-xs text-zinc-400">ID: {tag.id}</span>
                <button
                  className="ml-auto px-2 py-1 rounded bg-red-500 text-white hover:bg-red-700 text-xs disabled:opacity-60"
                  onClick={() => handleDeleteTag(tag.id)}
                  disabled={processing}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
