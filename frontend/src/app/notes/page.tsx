"use client"

import React, { useEffect, useState } from "react";
import { Dialog,  DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NoteForm } from "@/components/notes/NoteForm";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: number[];
  created_at: string;
  updated_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/notes/", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpsert = async (values: { title: string; content: string; tags: number[] }) => {
    setCreating(true);
    setError(null);
    try {
      if (selectedNote) {
        // Edit mode
        const res = await fetch(`http://localhost:8000/api/notes/${selectedNote.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Failed to update note");
      } else {
        // Create mode
        const res = await fetch("http://localhost:8000/api/notes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Failed to create note");
      }
      await fetchNotes();
      setOpen(false);
      setSelectedNote(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Notes</h1>
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow animate-in fade-in">
          <span className="flex-1">{error}</span>
          <button
            className="ml-2 text-xl font-bold hover:text-red-200 focus:outline-none"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedNote(null); }}>
          <DialogTrigger asChild>
            <button className="btn btn-primary" onClick={() => { setSelectedNote(null); }}>+ New Note</button>
          </DialogTrigger>
          <DialogContent className="max-w-lg p-6 rounded-xl shadow-xl bg-white dark:bg-zinc-900 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <DialogTitle className="text-2xl font-bold mb-2">{selectedNote ? "Edit Note" : "New Note"}</DialogTitle>
            <div className="border-b border-zinc-200 dark:border-zinc-700 mb-4" />
            <NoteForm
              onSubmit={handleUpsert}
              loading={creating}
              submitLabel={selectedNote ? "Update Note" : "Create Note"}
              initialValues={selectedNote ? {
                title: selectedNote.title,
                content: selectedNote.content,
                tags: selectedNote.tags
              } : undefined}
            />
          </DialogContent>
        </Dialog> 
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!noteToDelete} onOpenChange={(v) => { if (!v) setNoteToDelete(null); }}>
        <DialogContent className="max-w-sm p-6 rounded-xl shadow-xl bg-white dark:bg-zinc-900">
          <DialogTitle className="text-xl font-bold mb-2">Delete Note?</DialogTitle>
          <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{noteToDelete?.title}</span>? This action cannot be undone.</div>
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
                setDeleting(true);
                setError(null);
                try {
                  await fetch(`http://localhost:8000/api/notes/${noteToDelete.id}/`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  await fetchNotes();
                  setNoteToDelete(null);
                } catch (err: unknown) {
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
        </DialogContent>
      </Dialog>
      <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-2">
        {loading ? (
          <div>Loading notes...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : notes.length === 0 ? (
          <div className="text-muted-foreground text-sm">No notes yet. Create your first note above!</div>
        ) : (
          <ul className="flex flex-col gap-6">
            {notes.map((note) => (
              <li
                key={note.id}
                className="relative group flex items-stretch cursor-pointer border border-zinc-200 dark:border-zinc-800 rounded-2xl p-0 bg-white/70 dark:bg-zinc-900/80 backdrop-blur shadow-lg hover:scale-[1.02] hover:bg-zinc-50/40 dark:hover:bg-zinc-800/30 transition-all overflow-hidden"
              >
                {/* Accent bar */}
                <div className="w-1.5 bg-gradient-to-b from-blue-500 to-blue-400 dark:from-blue-700 dark:to-blue-500 mr-4" />
                <div className="flex-1 flex flex-col py-4 pr-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xl font-extrabold text-primary truncate">{note.title}</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Edit" onClick={() => { setSelectedNote(note); setOpen(true); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3h3z" /></svg>
                      </button>
                       <button
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                        title="Delete"
                        onClick={() => setNoteToDelete(note)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 line-clamp-2">
                    {note.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags && note.tags.length > 0 ? (
                      note.tags.map((tagId) => (
                        <span key={tagId} className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-400 text-blue-800 text-xs dark:from-blue-800 dark:to-blue-600 dark:text-blue-100 font-semibold shadow-sm">
                          Tag {tagId}
                        </span>
                      ))
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-auto">Created: {new Date(note.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

