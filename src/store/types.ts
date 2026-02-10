export type Priority = "low" | "medium" | "high";
export type Category = "work" | "personal" | "health" | "learning";
export type FilterStatus = "all" | "active" | "completed";
export type SortOrder = "newest" | "oldest";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksState {
  history: {
    past: Task[][];
    present: Task[];
    future: Task[][];
  };
  filter: FilterStatus;
  searchQuery: string;
  categoryFilter: Category | "all";
  sortOrder: SortOrder;
}
