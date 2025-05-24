"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: number[];
  created_at: string;
  updated_at: string;
}

export default function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Live autosave state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastAutoSavedContent = useRef<string>("");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: note?.content || "",
    editable: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (!note || html === lastAutoSavedContent.current) return;
      setAutoSaveStatus('saving');
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
      autoSaveTimeout.current = setTimeout(async () => {
        try {
          await fetch(`http://localhost:8000/api/notes/${note.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...note, content: html }),
          });
          lastAutoSavedContent.current = html;
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 1500);
        } catch {
          setAutoSaveStatus('idle');
        }
      }, 1000); // 1s debounce
    },
  });

  // Ensure editor content updates after fetch
  useEffect(() => {
    if (editor && note?.content !== undefined) {
      editor.commands.setContent(note.content || "");
    }
  }, [note?.content, editor]);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/notes/${id}/`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch note");
        const data = await res.json();
        setNote(data);
        editor?.commands.setContent(data.content || "");
      } catch {
        setError("Could not load note.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async () => {
    if (!editor || !note) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/api/notes/${note.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...note, content: editor.getHTML() }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setNote({ ...note, content: editor.getHTML() });
    } catch {
      alert("Error saving note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!note) return <div className="p-8">Note not found.</div>;

  return (
    <div className="flex justify-center items-start min-h-[70vh] py-12 px-2">
      <div className="w-full max-w-2xl h-[70vh] min-h-[500px] bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 relative border border-zinc-100 dark:border-zinc-800 flex flex-col">
        {/* Autosave status indicator */}
        <div className="absolute right-8 top-6 text-xs text-zinc-500 dark:text-zinc-400 select-none">
          {autoSaveStatus === 'saving' && <span>Saving...</span>}
          {autoSaveStatus === 'saved' && <span>Saved</span>}
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">
          {note.title}
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-700 dark:to-blue-500 rounded mb-6" />
        <div className="flex-1 flex flex-col min-h-0 mb-8">
          {/* Rich Text Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-2 mb-4 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-t-xl border-b border-zinc-200 dark:border-zinc-700">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded font-bold ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded italic ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded underline ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>U</button>
              <span className="mx-2 border-l border-zinc-300 dark:border-zinc-600 h-5" />
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>H1</button>
              <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>H2</button>
              <span className="mx-2 border-l border-zinc-300 dark:border-zinc-600 h-5" />
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>• List</button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>1. List</button>
              <span className="mx-2 border-l border-zinc-300 dark:border-zinc-600 h-5" />
              <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-2 py-1 rounded ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>❝</button>
              <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`px-2 py-1 rounded font-mono ${editor.isActive('code') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>{'<>'}</button>
            </div>
          )}
          <EditorContent 
            editor={editor} 
            className="tiptap-editor-container prose max-w-none flex-1 min-h-0 h-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-zinc-900 dark:text-zinc-100 shadow-sm" 
          />
        </div>
        <div className="flex justify-end">
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
