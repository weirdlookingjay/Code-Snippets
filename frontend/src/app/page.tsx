"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StickyNote, Code2 } from "lucide-react";
import Link from "next/link";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useState } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAuthLoading = useSelector((state: RootState) => state.auth.isLoading);
  // Only fetch user if we think we're authenticated or still loading
  const { data: user, isLoading } = useRetrieveUserQuery(undefined, { skip: !isAuthenticated && !isAuthLoading });

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg animate-pulse">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="relative min-h-screen w-full bg-[#232336] font-sans">
        {/* Top Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-30 w-full bg-[#232336] shadow-sm flex items-center h-14 px-4 md:px-12">
          {/* Logo and Brand */}
          <div className="flex items-center min-w-[100px]">
            <Image
              src="/logo-white.png"
              alt="CodeHub Logo"
              width={40}
              height={40}
              className="object-contain h-10 w-10 md:h-14 md:w-14"
              priority
            />
          </div>
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-3 md:gap-6">
            <a href="#" className="text-sm text-white/80 hover:text-white transition font-medium px-2">Product</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition font-medium px-2">Use Cases</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition font-medium px-2">Plugins</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition font-medium px-2">Pricing</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition font-medium px-2">Docs</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition font-medium px-2">Blog</a>
          </nav>
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center min-w-[120px] justify-end">
            <a href="/auth/register" className="bg-white text-[#232336] font-semibold rounded-full px-5 py-2 text-sm shadow hover:bg-gray-100 transition">Get started</a>
          </div>
          {/* Hamburger for mobile */}
          <div className="flex md:hidden flex-1 justify-end">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open mobile menu"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="fixed top-14 left-0 right-0 bg-[#232336] shadow-lg border-t border-[#2e2e40] flex flex-col items-center py-4 gap-2 md:hidden animate-fade-in z-40">
              <a href="#" className="text-white/90 hover:text-white text-base font-medium py-2 w-full text-center">Product</a>
              <a href="#" className="text-white/90 hover:text-white text-base font-medium py-2 w-full text-center">Use Cases</a>
              <a href="#" className="text-white/90 hover:text-white text-base font-medium py-2 w-full text-center">Plugins</a>
              <a href="#" className="text-white/90 hover:text-white text-base font-medium py-2 w-full text-center">Pricing</a>
              <a href="#" className="text-white/90 hover:text-white text-base font-medium py-2 w-full text-center">Docs</a>
              <a href="#" className="text-white/90 hover:text-white text-base font-medium py-2 w-full text-center">Blog</a>
              <a href="/auth/register" className="mt-2 bg-white text-[#232336] font-semibold rounded-full px-6 py-2 text-base shadow hover:bg-gray-100 transition w-fit">Get started</a>
            </div>
          )}
        </header>
        {/* Header privacy badge */}
        <div className="absolute left-0 right-0 top-8 flex justify-center z-10">

        </div>
        {/* Hero Section */}
        <section className="relative flex flex-col md:flex-row items-center justify-center flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-12 gap-10 md:gap-20 z-10">
          {/* Left: Headline and CTA */}
          <div className="flex-1 flex flex-col items-start justify-center gap-8 max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-[#f3f3f3] leading-snug mb-4" style={{letterSpacing: '-0.01em'}}>
              The first notes &<br /> code snippet hub<br /> that remembers<br /> everything you work on
            </h1>
            <p className="text-lg text-[#bcbcbc] max-w-md mb-6">
              CodeHub captures, preserves, and resurfaces your notes and code snippets so you can pick up where you left off. Never lose an idea, always stay in flow.
            </p>
            <div className="flex flex-row gap-4 mt-2">
              <Button asChild size="lg" className="gap-2 bg-[#232336] hover:bg-[#232336]/80 text-white px-7 py-2 rounded-full font-semibold shadow transition border border-[#333]" variant="default">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border border-[#333] text-[#e6e6e6] px-7 py-2 rounded-full font-semibold bg-transparent hover:bg-[#232336]/60 transition">
                <Link href="mailto:support@codehub.app">Talk to us</Link>
              </Button>
            </div>
            <div className="mt-6 text-xs text-[#888]">
              Always free for individuals. Premium & team features coming soon.
            </div>
          </div>
          {/* Right: Screenshot in browser frame */}
          <div className="flex-1 flex items-center justify-center w-full max-w-xl">
            <div className="rounded-xl shadow-2xl border border-[#222] bg-[#232336] w-full max-w-lg relative overflow-hidden" style={{boxShadow: '0 8px 40px 0 rgba(0,0,0,0.45)'}}>
              {/* Browser frame bar */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-1 bg-[#232336] border-b border-[#222]">
                <span className="w-3 h-3 rounded-full bg-[#f87171] inline-block"/>
                <span className="w-3 h-3 rounded-full bg-[#fbbf24] inline-block"/>
                <span className="w-3 h-3 rounded-full bg-[#34d399] inline-block"/>
                <span className="ml-4 text-xs text-[#bcbcbc]">CodeHub Screenshot</span>
              </div>
              {/* Screenshot image */}
              <Image src="/screenshots/codehub-preview-dark.png" alt="CodeHub Screenshot" width={800} height={480} className="w-full h-auto" />
            </div>
          </div>
        </section>
        {/* Secondary Section: Tagline */}
        <section className="flex flex-col items-center justify-center py-16 px-4 bg-transparent">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            CodeHub sees everything, within your control
          </h2>
        </section>
      </main>
    );
  }

  // Logged in: show dashboard
  return (
    <main className="flex flex-col gap-8 items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user.first_name || user.email || "User"}!</h1>
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
          <h2 className="text-xl font-semibold mb-2">Your Recent Notes</h2>
          <div className="text-muted-foreground text-sm">No recent notes yet.</div>
        </div>
      </div>
    </main>
  );
}