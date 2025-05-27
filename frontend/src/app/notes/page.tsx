"use client";
import Link from "next/link";

import React, { useEffect, useState } from "react";

interface Tag {
  id: number;
  name: string;
}

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
  favorite: boolean;
}

// Pastel color palette
const pastelColorsLight = [
  '#f8fafc', // light gray
  '#fef9c3', // yellow
  '#d1fae5', // green
  '#e0e7ff', // blue
  '#fde68a', // gold
  '#fbcfe8', // pink
  '#e0f2fe', // sky
  '#fcd34d', // orange
  '#a7f3d0', // teal
  '#fca5a5', // red
];
const pastelColorsDark = [
  '#1e293b', // dark slate
  '#3b3c1e', // olive
  '#134e4a', // teal
  '#312e81', // indigo
  '#78350f', // brown
  '#831843', // dark pink
  '#164e63', // blue
  '#713f12', // ochre
  '#065f46', // green
  '#7f1d1d', // dark red
];

function getNoteColor(noteId: number) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const palette = isDark ? pastelColorsDark : pastelColorsLight;
  return palette[noteId % palette.length];
}

export default function NotesPage() {
  // Search/filter state
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 12;
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Tag state
  const [allTags, setAllTags] = useState<Tag[]>([]);

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
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // Fetch tags
    const fetchTags = async () => {

      try {
        const res = await fetch("http://localhost:8000/api/tags/", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setAllTags(data);
      } catch {
        // No-op

      } finally {
        // removed setTagsLoading(false)
      }
    };
    fetchTags();
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

  // Filtered notes
  const filteredNotes = notes.filter(note => {
    // Search by title or content
    const matchesSearch =
      search.trim() === "" ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      (note.tags && allTags.filter(t => note.tags.includes(t.id)).some(t => t.name.toLowerCase().includes(search.toLowerCase())));
    // Filter by tag
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    // Filter by date
    const matchesDate = !filterDate || note.created_at.slice(0, 10) === filterDate;
    return matchesSearch && matchesTag && matchesDate;
  });

  return (
    <>
      <section className="w-full py-12 flex flex-col gap-8 px-4 md:px-8">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Notes</h1>
        {/* Search and filter bar */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by title, content, or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 w-64 shadow"
          />
          <select
            value={filterTag ?? ""}
            onChange={e => setFilterTag(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow"
          />
          {(search || filterTag || filterDate) && (
            <button
              className="px-3 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 shadow"
              onClick={() => { setSearch(""); setFilterTag(null); setFilterDate(""); }}
            >Clear</button>
          )}
        </div>
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
            <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{noteToDelete?.title}</span>?</div>
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
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ deleted: true }),
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
        <div className="w-full">
          {loading ? (
            <div>Loading notes...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : notes.length === 0 ? (
            <div className="text-muted-foreground text-sm">No notes yet. Create your first note above!</div>
          ) : (
            <>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-2 md:px-6 lg:px-8"
              >
                {filteredNotes.slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage).map((note) => (
                    <li key={note.id}>
                      <Link href={`/notes/${note.id}`}>
                        <div
                          className="relative group flex flex-col items-stretch cursor-pointer border border-zinc-200 dark:border-zinc-800 rounded-2xl p-0 backdrop-blur shadow-lg hover:scale-[1.02] transition-all overflow-hidden"
                          style={{ background: getNoteColor(note.id) }}
                        >
                          <div className="w-1.5 bg-gradient-to-b from-blue-500 to-blue-400 dark:from-blue-700 dark:to-blue-500 absolute left-0 top-0 bottom-0" />
                          <div className={`flex-1 flex flex-col py-4 pl-6 pr-4 ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'text-zinc-100' : 'text-zinc-900'}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className={`text-xl font-extrabold truncate ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'text-white' : 'text-zinc-900'}`}>{note.title}</div>
                              <div className="flex gap-2">
                                <button
                                  className={`p-1 rounded ${note.favorite ? 'bg-yellow-200 dark:bg-yellow-600' : 'hover:bg-yellow-100 dark:hover:bg-yellow-900'}`}
                                  title={note.favorite ? "Unpin" : "Pin"}
                                  onClick={async e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    try {
                                      await fetch(`http://localhost:8000/api/notes/${note.id}/`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        credentials: "include",
                                        body: JSON.stringify({ favorite: !note.favorite }),
                                      });
                                      fetchNotes();
                                    } catch {}
                                  }}
                                >
                                  {/* Pin/Unpin icon */}
                                  {note.favorite ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414l-7 7a1 1 0 000 1.414z" /></svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.293 14.707a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414l-7 7a1 1 0 000 1.414z" /></svg>
                                  )}
                                </button>
                                <button
                                  className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                                  title="Edit"
                                  onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedNote(note); setOpen(true); }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3h3z" /></svg>
                                </button>
                                <button
                                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                                  title="Delete"
                                  onClick={e => { e.preventDefault(); e.stopPropagation(); setNoteToDelete(note); }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            </div>
                            <div className={`text-sm mb-3 line-clamp-2 ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'text-zinc-200' : 'text-zinc-700'}`}
                              dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                            <div className="flex flex-wrap gap-2 mb-3">
                              {note.tags && note.tags.length > 0 ? (
                                note.tags.map((tagId) => {
                                  const tag = allTags.find((t) => t.id === tagId);
                                  return tag ? (
                                    <span
                                      key={tag.id}
                                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-700'}`}
                                    >
                                      {tag.name}
                                    </span>
                                  ) : null;
                                })
                              ) : null}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-auto">Created: {new Date(note.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
              {Math.ceil(filteredNotes.length / notesPerPage) > 1 && (
                <div className="flex justify-between mt-12 mb-4">
                  <button
                    className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-60 border border-zinc-300 dark:border-zinc-600 shadow"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  <span className="px-2 py-1 text-sm">Page {currentPage} of {Math.ceil(filteredNotes.length / notesPerPage)}</span>
                  <button
                    className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-60 border border-zinc-300 dark:border-zinc-600 shadow"
                    onClick={() => setCurrentPage((p) => Math.min(Math.ceil(notes.length / notesPerPage), p + 1))}
                    disabled={currentPage === Math.ceil(notes.length / notesPerPage)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
