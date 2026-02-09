import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category, FilterStatus, Task, TasksState } from "./types";
import defaultTasks from "@/lib/data.json";

const HISTORY_LIMIT = 50;

interface HistoryState {
  past: Task[][];
  present: Task[];
  future: Task[][];
}

interface FullState extends Omit<TasksState, "tasks"> {
  history: HistoryState;
}

const loadFromStorage = (): Task[] => {
  try {
    const data = localStorage.getItem("tasktracker_tasks");
    return data ? JSON.parse(data) : (defaultTasks as Task[]);
  } catch {
    return defaultTasks as Task[];
  }
};

const saveToStorage = (tasks: Task[]) => {
  localStorage.setItem("tasktracker_tasks", JSON.stringify(tasks));
};

const initialTasks = loadFromStorage();

const initialState: FullState = {
  history: {
    past: [],
    present: initialTasks,
    future: [],
  },
  filter: "all",
  searchQuery: "",
  categoryFilter: "all",
};

const pushHistory = (state: FullState) => {
  state.history.past = [
    ...state.history.past.slice(-(HISTORY_LIMIT - 1)),
    state.history.present,
  ];
  state.history.future = [];
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<
        Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">
      >,
    ) => {
      pushHistory(state);
      const now = new Date().toISOString();
      const task: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      state.history.present = [task, ...state.history.present];
      saveToStorage(state.history.present);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.history.present.find((t) => t.id === action.payload);
      if (task) {
        pushHistory(state);
        state.history.present = state.history.present.map((t) =>
          t.id === action.payload
            ? {
                ...t,
                completed: !t.completed,
                updatedAt: new Date().toISOString(),
              }
            : t,
        );
        saveToStorage(state.history.present);
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Task, "id" | "createdAt">>;
      }>,
    ) => {
      const task = state.history.present.find(
        (t) => t.id === action.payload.id,
      );
      if (task) {
        pushHistory(state);
        state.history.present = state.history.present.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                ...action.payload.updates,
                updatedAt: new Date().toISOString(),
              }
            : t,
        );
        saveToStorage(state.history.present);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      pushHistory(state);
      state.history.present = state.history.present.filter(
        (t) => t.id !== action.payload,
      );
      saveToStorage(state.history.present);
    },
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<Category | "all">) => {
      state.categoryFilter = action.payload;
    },
    reorderTasks: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) => {
      pushHistory(state);
      const { fromIndex, toIndex } = action.payload;
      const newTasks = [...state.history.present];
      const [moved] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, moved);
      state.history.present = newTasks;
      saveToStorage(state.history.present);
    },
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        state.history.past = state.history.past.slice(0, -1);
        state.history.future = [state.history.present, ...state.history.future];
        state.history.present = previous;
        saveToStorage(state.history.present);
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        state.history.future = state.history.future.slice(1);
        state.history.past = [...state.history.past, state.history.present];
        state.history.present = next;
        saveToStorage(state.history.present);
      }
    },
    importTasks: (state, action: PayloadAction<Task[]>) => {
      pushHistory(state);
      state.history.present = action.payload;
      saveToStorage(state.history.present);
    },
    clearAllTasks: (state) => {
      pushHistory(state);
      state.history.present = [];
      saveToStorage(state.history.present);
    },
  },
});

export const {
  addTask,
  toggleTask,
  updateTask,
  deleteTask,
  setFilter,
  setSearchQuery,
  setCategoryFilter,
  reorderTasks,
  undo,
  redo,
  importTasks,
  clearAllTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
