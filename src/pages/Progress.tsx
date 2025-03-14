
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, subMonths } from 'date-fns';
import { habits } from '@/lib/habitData';
import ProgressChart from '@/components/ProgressChart';
import CalendarView from '@/components/CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Progress = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Selected habit for calendar view
  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  // Generate trend data
  const generateTrendData = () => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;
    const today = new Date();
    
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - i - 1);
      const dayStr = format(date, days > 30 ? 'MMM dd' : 'EEE');
      
      // Calculate completion rate for this day
      const dayCompletions = habits.map(habit => {
        const completion = habit.completions.find(c => 
          format(new Date(c.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        return completion?.completed || false;
      });
      
      const completedCount = dayCompletions.filter(Boolean).length;
      const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
      
      return {
        name: dayStr,
        date: format(date, 'yyyy-MM-dd'),
        completed: completedCount,
        total: habits.length,
        rate: completionRate
      };
    });
  };

  const trendData = generateTrendData();
  
  // Calculate overall stats
  const calculateStats = () => {
    if (habits.length === 0) return { completionRate: 0, totalCompleted: 0, averageStreak: 0 };
    
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
    const totalPossibleCompletions = habits.reduce((sum, habit) => {
      const daysSinceCreation = Math.floor((new Date().getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + daysSinceCreation;
    }, 0);
    
    const overallCompletionRate = Math.round((totalCompletions / totalPossibleCompletions) * 100);
    const averageStreak = Math.round(habits.reduce((sum, habit) => sum + habit.streak, 0) / habits.length);
    
    return {
      completionRate: overallCompletionRate,
      totalCompleted: totalCompletions,
      averageStreak
    };
  };
  
  const stats = calculateStats();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };
  
  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <Card className="p-3 shadow-md border">
          <CardContent className="p-0">
            <p className="font-medium">
              {format(new Date(data.date), 'MMMM d, yyyy')} 
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {data.completed} of {data.total} habits completed
            </p>
            <p className="text-sm font-medium text-primary mt-1">
              {data.rate}% completion rate
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Insights & Progress</h1>
        <p className="text-muted-foreground">Track your habit consistency and progress over time.</p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Completion</CardTitle>
              <CardDescription>All-time progress rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative size-32">
                  <svg className="size-32" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--secondary))"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="10"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * stats.completionRate) / 100}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{stats.completionRate}%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-medium">{stats.totalCompleted}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg. Streak</p>
                  <p className="font-medium">{stats.averageStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Completion Trends
              </CardTitle>
              <CardDescription>
                <div className="flex justify-between items-center">
                  <span>Your daily progress over time</span>
                  <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-auto">
                    <TabsList className="h-8">
                      <TabsTrigger 
                        className="text-xs h-8 px-2" 
                        value="week"
                      >
                        Week
                      </TabsTrigger>
                      <TabsTrigger 
                        className="text-xs h-8 px-2" 
                        value="month"
                      >
                        Month
                      </TabsTrigger>
                      <TabsTrigger 
                        className="text-xs h-8 px-2" 
                        value="quarter"
                      >
                        3 Months
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Breakdown</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ProgressChart habits={habits} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Calendar</CardTitle>
            <CardDescription>
              <div className="flex justify-between items-center">
                <span>Visualize your habit streaks</span>
                {habits.length > 0 && (
                  <select
                    className="text-sm py-1 px-2 rounded border bg-card"
                    value={selectedHabitId}
                    onChange={e => setSelectedHabitId(e.target.value)}
                  >
                    {habits.map(habit => (
                      <option key={habit.id} value={habit.id}>{habit.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarView 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              habit={selectedHabit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
