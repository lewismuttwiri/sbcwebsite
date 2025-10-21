"use client";

import { ReactNode } from "react";
import FloatingChatButton from "../FloatingChatButton";

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="min-h-[calc(100vh-64px)] relative">
      {children}
      <FloatingChatButton />
    </main>
  );
}
