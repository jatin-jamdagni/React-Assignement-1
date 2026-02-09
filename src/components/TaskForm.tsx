import { useState } from "react";
import { useAppDispatch } from "@/store";
import { addTask } from "@/store/tasksSlice";
import type { Priority, Category } from "@/store/types";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const priorities: { value: Priority; label: string; dot: string }[] = [
  { value: "low", label: "Low", dot: "bg-priority-low" },
  { value: "medium", label: "Medium", dot: "bg-priority-medium" },
  { value: "high", label: "High", dot: "bg-priority-high" },
];

const categories: { value: Category; label: string }[] = [
  { value: "work", label: "💼 Work" },
  { value: "personal", label: "🏠 Personal" },
  { value: "health", label: "💪 Health" },
  { value: "learning", label: "📚 Learning" },
];

const TaskForm = () => {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return;
    dispatch(
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate || undefined,
      }),
    );
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("work");
    setDueDate("");
    setExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="task-card rounded-xl border border-border bg-card px-3 py-2 space-y-2"
    >
      <div className=" flex items-center space-x-2 ">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Plus className="h-4 w-4 text-primary" />
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task…"
          className="flex-1 bg-transparent text-sm font-medium text-card-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border  py-3 space-y-4">
              <textarea
                id="description"
                name="description"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full  p-2 text-sm rounded-md border border-border 
               placeholder:text-muxted-foreground/70 focus:outline-none 
                focus:border-primary 
               resize-none min-h-19"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Priority */}
                <div className="space-y-1 text-left">
                  <label className="text-xs  font-medium text-muted-foreground">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full  px-3 py-2 text-xs rounded-md border border-border focus:outline-none   focus:border-primary"
                  >
                    {priorities.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1  text-left">
                  <label className="text-xs   font-medium text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-border focus:outline-none  focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-1  text-left">
                  <label className="text-xs font-medium text-muted-foreground">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-lg px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default TaskForm;
