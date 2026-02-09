import { useState, forwardRef } from "react";
import { useAppDispatch } from "@/store";
import { toggleTask, deleteTask, updateTask } from "@/store/tasksSlice";
import type { Task, Priority, Category } from "@/store/types";
import {
  Check,
  Trash2,
  Pencil,
  X,
  Save,
  GripVertical,
  Calendar,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { PRIORITY_COLORS } from "@/lib/color";

const categoryLabels: Record<Category, string> = {
  work: "💼",
  personal: "🏠",
  health: "💪",
  learning: "📚",
};

const priorities: { value: Priority; label: string; dot: string }[] = [
  { value: "low", label: "Low", dot: `bg-[${PRIORITY_COLORS.low}]` },
  { value: "medium", label: "Medium", dot: `bg-[${PRIORITY_COLORS.medium}]` },
  { value: "high", label: "High", dot: `bg-[${PRIORITY_COLORS.high}]` },
];

const categories: { value: Category; label: string }[] = [
  { value: "work", label: "💼 Work" },
  { value: "personal", label: "🏠 Personal" },
  { value: "health", label: "💪 Health" },
  { value: "learning", label: "📚 Learning" },
];

interface TaskItemProps {
  task: Task;
  index: number;
}

interface SortableTaskItemProps extends TaskItemProps {
  style?: React.CSSProperties;
  isDragging?: boolean;
  handleProps?: {
    attributes: React.HTMLAttributes<HTMLElement>;
    listeners: ReturnType<typeof useSortable>["listeners"];
  };
}

const SortableTaskItem = forwardRef<HTMLDivElement, SortableTaskItemProps>(
  ({ task, style, isDragging, handleProps }, ref) => {
    const dispatch = useAppDispatch();
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);
    const [editPriority, setEditPriority] = useState(task.priority);
    const [editCategory, setEditCategory] = useState(task.category);
    const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

    const handleSave = () => {
      if (!editTitle.trim()) return;
      dispatch(
        updateTask({
          id: task.id,
          updates: {
            title: editTitle.trim(),
            description: editDesc.trim(),
            priority: editPriority,
            category: editCategory,
            dueDate: editDueDate || undefined,
          },
        }),
      );
      setEditing(false);
    };

    if (editing) {
      return (
        <div
          ref={ref}
          style={style}
          className={`task-card rounded-lg border border-border bg-card p-3 ${isDragging ? "opacity-60" : ""}`}
        >
          <div className="space-y-2.5">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-card-foreground focus:outline-none border-b border-border pb-1.5"
              autoFocus
              placeholder="Task title…"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none resize-none"
              placeholder="Add a description…"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Priority
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Category)}
                  className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-1.5 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleSave}
                className="rounded-md px-2.5 py-1.5 bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Save className="h-3 w-3" /> Save
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        style={style}
        className={`task-card group rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-200 ${
          isDragging ? "opacity-60 shadow-lg" : ""
        } ${task.completed ? "opacity-70" : ""}`}
      >
        <div className="flex items-start gap-2.5 p-3">
          {/* Drag Handle */}
          <button
            {...handleProps?.attributes}
            {...handleProps?.listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors touch-none"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Checkbox */}
          <button
            onClick={() => dispatch(toggleTask(task.id))}
            className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? "bg-priority-low border-priority-low"
                : "border-muted-foreground/30 hover:border-primary"
            }`}
          >
            {task.completed && <Check className="h-3 w-3 text-primary " />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Description */}
            <div className="mb-2">
              <h3
                className={`text-sm font-medium leading-tight mb-0.5 ${
                  task.completed
                    ? "line-through text-muted-foreground/60"
                    : "text-card-foreground"
                }`}
                title={task.title}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-xs text-muted-foreground line-clamp-1 leading-relaxed
                     ${
                       task.completed
                         ? "line-through text-muted-foreground/60"
                         : "text-card-foreground"
                     }
                    `}
                  title={task.description}
                >
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Priority with dot */}
              <div className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      PRIORITY_COLORS[
                        task.priority as keyof typeof PRIORITY_COLORS
                      ],
                  }}
                />

                <span className="text-muted-foreground capitalize">
                  {task.priority}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center gap-1">
                <span className="text-sm">{categoryLabels[task.category]}</span>
                <span className="text-muted-foreground capitalize">
                  {task.category}
                </span>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span
                    className={`font-medium ${(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const due = new Date(task.dueDate);
                      due.setHours(0, 0, 0, 0);
                      const diffTime = due.getTime() - today.getTime();
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24),
                      );

                      if (diffDays < 0) return "text-destructive";
                      if (diffDays === 0)
                        return "text-amber-600 dark:text-amber-500";
                      if (diffDays <= 3)
                        return "text-blue-600 dark:text-blue-400";
                      return "text-muted-foreground";
                    })()}`}
                  >
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <button
              onClick={() => {
                setEditTitle(task.title);
                setEditDesc(task.description);
                setEditPriority(task.priority);
                setEditCategory(task.category);
                setEditDueDate(task.dueDate || "");
                setEditing(true);
              }}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => dispatch(deleteTask(task.id))}
              className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

SortableTaskItem.displayName = "SortableTaskItem";

const TaskItem = ({ task, index }: TaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    >
      <SortableTaskItem
        ref={setNodeRef}
        task={task}
        index={index}
        style={style}
        isDragging={isDragging}
        handleProps={{ attributes, listeners }}
      />
    </motion.div>
  );
};

export default TaskItem;
