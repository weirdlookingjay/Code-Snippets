import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
// Language icons (using react-icons, fallback emoji if not installed)
import { SiJavascript, SiTypescript, SiHtml5, SiJson, SiPython } from "react-icons/si";

const LANGUAGE_OPTIONS = [
  { label: "HTML", value: "html", icon: <SiHtml5 className="text-orange-500" /> },
  { label: "JavaScript", value: "javascript", icon: <SiJavascript className="text-yellow-400" /> },
  { label: "TypeScript", value: "typescript", icon: <SiTypescript className="text-blue-500" /> },
  { label: "JSON", value: "json", icon: <SiJson className="text-green-700" /> },
  { label: "Python", value: "python", icon: <SiPython className="text-blue-400" /> }
  // Add more languages here as needed
];

export interface CreateSnippetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (snippet: { name: string; language: string; code: string }) => void;
}

export default function CreateSnippetModal({ open, onClose, onSave }: CreateSnippetModalProps) {
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0].value);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-3xl p-0 flex flex-col relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-6 pb-0">
          <h2 className="text-xl font-semibold mb-2">Create a Snippet</h2>
        </div>
        <div className="flex-1 px-6 pb-0">
          <MonacoEditor
            height="300px"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={v => setCode(v || "")}
            options={{ minimap: { enabled: false } }}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-2 items-center w-full md:w-auto">
            {/* Language icon */}
            <span className="text-2xl mr-1">
              {LANGUAGE_OPTIONS.find(opt => opt.value === language)?.icon}
            </span>
            <select
              className="border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              className="border rounded px-2 py-1 ml-2 w-40 dark:bg-zinc-800 dark:text-white"
              type="text"
              placeholder="Snippet Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-white rounded px-4 py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
              onClick={() => onSave({ name, language, code })}
              disabled={!name.trim() || !code.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
