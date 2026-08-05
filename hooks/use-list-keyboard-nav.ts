"use client";

import { useEffect, useRef, useState } from "react";

type Handlers = {
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * j/k (or arrows) to move a selection through a flat, visually-ordered list
 * of ids; enter/e/x/backspace act on whatever's selected. Disabled whenever
 * a dialog is open so it never fights a focused input or a date picker.
 */
export function useListKeyboardNav(ids: string[], handlers: Handlers, enabled = true) {
  const [rawSelectedId, setSelectedId] = useState<string | null>(null);
  // Derived at render time rather than synced via effect: if the selected
  // row disappears from the list (deleted, filtered out), it just stops
  // being selected on the next render instead of needing its own effect.
  const selectedId = rawSelectedId && ids.includes(rawSelectedId) ? rawSelectedId : null;

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isTyping || e.metaKey || e.ctrlKey || e.altKey || ids.length === 0) return;

      const currentIndex = selectedId ? ids.indexOf(selectedId) : -1;

      switch (e.key) {
        case "j":
        case "ArrowDown": {
          e.preventDefault();
          setSelectedId(ids[Math.min(currentIndex + 1, ids.length - 1)]);
          break;
        }
        case "k":
        case "ArrowUp": {
          e.preventDefault();
          setSelectedId(ids[Math.max(currentIndex - 1, 0)]);
          break;
        }
        case "Enter":
          if (selectedId) {
            e.preventDefault();
            handlersRef.current.onOpen(selectedId);
          }
          break;
        case "e":
          if (selectedId) {
            e.preventDefault();
            handlersRef.current.onEdit(selectedId);
          }
          break;
        case "x":
        case " ":
          if (selectedId) {
            e.preventDefault();
            handlersRef.current.onToggleCompleted(selectedId);
          }
          break;
        case "Backspace":
          if (selectedId) {
            e.preventDefault();
            handlersRef.current.onDelete(selectedId);
          }
          break;
        case "Escape":
          setSelectedId(null);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ids, selectedId, enabled]);

  return { selectedId, setSelectedId };
}
