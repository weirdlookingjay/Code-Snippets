import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TagMultiSelect } from "./TagMultiSelect";
interface NoteFormProps {
  initialValues?: {
    title: string;
    content: string;
    tags?: number[];
  };
  onSubmit: (values: { title: string; content: string; tags: number[] }) => void;
  loading?: boolean;
  submitLabel?: string;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  initialValues = { title: "", content: "", tags: [] },
  onSubmit,
  loading = false,
  submitLabel = "Save Note",
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [selectedTags, setSelectedTags] = useState<number[]>(initialValues.tags || []);
  const [allTags, setAllTags] = useState<{ id: number; name: string }[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setTagsLoading(true);
      setTagsError(null);
      try {
        const res = await fetch("http://localhost:8000/api/tags/", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setAllTags(data);
      } catch { // removed unused err
        setTagsError("Could not load tags.");
      } finally {
        setTagsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, tags: selectedTags });
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="block text-base font-semibold mb-1">Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter note title"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-base font-semibold mb-1">Content</label>
        <textarea
          className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-base font-semibold mb-1">Tags <span className="text-xs text-zinc-500">(select one or more)</span></label>
        {tagsLoading ? (
          <div className="text-sm text-zinc-400">Loading tags...</div>
        ) : tagsError ? (
          <div className="text-sm text-red-500">{tagsError}</div>
        ) : (
          <TagMultiSelect
            tags={allTags}
            value={selectedTags}
            onChange={setSelectedTags}
            disabled={loading}
          />
        )}
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
  {loading ? "Saving..." : submitLabel}
</Button>
    </form>
  );
};
