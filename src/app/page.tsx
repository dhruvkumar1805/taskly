"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    const tempId = Date.now();
    const newTask = {
      id: tempId,
      title,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      const savedTask = await res.json();

      setTasks((prev) => prev.map((t) => (t.id === tempId ? savedTask : t)));
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    const prevTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !completed }),
      });
      const updated = await res.json();

      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setTasks(prevTasks);
    }
  };

  const deleteTask = async (id: number) => {
    const prevTasks = tasks;

    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch {
      setTasks(prevTasks);
    }
  };

  const saveEdit = async (id: number) => {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }

    const prevTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: editingTitle } : t))
    );
    setEditingId(null);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: editingTitle }),
      });
      const updated = await res.json();

      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setTasks(prevTasks);
    }
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />
        <button className="bg-blue-500 text-white px-4" onClick={addTask}>
          Add
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2">
            {editingId === task.id ? (
              <input
                className="border p-1 flex-1 mr-2"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(task.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => toggleTask(task.id, task.completed)}
                className={`cursor-pointer flex-1 ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </span>
            )}

            <div className="flex gap-2">
              <button
                className="text-blue-500"
                onClick={() => {
                  setEditingId(task.id);
                  setEditingTitle(task.title);
                }}
              >
                ✏️
              </button>
              <button
                className="text-red-500"
                onClick={() => deleteTask(task.id)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
