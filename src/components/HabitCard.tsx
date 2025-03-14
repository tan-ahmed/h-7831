
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit, toggleHabitCompletion } from '@/lib/habitData';
import { format } from 'date-fns';

type HabitCardProps = {
  habit: Habit;
  onHabitUpdate: (updatedHabits: Habit[]) => void;
};

const HabitCard = ({ habit, onHabitUpdate }: HabitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if habit is completed today
  const todayCompletion = habit.completions.find(
    completion => format(new Date(completion.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  const isCompletedToday = todayCompletion?.completed || false;
  
  // Get last 7 days completions
  const lastWeekCompletions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const completion = habit.completions.find(
      c => format(new Date(c.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    return {
      date,
      completed: completion?.completed || false
    };
  }).reverse();
  
  const handleToggleCompletion = () => {
    const updatedHabits = toggleHabitCompletion(habit.id, today);
    onHabitUpdate(updatedHabits);
  };
  
  return (
    <motion.div 
      className={cn(
        "habit-card rounded-xl overflow-hidden",
        "border bg-card shadow-sm hover:shadow-md"
      )}
      layout
      layoutId={`habit-card-${habit.id}`}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div 
        className={cn(
          "p-4 flex items-center justify-between cursor-pointer",
          isCompletedToday && "bg-primary/5"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <button
            className={cn(
              "size-8 flex items-center justify-center rounded-full border",
              "transition-all duration-300 ease-out",
              isCompletedToday 
                ? "bg-primary border-primary text-primary-foreground" 
                : "bg-card border-muted-foreground/30 text-muted-foreground/50 hover:border-primary/50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCompletion();
            }}
          >
            {isCompletedToday && <Check className="size-4" />}
          </button>
          
          <div>
            <h3 className="font-medium">{habit.name}</h3>
            <div className="flex items-center mt-1">
              <div 
                className="size-3 rounded-full mr-2"
                style={{ backgroundColor: habit.category.color }}
              />
              <span className="text-xs text-muted-foreground">{habit.category.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {habit.streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-full">
              <Flame className="size-3.5 text-primary" />
              <span className="text-xs font-medium">{habit.streak}</span>
            </div>
          )}
          
          <ChevronRight className={cn(
            "size-5 text-muted-foreground transition-transform duration-300",
            isExpanded && "rotate-90"
          )} />
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 border-t">
          {habit.description && (
            <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
          )}
          
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Last 7 days</h4>
              <div className="flex items-center justify-between">
                {lastWeekCompletions.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "size-8 flex items-center justify-center rounded-full border mb-1",
                        day.completed
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-secondary border-border text-muted-foreground/50"
                      )}
                    >
                      {day.completed && <Check className="size-3.5" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(day.date, 'E')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Best streak</p>
                <p className="font-medium">{habit.bestStreak} days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total completions</p>
                <p className="font-medium">{habit.totalCompletions}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HabitCard;
