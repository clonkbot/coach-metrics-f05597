interface Entry {
  _id: string;
  date: string;
  revenue: number;
}

interface WeeklyChartProps {
  entries: Entry[];
}

export function WeeklyChart({ entries }: WeeklyChartProps) {
  // Get last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  // Map entries to days
  const dataByDate = new Map(entries.map((e) => [e.date, e.revenue]));
  const data = last7Days.map((date) => ({
    date,
    revenue: dataByDate.get(date) ?? 0,
    dayLabel: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
  }));

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((day, index) => {
        const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
        const isToday = day.date === today.toISOString().split("T")[0];

        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full h-24 flex items-end justify-center">
              <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out ${
                  isToday
                    ? "bg-gradient-to-t from-amber-500 to-amber-400"
                    : "bg-gradient-to-t from-white/10 to-white/5"
                }`}
                style={{
                  height: `${Math.max(height, 4)}%`,
                  animationDelay: `${index * 50}ms`,
                }}
              />
              {day.revenue > 0 && (
                <span className="absolute -top-5 text-[10px] text-white/40 font-medium">
                  ${day.revenue >= 1000 ? `${(day.revenue / 1000).toFixed(1)}k` : day.revenue}
                </span>
              )}
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${isToday ? "text-amber-400 font-medium" : "text-white/30"}`}>
              {day.dayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
