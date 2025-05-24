"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: number[];
  created_at: string;
  updated_at: string;
}

export default function TrashPage() {
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteToRestore, setNoteToRestore] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [processing, setProcessing] = useState(false);
  // Toast state
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  // Fetch trashed notes
  const fetchTrashedNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/notes/?deleted=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch trashed notes");
      const data = await res.json();
      setNotes(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedNotes();
  }, []);


  // Permanently delete note
  const handleDeleteForever = async (note: Note) => {
    setProcessing(true);
    setError(null);
    try {
      await fetch(`http://localhost:8000/api/notes/${note.id}/?force=true`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchTrashedNotes();
      setNoteToDelete(null);
      setToast({ message: `Note "${note.title}" permanently deleted.`, type: "success" });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setToast({ message: getErrorMessage(err), type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleRestore = async (note: Note) => {
    setProcessing(true);
    setError(null);
    try {
      await fetch(`http://localhost:8000/api/notes/${note.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deleted: false }),
      });
      await fetchTrashedNotes();
      setNoteToRestore(null);
      setToast({ message: `Note "${note.title}" restored.`, type: "success" });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setToast({ message: getErrorMessage(err), type: "error" });
    } finally {
      setProcessing(false);
    }
  };
  return (
    <section className="max-w-3xl mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Trash</h1>
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
      <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-2">
        {loading ? (
          <div>Loading trashed notes...</div>
        ) : notes.length === 0 ? (
          <EmptyState
            title="No notes in Trash"
            message="All deleted notes will appear here."
            icon={<span role="img" aria-label="Trash" style={{ fontSize: 48 }}>🗑️</span>}
          />
        ) : (
          <ul className="flex flex-col gap-6">
            {notes.map((note) => (
              <li
                key={note.id}
                className="relative group flex items-stretch border border-zinc-200 dark:border-zinc-800 rounded-2xl p-0 bg-white/70 dark:bg-zinc-900/80 backdrop-blur shadow-lg overflow-hidden"
              >
                <div className="w-1.5 bg-gradient-to-b from-zinc-400 to-zinc-600 dark:from-zinc-700 dark:to-zinc-500 mr-4" />
                <div className="flex-1 flex flex-col py-4 pr-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xl font-extrabold text-zinc-500 truncate italic">{note.title}</div>
                    <div className="flex gap-2">
                      <button
                        className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900"
                        title="Restore"
                        onClick={() => setNoteToRestore(note)}
                        disabled={processing}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 15l-3-3 3-3" /></svg>
                      </button>
                      <button
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                        title="Delete Forever"
                        onClick={() => setNoteToDelete(note)}
                        disabled={processing}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400 dark:text-zinc-500 mb-3 line-clamp-2 italic">
                    {note.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags && note.tags.length > 0 ? (
                      note.tags.map((tagId) => (
                        <span key={tagId} className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-200 font-semibold shadow-sm">
                          Tag {tagId}
                        </span>
                      ))
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-auto">
                    <span className="mr-2">Deleted:</span>
                    <span>{new Date(note.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Restore Dialog */}
      <Dialog open={!!noteToRestore} onOpenChange={(v) => { if (!v) setNoteToRestore(null); }}>
        <DialogContent className="max-w-sm p-6 rounded-xl shadow-xl bg-white dark:bg-zinc-900">
          <DialogTitle className="text-xl font-bold mb-2">Restore Note?</DialogTitle>
          <div className="mb-4">Restore <span className="font-semibold">{noteToRestore?.title}</span>?</div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
              onClick={() => setNoteToRestore(null)}
              disabled={processing}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              onClick={() => noteToRestore && handleRestore(noteToRestore)}
              disabled={processing}
            >
              {processing ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Forever Dialog */}
      <Dialog open={!!noteToDelete} onOpenChange={(v) => { if (!v) setNoteToDelete(null); }}>
        <DialogContent className="max-w-sm p-6 rounded-xl shadow-xl bg-white dark:bg-zinc-900">
          <DialogTitle className="text-xl font-bold mb-2">Delete Forever?</DialogTitle>
          <div className="mb-4">Permanently delete <span className="font-semibold">{noteToDelete?.title}</span>? This cannot be undone.</div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
              onClick={() => setNoteToDelete(null)}
              disabled={processing}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              onClick={() => noteToDelete && handleDeleteForever(noteToDelete)}
              disabled={processing}
            >
              {processing ? 'Deleting...' : 'Delete Forever'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
    </section>
  );
}

