import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [tags, setTags] = useState(initialValues.tags?.join(",") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagIds = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map(Number);
    onSubmit({ title, content, tags: tagIds });
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
        <label className="block text-base font-semibold mb-1">Tags <span className="text-xs text-zinc-500">(comma-separated IDs)</span></label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. 1,2,3"
        />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
  {loading ? "Saving..." : submitLabel}
</Button>
    </form>
  );
};
