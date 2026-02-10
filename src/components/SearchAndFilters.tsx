import { Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSearchQuery,
  setFilter,
  setCategoryFilter,
  setSortOrder,
} from "@/store/tasksSlice";
import type { Category, FilterStatus, SortOrder } from "@/store/types";

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
];

const categoryOptions: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "work", label: "💼 Work" },
  { value: "personal", label: "🏠 Personal" },
  { value: "health", label: "💪 Health" },
  { value: "learning", label: "📚 Learning" },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const SearchAndFilters = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, filter, categoryFilter, sortOrder } = useAppSelector(
    (s) => s.tasks,
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full rounded-lg border border-border bg-card pl-10 pr-10 py-2 text-sm text-card-foreground placeholder:text-muted-foreground placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button
            onClick={() => dispatch(setSearchQuery(""))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <div className=" w-full md:w-auto flex items-center justify-between md:justify-center gap-2 ">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => dispatch(setFilter(opt.value))}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-border overflow-hidden">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => dispatch(setSortOrder(opt.value))}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  sortOrder === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex rounded-lg border border-border overflow-hidden">
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => dispatch(setCategoryFilter(opt.value))}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
