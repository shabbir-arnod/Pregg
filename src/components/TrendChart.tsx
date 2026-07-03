import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

interface TrendChartProps {
  data: Record<string, string | number>[];
  series: ChartSeries[];
  unit?: string;
  height?: number;
}

export function TrendChart({ data, series, unit, height = 260 }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400 border border-dashed border-rose-200 rounded-xl"
        style={{ height }}
      >
        No entries yet — add your first reading to see the trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1e4e8" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => format(parseISO(d), 'MMM d')}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          minTickGap={24}
        />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} unit={unit} domain={['auto', 'auto']} />
        <Tooltip
          labelFormatter={(d) => (typeof d === 'string' ? format(parseISO(d), 'MMM d, yyyy') : d)}
          contentStyle={{ borderRadius: 12, borderColor: '#fbcfe0', fontSize: 13 }}
        />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
