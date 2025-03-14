
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { BarChart3, Calendar, Flame, Plus, CheckCircle, TrendingUp } from 'lucide-react';
import { habits, badges } from '@/lib/habitData';
import HabitCard from '@/components/HabitCard';
import ProgressChart from '@/components/ProgressChart';
import CalendarView from '@/components/CalendarView';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [updatedHabits, setUpdatedHabits] = useState(habits);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  
  // Calculate stats
  const today = new Date();
  const activeHabits = updatedHabits.length;
  const habitsCompletedToday = updatedHabits.filter(
    habit => habit.completions.some(
      c => format(new Date(c.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && c.completed
    )
  ).length;
  
  const longestStreak = Math.max(...updatedHabits.map(h => h.bestStreak), 0);
  const unlockedBadges = badges.filter(b => b.progress >= b.requiredProgress).length;
  
  // Limit habits to display on dashboard
  const habitLimit = 3;
  const displayHabits = updatedHabits.slice(0, habitLimit);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="text-sm uppercase text-muted-foreground tracking-wider font-medium">
          {format(today, 'EEEE, MMMM d')}
        </span>
        <h1 className="text-3xl font-bold">Welcome Back</h1>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="p-4 bg-card border rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Active Habits</p>
              <p className="text-2xl font-bold mt-1">{activeHabits}</p>
            </div>
            <div className="size-9 rounded-full flex items-center justify-center bg-primary/10">
              <CheckCircle className="size-5 text-primary" />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="p-4 bg-card border rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Completed Today</p>
              <p className="text-2xl font-bold mt-1">{habitsCompletedToday} / {activeHabits}</p>
            </div>
            <div className="size-9 rounded-full flex items-center justify-center bg-primary/10">
              <Calendar className="size-5 text-primary" />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="p-4 bg-card border rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Longest Streak</p>
              <p className="text-2xl font-bold mt-1">{longestStreak} days</p>
            </div>
            <div className="size-9 rounded-full flex items-center justify-center bg-primary/10">
              <Flame className="size-5 text-primary" />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="p-4 bg-card border rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Badges Earned</p>
              <p className="text-2xl font-bold mt-1">{unlockedBadges} / {badges.length}</p>
            </div>
            <div className="size-9 rounded-full flex items-center justify-center bg-primary/10">
              <TrendingUp className="size-5 text-primary" />
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate('/habits')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {displayHabits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                onHabitUpdate={setUpdatedHabits}
              />
            ))}
            
            {displayHabits.length < activeHabits && (
              <Button 
                variant="outline" 
                className="w-full flex gap-2" 
                onClick={() => navigate('/habits')}
              >
                <Plus className="size-4" />
                View {activeHabits - displayHabits.length} More Habits
              </Button>
            )}
            
            {activeHabits === 0 && (
              <div className="bg-card border border-dashed rounded-xl p-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any habits yet.</p>
                <Button 
                  variant="default" 
                  className="flex items-center gap-2" 
                  onClick={() => navigate('/habits')}
                >
                  <Plus className="size-4" />
                  Create Your First Habit
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Monthly View</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate('/progress')}
            >
              <BarChart3 className="size-4" />
            </Button>
          </div>
          
          <CalendarView 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
        <div className="h-72">
          <ProgressChart habits={updatedHabits} />
        </div>
      </div>
    </div>
  );
};

export default Index;
