"use client";

import { useScrollWindow } from "./hooks";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ScrollSceneProps {
  start: number;
  end: number;
  children: ReactNode;
  className?: string;
  fadeDuration?: number;
}

export function ScrollScene({ 
  start, 
  end, 
  children, 
  className,
  fadeDuration = 400 
}: ScrollSceneProps) {
  const { active } = useScrollWindow(start, end);

  return (
    <div 
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity",
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        className
      )}
      style={{ transitionDuration: `${fadeDuration}ms` }}
    >
      {children}
    </div>
  );
}
