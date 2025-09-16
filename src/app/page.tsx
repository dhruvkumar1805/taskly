"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
  });

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Taskly</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 text-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
          />
          <button className="bg-blue-500 text-white px-4" onClick={addTask}>
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                filter === f
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter(f as "all" | "active" | "completed")}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              {editingId === task.id ? (
                <input
                  className="border p-1 flex-1 mr-2 rounded text-gray-500"
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
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </span>
              )}

              <div className="flex gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  onClick={() => {
                    setEditingId(task.id);
                    setEditingTitle(task.title);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  onClick={() => deleteTask(task.id)}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
