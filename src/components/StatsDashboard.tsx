import { useAppSelector } from "@/store";
import { selectTaskStats } from "@/store/selectors";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Target, CheckCircle2 } from "lucide-react";
import { CATEGORY_COLORS, PRIORITY_COLORS } from "@/lib/color";

const StatsDashboard = () => {
  const stats = useAppSelector(selectTaskStats);
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const priorityData = [
    { name: "High", value: stats.byPriority.high, fill: PRIORITY_COLORS.high },
    {
      name: "Medium",
      value: stats.byPriority.medium,
      fill: PRIORITY_COLORS.medium,
    },
    { name: "Low", value: stats.byPriority.low, fill: PRIORITY_COLORS.low },
  ].filter((d) => d.value > 0);

  const categoryData = [
    {
      name: "Work",
      total: stats.byCategory.work,
      completed: stats.completedByCategory.work,
      fill: CATEGORY_COLORS.work,
    },
    {
      name: "Personal",
      total: stats.byCategory.personal,
      completed: stats.completedByCategory.personal,
      fill: CATEGORY_COLORS.personal,
    },
    {
      name: "Health",
      total: stats.byCategory.health,
      completed: stats.completedByCategory.health,
      fill: CATEGORY_COLORS.health,
    },
    {
      name: "Learning",
      total: stats.byCategory.learning,
      completed: stats.completedByCategory.learning,
      fill: CATEGORY_COLORS.learning,
    },
  ].filter((d) => d.total > 0);

  if (stats.total === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Target className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          No tasks created yet.
          <br />
          Add some tasks to see your statistics!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-card overflow-hidden "
    >
      <div className="border-b border-border px-5 py-3 flex items-center gap-2.5 bg-muted/30">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground tracking-tight">
          Task Statistics
        </h3>
      </div>

      <div className="p-4 sm:p-5 grid gap-4 md:grid-cols-3">
        {/* 1. Completion Rate */}
        <div className="flex flex-col items-center justify-center p-5 bg-secondary/40 rounded-xl">
          <div className="relative w-28 h-28">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { value: completionRate, fill: "#10b981" },
                    { value: 100 - completionRate, fill: "hsl(var(--muted))" },
                  ]}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={1}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-card-foreground">
                  {completionRate}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground font-medium">
            Completion Rate
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-medium text-card-foreground">
              {stats.completed} / {stats.total}
            </span>
          </div>
        </div>

        {/* 2. Priority Breakdown */}
        <div className="flex flex-col items-center p-5 bg-secondary/40 rounded-xl">
          {priorityData.length > 0 ? (
            <>
              <div className="w-28 h-28">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      dataKey="value"
                      innerRadius={32}
                      outerRadius={48}
                      paddingAngle={4}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "8px 12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <p className="mt-3 text-xs text-muted-foreground font-medium">
                Active Tasks by Priority
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {priorityData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      {d.name} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <CheckCircle2 className="h-10 w-10 text-emerald-500/60 mb-2" />
              <p className="text-sm text-muted-foreground">
                All tasks completed!
              </p>
            </div>
          )}
        </div>

        {/* 3. Category Progress */}
        <div className="flex flex-col p-5 bg-secondary/40 rounded-xl">
          <p className="text-xs text-muted-foreground font-medium text-center mb-4">
            Progress by Category
          </p>

          {categoryData.length > 0 ? (
            <>
              <div className="flex-1 min-h-[90px]">
                <ResponsiveContainer>
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    barCategoryGap={6}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={11}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "8px 12px",
                      }}
                      formatter={(
                        value: number | undefined,
                        name: string | undefined,
                      ) => [
                        value ?? 0,
                        name === "total" ? "Total" : "Completed",
                      ]}
                    />
                    <Bar dataKey="total" fill="hsl(var(--muted))" radius={4} />
                    <Bar
                      dataKey="completed"
                      radius={4}
                      shape={(props: any) => {
                        const { fill, x, y, width, height, index } = props;
                        const dataItem = categoryData[index];
                        return (
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={dataItem?.fill || fill}
                            rx={4}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {categoryData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span className="text-muted-foreground font-medium">
                      {d.name}: {d.completed}/{d.total}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No categorized tasks yet
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsDashboard;
