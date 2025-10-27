import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface VoteResultsChartProps {
  data: { text: string; votes: number }[];
}

const COLORS = ['hsl(262, 83%, 58%)', 'hsl(291, 64%, 62%)', 'hsl(320, 65%, 67%)', 'hsl(340, 75%, 65%)', 'hsl(10, 80%, 60%)'];

const VoteResultsChart = ({ data }: VoteResultsChartProps) => {
  const chartData = data.map((option) => ({
    name: option.text.length > 20 ? option.text.substring(0, 20) + '...' : option.text,
    votes: option.votes,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={80}
          stroke="hsl(var(--foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          stroke="hsl(var(--foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          allowDecimals={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VoteResultsChart;
