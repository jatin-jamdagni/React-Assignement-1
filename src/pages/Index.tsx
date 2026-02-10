import SearchAndFilters from "@/components/SearchAndFilters";
import StatsBar from "@/components/StatsBar";
import StatsDashboard from "@/components/StatsDashboard";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import ToolbarActions from "@/components/ToolbarActions";
import { CheckSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto md:max-w-2xl py-2 md:py-12">
        <header className="mb-8 flex flex-col md:flex-row items-start justify-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="rounded-lg bg-primary/70 p-2">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                Task Tracker
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">
              Stay organized, stay productive
            </p>
          </div>
          <ToolbarActions />
        </header>

        <div className="space-y-6">
          <StatsBar />
          <StatsDashboard />
          <TaskForm />
          <SearchAndFilters />
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Index;
