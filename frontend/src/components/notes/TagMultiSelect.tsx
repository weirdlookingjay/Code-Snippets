import React, { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

interface Tag {
  id: number;
  name: string;
}

interface TagMultiSelectProps {
  tags: Tag[];
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export const TagMultiSelect: React.FC<TagMultiSelectProps> = ({ tags, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (tagId: number) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
    setOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between min-h-[40px]"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-zinc-400">Select tags...</span>
          ) : (
            tags.filter((tag) => value.includes(tag.id)).map((tag) => (
              <span key={tag.id} className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {tag.name}
              </span>
            ))
          )}
        </div>
        <ChevronDownIcon className="ml-2 size-4 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg max-h-56 overflow-auto animate-in fade-in">
          <ul className="py-1" role="listbox">
            {tags.length === 0 ? (
              <li className="px-4 py-2 text-zinc-400">No tags</li>
            ) : (
              tags.map((tag) => (
                <li
                  key={tag.id}
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${value.includes(tag.id) ? "bg-blue-50 dark:bg-blue-900" : ""}`}
                  onClick={() => handleToggle(tag.id)}
                  aria-selected={value.includes(tag.id)}
                >
                  <span className="flex-1">{tag.name}</span>
                  {value.includes(tag.id) && <CheckIcon className="size-4 text-blue-600" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
