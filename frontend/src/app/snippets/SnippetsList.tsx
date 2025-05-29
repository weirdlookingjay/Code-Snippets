import React from "react";
import { PanelLeftClose } from "lucide-react";
import { SiJavascript, SiTypescript, SiHtml5, SiJson, SiPython } from "react-icons/si";

export type Snippet = {
  id: number;
  title: string;
  language: string;
  tags: string[];
  code: string;
  createdAt?: string; 
  updatedAt?: string;
};



const LANGUAGE_ICONS: Record<string, React.ReactNode> = {
  html: <SiHtml5 className="text-orange-500" />,
  javascript: <SiJavascript className="text-yellow-400" />,
  typescript: <SiTypescript className="text-blue-500" />,
  json: <SiJson className="text-green-700" />,
  python: <SiPython className="text-blue-400" />,
};

interface SnippetsListProps {
  snippets: Snippet[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onToggleMenu: () => void;
}

export default function SnippetsList({
  snippets,
  selectedId,
  onSelect,
  onNew,
  onToggleMenu,
}: SnippetsListProps) {
  return (
    <aside className="w-72 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-semibold text-zinc-700 dark:text-zinc-100">Snippets</span>
        <div className="flex gap-2 items-center">
          <button
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 flex items-center justify-center shadow-sm"
            title="New Snippet"
            onClick={onNew}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-300 w-8 h-8 flex items-center justify-center"
            title="Hide Menu"
            onClick={onToggleMenu}
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {snippets.length === 0 ? (
          <div className="p-4 text-zinc-500 dark:text-zinc-400 text-sm">No snippets yet.</div>
        ) : (
          <ul className="space-y-3">
            {snippets.map(snippet => (
              <li key={snippet.id}>
                <button
                  className={`w-full flex items-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm px-4 py-3 transition hover:shadow-md hover:border-blue-400 group relative ${selectedId === snippet.id ? "ring-2 ring-blue-400 border-blue-400" : ""}`}
                  onClick={() => onSelect(snippet.id)}
                  style={{ textAlign: 'left' }}
                >
                  {/* Icon */}
                  <span className="flex-shrink-0 text-2xl">
                    {LANGUAGE_ICONS[snippet.language] || <span>📄</span>}
                  </span>
                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-100 truncate flex items-center gap-2">
                      {snippet.title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {snippet.code.split('\n')[0] || 'No description'}
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {[...(snippet.tags && snippet.tags.length > 0 ? snippet.tags : ["DEMO"])].map((tag, idx) => (
                        <span key={tag + idx} className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
