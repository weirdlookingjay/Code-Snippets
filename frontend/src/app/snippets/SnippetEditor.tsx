"use client"

import { useState, useEffect } from "react";
import { Snippet } from "./SnippetsList";
import MonacoEditor from "@monaco-editor/react";
import { Toast } from "@/components/ui/Toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


interface SnippetEditorProps {
  snippet: Snippet | null;
  onChange: (snippet: Partial<Snippet>) => void;
  onSave: (code: string) => Promise<void>;
  onDelete: () => void;
  isNew: boolean;
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function SnippetEditor({ snippet, onChange, onSave, onDelete, isNew }: SnippetEditorProps) {
  const [code, setCode] = useState(snippet?.code || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setCode(snippet?.code || "");
  }, [snippet?.code, snippet?.id]);
  

  if (!snippet) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Select or create a snippet to get started.
      </div>
    );
  }

  // Language icon mapping
  const LANGUAGE_ICONS: Record<string, React.ReactNode> = {
    typescript: <span className="bg-blue-100 text-blue-600 rounded p-2 text-xl font-bold">TS</span>,
    javascript: <span className="bg-yellow-100 text-yellow-600 rounded p-2 text-xl font-bold">JS</span>,
    python: <span className="bg-blue-100 text-blue-400 rounded p-2 text-xl font-bold">PY</span>,
    go: <span className="bg-cyan-100 text-cyan-700 rounded p-2 text-xl font-bold">GO</span>,
    java: <span className="bg-orange-100 text-orange-600 rounded p-2 text-xl font-bold">JAVA</span>,
    csharp: <span className="bg-purple-100 text-purple-700 rounded p-2 text-xl font-bold">C#</span>,
    cpp: <span className="bg-indigo-100 text-indigo-700 rounded p-2 text-xl font-bold">C++</span>,
    ruby: <span className="bg-red-100 text-red-600 rounded p-2 text-xl font-bold">RB</span>,
    php: <span className="bg-indigo-100 text-indigo-700 rounded p-2 text-xl font-bold">PHP</span>,
    other: <span className="bg-zinc-100 text-zinc-700 rounded p-2 text-xl font-bold">TXT</span>,
  };

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 pl-4 pr-4 pt-2 pb-0 min-w-0">
        <div>{LANGUAGE_ICONS[snippet.language] || LANGUAGE_ICONS['other']}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold text-zinc-900 truncate">{snippet.title}</div>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            {snippet.updatedAt && snippet.updatedAt !== snippet.createdAt ? (
              <span>Saved {formatRelativeTime(new Date(snippet.updatedAt))}</span>
            ) : snippet.createdAt ? (
              <span>Created {formatRelativeTime(new Date(snippet.createdAt))}</span>
            ) : null}
            {snippet.tags.map((tag, idx) => (
              <span key={tag + idx} className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full ml-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="inline-block bg-zinc-100 text-zinc-500 text-xs font-semibold px-2 py-0.5 rounded border border-zinc-200">
            {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
          </span>
        </div>
      </div>
      {/* Monaco Editor - flush with header, no overflow */}
      <div className="flex-1 w-full flex min-w-0 overflow-hidden bg-white rounded-xl shadow">
        <div className="flex-1 min-w-0">
          <MonacoEditor
            width="100%"
            height="100%"
            language={snippet.language || "typescript"}
            value={code}
            theme="vs-light"
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              guides: { indentation: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              readOnly: false,
              lineNumbers: "on",
              glyphMargin: false,
              folding: false,
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
                handleMouseWheel: false
              },              
              renderValidationDecorations: "off",
              padding: { top: 16, bottom: 16 }
            }}
            onChange={(value) => {
              setCode(value ?? "");
              setIsDirty(true);
            }}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${(!isDirty || saving) ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={async () => {
              setSaving(true);
              setLastSaved(new Date());
              setIsDirty(false);
              try {
                await onSave(code);
                setToast({ message: "Snippet saved!", type: "success" });
              } catch {
                setToast({ message: "Failed to save snippet.", type: "error" });
              } finally {
                setSaving(false);
              }
            }}
            disabled={!isDirty || saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {!isNew && (
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <button
                  className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={deleting}
                  type="button"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Snippet?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this snippet? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className="px-4 py-2 bg-zinc-200 rounded hover:bg-zinc-300 text-zinc-900"
                    onClick={() => setConfirmOpen(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={async () => {
                      setDeleting(true);
                      try {
                        await onDelete();
                        setToast({ message: "Snippet deleted!", type: "success" });
                        setConfirmOpen(false);
                      } catch {
                        setToast({ message: "Failed to delete snippet.", type: "error" });
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting}
                    type="button"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      </div>
    </div>
  );
}
