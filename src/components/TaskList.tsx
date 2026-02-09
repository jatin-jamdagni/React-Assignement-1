import { useAppSelector, useAppDispatch } from "@/store";
import { selectFilteredTasks, selectAllTasks } from "@/store/selectors";
import { reorderTasks } from "@/store/tasksSlice";
import type { Task } from "@/store";
import TaskItem from "./TaskItem";
import { AnimatePresence } from "motion/react";
import { ClipboardList } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const TaskList = () => {
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const allTasks = useAppSelector(selectAllTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = allTasks.findIndex((t: Task) => t.id === active.id);
      const toIndex = allTasks.findIndex((t: Task) => t.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        dispatch(reorderTasks({ fromIndex, toIndex }));
      }
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No tasks found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Create a new task to get started
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTasks.map((t: Task) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, i) => (
              <TaskItem key={task.id} task={task} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;
