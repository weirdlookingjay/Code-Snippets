"use client"

import { useState, useRef, useEffect } from "react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import md5 from "blueimp-md5";
import Image from "next/image";

function getGravatarUrl(email: string, size = 32) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export function TopBar() {
  const { data: user } = useRetrieveUserQuery();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b bg-background">
      <div className="font-bold text-xl tracking-tight">NoteApp</div>
      <div className="flex items-center gap-2 relative">
        <ModeToggle />
        {user && (
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User menu"
              className="rounded-full overflow-hidden p-0 border border-border"
              onClick={() => setOpen((v) => !v)}
            >
              <Image
                src={getGravatarUrl(user.email)}
                alt="User avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full bg-muted"
                unoptimized
              />
            </Button>
            {open && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded shadow-lg z-50 dark:bg-neutral-900">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Image
                    src={getGravatarUrl(user.email)}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full bg-muted"
                    unoptimized
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground leading-tight">{user.first_name} {user.last_name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                  </div>
                </div>
                <div className="border-t border-border my-1" />
                {/* Actions */}
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-foreground hover:bg-accent transition"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-accent transition"
                  onClick={() => { setOpen(false); window.location.href = "/auth/logout"; }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

