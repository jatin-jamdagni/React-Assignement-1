import { useAppSelector } from "@/store";
import { selectTaskStats } from "@/store/selectors";
import { CheckCircle2, Circle, Flame, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-lg border border-border bg-card p-4 flex items-center gap-3`}
  >
    <div className={`rounded-full p-2 ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-2xl font-display font-bold text-card-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground truncate">{label}</p>
    </div>
  </motion.div>
);

const StatsBar = () => {
  const stats = useAppSelector(selectTaskStats);
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Total"
        value={stats.total}
        icon={Circle}
        color="bg-secondary text-secondary-foreground"
      />
      <StatCard
        label="Done"
        value={stats.completed}
        icon={CheckCircle2}
        color="bg-priority-low/15 text-priority-low"
      />
      <StatCard
        label="Active"
        value={stats.active}
        icon={TrendingUp}
        color="bg-primary/10 text-primary"
      />
      <StatCard
        label="Progress"
        value={completionRate}
        icon={Flame}
        color="bg-accent/15 text-accent"
      />
    </div>
  );
};

export default StatsBar;
