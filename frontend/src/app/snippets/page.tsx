"use client"

import React, { useState, useRef, useEffect } from "react";
import "./monaco-overflow-fix.css";
import CreateSnippetModal from "./CreateSnippetModal";
import SnippetsList from "./SnippetsList";
import SnippetEditor from "./SnippetEditor";
import { PanelLeftOpen } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useGetSnippetsQuery, useCreateSnippetMutation, useUpdateSnippetMutation, useDeleteSnippetMutation } from "@/redux/services/snippetsApiSlice";

export default function SnippetsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: rawSnippets = [], isLoading, isError, refetch } = useGetSnippetsQuery();
  const [createSnippet] = useCreateSnippetMutation();
  const [updateSnippet] = useUpdateSnippetMutation();
  const [deleteSnippet] = useDeleteSnippetMutation();

  // Map API fields to camelCase for frontend, memoized to prevent infinite loops
  const snippets = React.useMemo(() => rawSnippets.map((s: any) => ({
    ...s,
    createdAt: s.createdAt || s.created_at,
    updatedAt: s.updatedAt || s.updated_at,
  })), [rawSnippets]);


  // Click outside to close (robust, works with portals/shadow DOM)
  useEffect(() => {
    if (!panelVisible) return;
    function handleClick(event: MouseEvent) {
      const path = event.composedPath ? event.composedPath() : [];
      if (
        panelRef.current &&
        (path.length ? !path.includes(panelRef.current) : !panelRef.current.contains(event.target as Node))
      ) {
        setAccordionValue(undefined);
        setTimeout(() => setPanelOpen(false), 300);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [panelVisible]);


  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleNew = () => {
    setPanelVisible(true);
    setTimeout(() => setPanelOpen(true), 10); // trigger slide up after mount
    setTimeout(() => setAccordionValue('add'), 400); // expand accordion content after slide up
  };

  const [showMenu, setShowMenu] = useState(true);

  // Editing state for the selected snippet
  const [editingSnippet, setEditingSnippet] = useState<typeof snippets[0] | null>(null);

  // Update editingSnippet whenever selectedId or snippets change
  useEffect(() => {
    if (selectedId !== null) {
      const selected = snippets.find(s => s.id === selectedId) || null;
      setEditingSnippet(selected ? { ...selected } : null);
    } else {
      setEditingSnippet(null);
    }
  }, [selectedId, snippets]);

  return (
    <>
      <div className="flex h-[80vh] bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">
        {/* Snippets menu (animated) */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${showMenu ? 'w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
          style={{ minWidth: showMenu ? '18rem' : '0' }}
        >
          <SnippetsList
            snippets={snippets}
            selectedId={selectedId}
            onSelect={handleSelect}
            onNew={handleNew}
            onToggleMenu={() => setShowMenu(false)}
          />
          {isLoading && <div className="p-4 text-zinc-500">Loading snippets...</div>}
          {isError && <div className="p-4 text-red-500">Failed to load snippets.</div>}
        </div>

        {/* Editor area (animated shift) */}
        <div className="flex-1 flex flex-col transition-all duration-300 min-w-0">
        <div className="flex items-center gap-2 pl-2 pr-2 pt-2 pb-0">
          {!showMenu && (
            <button
              className="mr-2 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Show snippets menu"
              onClick={() => setShowMenu(true)}
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}

        </div>
        <div className="flex-1 p-0 bg-white min-w-0 overflow-hidden">
          {selectedId !== null && (
            <SnippetEditor
              snippet={editingSnippet}
              onChange={changes => setEditingSnippet(prev => prev ? { ...prev, ...changes } : prev)}
              onSave={async (code) => {
                if (editingSnippet && editingSnippet.id) {
                  await updateSnippet({ id: editingSnippet.id, ...editingSnippet, code });
                  refetch();
                }
              }}
              onDelete={async () => {
                if (editingSnippet && editingSnippet.id) {
                  await deleteSnippet(editingSnippet.id);
                  setSelectedId(null);
                  setEditingSnippet(null);
                  refetch();
                }
              }}
              isNew={false}
            />
          )}
        </div>
        {/* Accordion for adding a new snippet */}
        {/* Animated slide-up panel for the accordion */}
        {panelVisible && (
          <div
            ref={panelRef}
            className={`fixed left-0 bottom-0 w-full z-50 flex justify-center pointer-events-auto m-0 p-0 transition-all duration-500 ease-in-out
              ${panelOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            onTransitionEnd={() => {
              if (!panelOpen) setPanelVisible(false);
            }}
          >
            <Accordion
              type="single"
              collapsible
              value={accordionValue}
              onValueChange={val => {
                setAccordionValue(val);
                if (val !== 'add') {
                  setTimeout(() => setPanelOpen(false), 300); // after accordion collapse, slide down
                }
              }}
              className="w-full max-w-4xl pointer-events-auto"
            >
              <AccordionItem value="add">
                <div className="relative">
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 text-2xl"
                    onClick={() => {
                      setAccordionValue(undefined); // collapse accordion
                      setTimeout(() => setPanelOpen(false), 300); // after collapse, slide down
                    }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <AccordionTrigger className="justify-center bg-white dark:bg-zinc-900 border-t border-x border-zinc-200 dark:border-zinc-800 rounded-t-xl px-8 py-6 text-2xl font-semibold">
                    Add Code Snippets
                  </AccordionTrigger>
                  <AccordionContent className="bg-white dark:bg-zinc-900 border-x border-b border-zinc-200 dark:border-zinc-800 rounded-b-xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Paste Code from Clipboard */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">📋</span>
                        <div>
                          <div className="font-medium">Paste Code from Clipboard <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">Ctrl V</span></div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Click anywhere in the window and paste, or drag & drop a code screenshot</div>
                        </div>
                      </div>
                      {/* Create from Scratch */}
                      <div
                        className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <span className="text-2xl">➕</span>
                        <div>
                          <div className="font-medium">Create from Scratch <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">Ctrl N</span></div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Start from scratch with a custom code snippet or text note</div>
                        </div>
                      </div>
                      {/* Use a Plugin */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">🌐</span>
                        <div>
                          <div className="font-medium">Use a Plugin <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">Ctrl I</span></div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Save, access and share your materials right within your IDE or browser</div>
                        </div>
                      </div>
                      {/* Duplicate Current */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">📄</span>
                        <div>
                          <div className="font-medium">Duplicate Current <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">Ctrl D</span></div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Duplicate the current material in focus to add edits or share with others</div>
                        </div>
                      </div>
                      {/* Snippet Discovery */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">🔍</span>
                        <div>
                          <div className="font-medium">Snippet Discovery</div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Find high frequency, highly reusable code snippets in your local projects</div>
                        </div>
                      </div>
                      {/* Describe a Snippet to Generate */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">📝</span>
                        <div>
                          <div className="font-medium">Describe a Snippet to Generate</div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Enter a natural language description to generate a snippet</div>
                        </div>
                      </div>
                      {/* Import GitHub Gists */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">🐙</span>
                        <div>
                          <div className="font-medium">Import GitHub Gists <span className="ml-2 text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">Ctrl U</span></div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Import existing GitHub Gists into Pieces for Developers with a single click</div>
                        </div>
                      </div>
                      {/* Add Files */}
                      <div className="flex items-start gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <span className="text-2xl">📎</span>
                        <div>
                          <div className="font-medium">Add Files</div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">Add local code files for safe keeping, or discover existing snippets in a file</div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </div>
    <CreateSnippetModal
      open={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      onSave={async snippet => {
        try {
          await createSnippet({
            title: snippet.name,
            language: snippet.language,
            code: snippet.code,
            tags: []
          }).unwrap();
          setShowCreateModal(false);
          refetch();
        } catch {
          alert("Failed to save snippet!");
        }
      }}
    />
  </>
  );
}
