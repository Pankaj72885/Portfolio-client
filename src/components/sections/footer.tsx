"use client";

import { Github, Heart, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  name?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export function Footer({ name = "Pankaj Bepari", socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <span className="text-lg font-bold text-white">PB</span>
            </div>
            <span className="text-lg font-semibold text-white">{name}</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            <Link
              href="#skills"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Skills
            </Link>
            <Link
              href="#experience"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Experience
            </Link>
            <Link
              href="#projects"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="#contact"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks?.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-500">
            © {currentYear} {name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-600">
            Made with{" "}
            <Heart className="h-3 w-3 text-red-500" fill="currentColor" /> using
            Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
