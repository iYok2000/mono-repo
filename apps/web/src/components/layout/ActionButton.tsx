"use client";

import { Github } from "lucide-react";

export default function ActionButton() {
  return (
    <a
      href="https://github.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] p-[10px] text-[var(--background)] opacity-100 transition duration-200 hover:opacity-90"
      aria-label="GitHub"
    >
      <Github />
    </a>
  );
}
