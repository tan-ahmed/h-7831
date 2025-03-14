
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import { Habit } from '@/lib/habitData';

type ProgressChartProps = {
  habits: Habit[];
  days?: number;
};

const ProgressChart = ({ habits, days = 7 }: ProgressChartProps) => {
  // Generate data for the last N days
  const generateChartData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      const dayStr = format(date, 'dd MMM');
      
      // Calculate completion rate for this day
      const dayCompletions = habits.map(habit => {
        const completion = habit.completions.find(c => 
          format(new Date(c.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        return completion?.completed || false;
      });
      
      const completedCount = dayCompletions.filter(Boolean).length;
      const totalHabits = habits.length;
      const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
      
      return {
        name: dayStr,
        value: completionRate,
        completed: completedCount,
        total: totalHabits,
        formattedDate: format(date, 'EEEE, MMMM d')
      };
    });
  };
  
  const data = generateChartData();
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { formattedDate, value, completed, total } = payload[0].payload;
      
      return (
        <div className="bg-card p-3 rounded-lg shadow-md border text-sm">
          <p className="font-medium">{formattedDate}</p>
          <p className="mt-1 text-muted-foreground">
            {completed} of {total} habits completed
          </p>
          <p className="mt-1 font-medium text-primary">{value}% completion</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-4 h-full">
      <h3 className="font-medium mb-6">Habit Completion Rate</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`rgba(37, 99, 235, ${0.4 + (entry.value / 200)})`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
