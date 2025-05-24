import Image from "next/image";

import { Button } from "@/components/ui/button";
import { StickyNote, Code2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-2xl mx-auto py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-center">Welcome to CodeHub</h1>
        <p className="text-lg text-muted-foreground text-center max-w-lg">
          Create, organize, and manage your notes and code snippets with a beautiful, modern interface.
        </p>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          <span>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            {' '}or{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link>
          </span>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Button size="lg" className="gap-2" variant="default">
          <StickyNote className="w-5 h-5" /> New Note
        </Button>
        <Button size="lg" className="gap-2" variant="secondary">
          <Code2 className="w-5 h-5" /> New Snippet
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold mb-2">Recent Notes</h2>
          <div className="text-muted-foreground text-sm">No recent notes yet.</div>
        </div>
      </div>
      <footer className="flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </section>
  );
}
