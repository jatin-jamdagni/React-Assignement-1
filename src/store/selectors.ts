import { createSelector } from "@reduxjs/toolkit";
import type { RootState, Task, TasksState } from "./index";

const selectTasksState = (state: RootState): TasksState => state.tasks;
const selectTasks = (state: RootState): Task[] => state.tasks.history.present;

export const selectFilteredTasks = createSelector(
  [selectTasksState, selectTasks],
  (
    { filter, searchQuery, categoryFilter }: TasksState,
    tasks: Task[],
  ): Task[] => {
    let filtered = tasks;

    if (filter === "active")
      filtered = filtered.filter((t: Task) => !t.completed);
    else if (filter === "completed")
      filtered = filtered.filter((t: Task) => t.completed);

    if (categoryFilter !== "all")
      filtered = filtered.filter((t: Task) => t.category === categoryFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t: Task) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    return filtered;
  },
);

export const selectAllTasks = createSelector(
  [selectTasks],
  (tasks: Task[]): Task[] => [...tasks],
);

export const selectTaskStats = createSelector(
  [selectTasks],
  (tasks: Task[]) => ({
    total: tasks.length,
    completed: tasks.filter((t: Task) => t.completed).length,
    active: tasks.filter((t: Task) => !t.completed).length,
    byPriority: {
      high: tasks.filter((t: Task) => t.priority === "high" && !t.completed)
        .length,
      medium: tasks.filter((t: Task) => t.priority === "medium" && !t.completed)
        .length,
      low: tasks.filter((t: Task) => t.priority === "low" && !t.completed)
        .length,
    },
    byCategory: {
      work: tasks.filter((t: Task) => t.category === "work").length,
      personal: tasks.filter((t: Task) => t.category === "personal").length,
      health: tasks.filter((t: Task) => t.category === "health").length,
      learning: tasks.filter((t: Task) => t.category === "learning").length,
    },
    completedByCategory: {
      work: tasks.filter((t: Task) => t.category === "work" && t.completed)
        .length,
      personal: tasks.filter(
        (t: Task) => t.category === "personal" && t.completed,
      ).length,
      health: tasks.filter((t: Task) => t.category === "health" && t.completed)
        .length,
      learning: tasks.filter(
        (t: Task) => t.category === "learning" && t.completed,
      ).length,
    },
  }),
);

export const selectCanUndo = (state: RootState) =>
  state.tasks.history.past.length > 0;
export const selectCanRedo = (state: RootState) =>
  state.tasks.history.future.length > 0;
