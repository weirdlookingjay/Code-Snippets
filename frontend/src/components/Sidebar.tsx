import Image from "next/image";
import Link from "next/link";
import { Home, StickyNote, Code2, Tag, Search, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../../public/code-snippet-logo.svg"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Trash", href: "/notes/trash", icon: Trash2 },
  { label: "Snippets", href: "/snippets", icon: Code2 },
  { label: "Tags", href: "/tags", icon: Tag },
  { label: "Search", href: "/search", icon: Search },
  { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("h-full w-64 bg-background border-r hidden md:flex flex-col", className)}>
      <div className="flex items-center justify-center h-16 border-b">
        <Image src={Logo} alt="CodeHub Logo" width={50} height={50} />
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center px-4 py-2 rounded-md hover:bg-accent transition-colors group"
              >
                <Icon className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
