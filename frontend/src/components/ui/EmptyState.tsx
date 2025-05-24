import React from "react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items",
  message = "Nothing to see here!",
  icon = (
    <span role="img" aria-label="Trash" style={{ fontSize: 48 }}>
      🗑️
    </span>
  ),
}) => (
  <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-400 dark:text-zinc-500">
    <div className="mb-2">{icon}</div>
    <div className="font-bold text-lg mb-1">{title}</div>
    <div className="text-sm">{message}</div>
  </div>
);
