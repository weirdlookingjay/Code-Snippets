"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";

type NoteVersion = {
  id: number;
  content: string;
  created_at: string;
};

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

  const [showHistory, setShowHistory] = useState(false);
  const [historyVersions, setHistoryVersions] = useState<NoteVersion[]>([]);
  const [viewingVersion, setViewingVersion] = useState<NoteVersion | null>(null);

  useEffect(() => {
    if (showHistory && note?.id) {
      fetch(`http://localhost:8000/api/notes/${note.id}/versions/`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => setHistoryVersions(data))
        .catch(() => setHistoryVersions([]));
    }
  }, [showHistory, note?.id]);

  const [attachments, setAttachments] = useState([
    // Example mock attachments
    { id: 1, name: 'image1.png', url: '#', type: 'image/png' },
    { id: 2, name: 'file1.pdf', url: '#', type: 'application/pdf' },
  ]);

  // const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     // Mock: just add file name to attachments
  //     const file = e.target.files[0];
  //     setAttachments((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now(),
  //         name: file.name,
  //         url: URL.createObjectURL(file),
  //         type: file.type,
  //       },
  //     ]);
  //   }
  // };


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    // Upload to backend
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      const imageUrl = data.url;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch {
      alert("Image upload failed");
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: 'display: block; margin: 0.5em auto; max-width: 100%; height: auto;',
              parseHTML: element => element.getAttribute('style'),
              renderHTML: attributes => {
                return { style: attributes.style };
              },
            },
            align: {
              default: 'center',
              parseHTML: element => element.style.textAlign || 'center',
              renderHTML: attributes => {
                if (!attributes.align) return {};
                return { style: `display: block; margin: 0.5em auto; max-width: 100%; height: auto; text-align: ${attributes.align};` };
              },
            },
          };
        },
      }),
      ResizeImage,
    ],
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
      <div className="w-full max-w-2xl min-h-[600px] bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 relative border border-zinc-100 dark:border-zinc-800 flex flex-col">
        {/* Insert Image & Alignment Buttons */}
        <div className="mb-4 flex gap-2 items-center">
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
            onClick={() => fileInputRef.current?.click()}
          >
            Insert Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          {/* Image Alignment Buttons */}
          <span className="ml-4 text-xs text-zinc-500">Align:</span>
          <button
            type="button"
            className="px-2 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-xs font-semibold"
            onClick={() => editor?.chain().focus().updateAttributes('image', { align: 'left', style: 'display: block; margin: 0.5em 0 0.5em 0; max-width: 100%; height: auto; float: left;' }).run()}
          >
            Left
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-xs font-semibold"
            onClick={() => editor?.chain().focus().updateAttributes('image', { align: 'center', style: 'display: block; margin: 0.5em auto; max-width: 100%; height: auto; float: none;' }).run()}
          >
            Center
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-xs font-semibold"
            onClick={() => editor?.chain().focus().updateAttributes('image', { align: 'right', style: 'display: block; margin: 0.5em 0.5em 0.5em auto; max-width: 100%; height: auto; float: right;' }).run()}
          >
            Right
          </button>
        </div>
        {/* Autosave status indicator */}
        <div className="absolute right-8 top-6 text-xs text-zinc-500 dark:text-zinc-400 select-none">
          {autoSaveStatus === 'saving' && <span>Saving...</span>}
          {autoSaveStatus === 'saved' && <span>Saved</span>}
        </div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {note.title}
          </h1>
          <button
            className="ml-4 px-4 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 border border-zinc-300 dark:border-zinc-600 shadow"
            onClick={() => setShowHistory(true)}
          >
            Version History
          </button>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-700 dark:to-blue-500 rounded mb-6" />
        <div className="flex-1 flex flex-col min-h-0 mb-8">
          {/* Rich Text Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-2 mb-4 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-t-xl border-b border-zinc-200 dark:border-zinc-700 items-center">
              <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded font-bold ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>B</button>
              <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded italic ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>I</button>
              <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded underline ${editor?.isActive('underline') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>U</button>
              <span className="mx-2 border-l border-zinc-300 dark:border-zinc-600 h-5" />
              <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>H1</button>
              <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>H2</button>
              <span className="mx-2 border-l border-zinc-300 dark:border-zinc-600 h-5" />
              <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>• List</button>
              <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded ${editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>1. List</button>
              <span className="mx-2 border-l border-zinc-300 dark:border-zinc-600 h-5" />
              <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`px-2 py-1 rounded ${editor?.isActive('blockquote') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>❝</button>
              <button type="button" onClick={() => editor?.chain().focus().toggleCode().run()} className={`px-2 py-1 rounded font-mono ${editor?.isActive('code') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>{'<>'}</button>
            </div>
          )}
          <EditorContent 
            editor={editor} 
            className="tiptap-editor-container prose max-w-none min-h-[350px] bg-zinc-50 dark:bg-zinc-800 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-zinc-900 dark:text-zinc-100 shadow-sm" 
          />
          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded shadow-sm">
                  {att.type.startsWith('image/') ? (
                    <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <a href={att.url} download={att.name} className="underline text-blue-600 dark:text-blue-300" target="_blank" rel="noopener noreferrer">{att.name}</a>
                  )}
                  <button onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))} className="ml-2 px-2 py-1 rounded bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 text-xs">Remove</button>
                </div>
              ))}
            </div>
          )}
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
      {/* Version History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => setShowHistory(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Version History</h2>
            <ul className="space-y-3 max-h-72 overflow-y-auto">
              {historyVersions.map(v => (
                <li key={v.id} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded">
                  <span className="text-sm">{new Date(v.created_at).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs" onClick={() => setViewingVersion(v)}>View</button>
                    <button className="px-2 py-1 rounded bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 text-xs" onClick={() => { editor?.commands.setContent(v.content); setShowHistory(false); }}>Restore</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* View Version Modal */}
      {viewingVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => setViewingVersion(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Version from {new Date(viewingVersion.created_at).toLocaleString()}</h2>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: viewingVersion.content }} />
          </div>
        </div>
      )}

    </div>
  );
}
