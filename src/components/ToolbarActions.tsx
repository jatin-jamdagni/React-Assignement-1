import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { undo, redo, importTasks } from "@/store/tasksSlice";
import {
  selectCanUndo,
  selectCanRedo,
  selectAllTasks,
} from "@/store/selectors";
import { Undo2, Redo2, Download, Upload } from "lucide-react";
import { toast } from "sonner";

const ToolbarActions = () => {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const allTasks = useAppSelector(selectAllTasks);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify(allTasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Tasks exported successfully!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const tasks = JSON.parse(event.target?.result as string);
        if (Array.isArray(tasks)) {
          dispatch(importTasks(tasks));
          toast.success(`Imported ${tasks.length} tasks!`);
        } else {
          toast.error("Invalid file format");
        }
      } catch {
        toast.error("Failed to parse file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center w-full  md:w-auto mt-3 md:mt-0 justify-end gap-1">
      <button
        onClick={() => dispatch(undo())}
        disabled={!canUndo}
        className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => dispatch(redo())}
        disabled={!canRedo}
        className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        onClick={handleExport}
        disabled={allTasks.length === 0}
        className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Export Tasks"
      >
        <Download className="h-4 w-4" />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Import Tasks"
      >
        <Upload className="h-4 w-4" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};

export default ToolbarActions;
