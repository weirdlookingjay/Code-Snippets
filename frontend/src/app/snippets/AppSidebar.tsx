import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus, Code2 } from "lucide-react";
import { Snippet } from "./SnippetsList";

interface AppSidebarProps {
  snippets: Snippet[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
}

export function AppSidebar({ snippets, selectedId, onSelect, onNew }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Snippets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {snippets.map((snippet) => (
                <SidebarMenuItem key={snippet.id}>
                  <SidebarMenuButton asChild>
                    <button
                      className={`flex items-center w-full text-left ${selectedId === snippet.id ? "bg-blue-100 dark:bg-zinc-800 font-bold" : ""}`}
                      onClick={() => onSelect(snippet.id)}
                    >
                      <Code2 className="mr-2 w-4 h-4" />
                      <span className="truncate flex-1">{snippet.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <button
              className="mt-4 w-full flex items-center justify-center gap-2 rounded bg-blue-500 hover:bg-blue-600 text-white px-3 py-2"
              onClick={onNew}
            >
              <Plus className="w-4 h-4" /> New Snippet
            </button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
