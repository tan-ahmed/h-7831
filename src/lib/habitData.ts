
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Types for our habit tracking data
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Completion = {
  date: Date;
  completed: boolean;
  note?: string;
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  category: Category;
  completions: Completion[];
  createdAt: Date;
  streak: number;
  bestStreak: number;
  totalCompletions: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  requiredProgress: number;
};

// Initial categories
export const categories: Category[] = [
  { id: '1', name: 'Health', color: 'rgb(239, 68, 68)' },
  { id: '2', name: 'Productivity', color: 'rgb(59, 130, 246)' },
  { id: '3', name: 'Learning', color: 'rgb(16, 185, 129)' },
  { id: '4', name: 'Mindfulness', color: 'rgb(139, 92, 246)' },
  { id: '5', name: 'Finance', color: 'rgb(245, 158, 11)' },
];

// Initial set of habits
export const habits: Habit[] = [
  {
    id: '1',
    name: 'Morning meditation',
    description: 'Start the day with 10 minutes of meditation',
    category: categories[3],
    completions: getRandomCompletions(45),
    createdAt: new Date('2023-12-01'),
    streak: 7,
    bestStreak: 14,
    totalCompletions: 34,
  },
  {
    id: '2',
    name: 'Read a book',
    description: 'Read for at least 30 minutes',
    category: categories[2],
    completions: getRandomCompletions(30),
    createdAt: new Date('2023-12-15'),
    streak: 3,
    bestStreak: 12,
    totalCompletions: 22,
  },
  {
    id: '3',
    name: 'Exercise',
    description: 'At least 30 minutes of physical activity',
    category: categories[0],
    completions: getRandomCompletions(60),
    createdAt: new Date('2023-11-01'),
    streak: 0,
    bestStreak: 21,
    totalCompletions: 40,
  },
  {
    id: '4',
    name: 'Track expenses',
    description: 'Log daily expenses',
    category: categories[4],
    completions: getRandomCompletions(20),
    createdAt: new Date('2024-01-01'),
    streak: 5,
    bestStreak: 10,
    totalCompletions: 15,
  },
];

// Initial set of badges
export const badges: Badge[] = [
  {
    id: '1',
    name: 'Early Bird',
    description: 'Complete a habit for 7 days in a row',
    icon: 'sunrise',
    unlockedAt: new Date('2024-01-14'),
    progress: 100,
    requiredProgress: 100,
  },
  {
    id: '2',
    name: 'Consistency Master',
    description: 'Complete a habit for 30 days in a row',
    icon: 'award',
    progress: 60,
    requiredProgress: 100,
  },
  {
    id: '3',
    name: 'Habit Explorer',
    description: 'Create 5 different habits',
    icon: 'compass',
    progress: 80,
    requiredProgress: 100,
  },
  {
    id: '4',
    name: 'Perfect Week',
    description: 'Complete all habits for a full week',
    icon: 'checkSquare',
    progress: 30,
    requiredProgress: 100,
  },
];

// Helper function to generate random completions for demo data
function getRandomCompletions(days: number): Completion[] {
  const completions: Completion[] = [];
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < days; i++) {
    const date = addDays(currentDate, -i);
    const completed = Math.random() > 0.3; // 70% chance of completion for demo data
    completions.push({
      date,
      completed,
    });
  }
  
  return completions;
}

// Get current streak for a habit
export function getCurrentStreak(completions: Completion[]): number {
  if (!completions.length) return 0;
  
  let streak = 0;
  const sortedCompletions = [...completions].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentDate = today;
  
  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);
    
    if (isSameDay(completionDate, currentDate) && completion.completed) {
      streak++;
      currentDate = addDays(currentDate, -1);
    } else if (isSameDay(completionDate, currentDate) && !completion.completed) {
      break;
    } else if (completionDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

// Get month data for calendar view
export function getMonthData(date: Date, habitId: string) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return daysInMonth.map(date => ({ date, completed: false }));
  
  return daysInMonth.map(date => {
    const completion = habit.completions.find(c => 
      isSameDay(new Date(c.date), date)
    );
    return {
      date,
      completed: completion ? completion.completed : false
    };
  });
}

// Toggle habit completion for a specific date
export function toggleHabitCompletion(habitId: string, date: Date): Habit[] {
  return habits.map(habit => {
    if (habit.id !== habitId) return habit;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingIndex = habit.completions.findIndex(c => 
      format(new Date(c.date), 'yyyy-MM-dd') === dateStr
    );
    
    let newCompletions = [...habit.completions];
    
    if (existingIndex >= 0) {
      // Toggle existing completion
      newCompletions[existingIndex] = {
        ...newCompletions[existingIndex],
        completed: !newCompletions[existingIndex].completed
      };
    } else {
      // Add new completion
      newCompletions.push({
        date: new Date(date),
        completed: true
      });
    }
    
    // Sort completions by date (newest first)
    newCompletions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Update streak
    const updatedStreak = getCurrentStreak(newCompletions);
    const newBestStreak = Math.max(updatedStreak, habit.bestStreak);
    
    // Count total completions
    const totalCompleted = newCompletions.filter(c => c.completed).length;
    
    return {
      ...habit,
      completions: newCompletions,
      streak: updatedStreak,
      bestStreak: newBestStreak,
      totalCompletions: totalCompleted
    };
  });
}

// Get completion rate for a habit
export function getCompletionRate(habit: Habit): number {
  if (habit.completions.length === 0) return 0;
  const completed = habit.completions.filter(c => c.completed).length;
  return Math.round((completed / habit.completions.length) * 100);
}

// Get weekly data for a habit (last 7 days)
export function getWeeklyData(habit: Habit) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, -i);
    const completion = habit.completions.find(c => 
      isSameDay(new Date(c.date), date)
    );
    return {
      date,
      completed: completion ? completion.completed : false,
      dayName: format(date, 'EEE')
    };
  }).reverse();
  
  return lastWeek;
}
