
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Habit } from '@/lib/habitData';

type CalendarViewProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  habit?: Habit;
};

const CalendarView = ({ currentDate, onDateChange, habit }: CalendarViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create array for days of week header (Su-Sa)
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Determine the starting position (accounting for days from previous month)
  const startDay = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get completions for the current month if habit is provided
  const getIsCompleted = (date: Date) => {
    if (!habit) return false;
    return habit.completions.some(completion => 
      isSameDay(new Date(completion.date), date) && completion.completed
    );
  };
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onDateChange(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onDateChange(nextMonth);
  };
  
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex items-center gap-2">
            <button 
              className="p-1 rounded-md hover:bg-secondary transition-colors"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button 
              className="p-1 rounded-md hover:bg-secondary transition-colors"
              onClick={handleNextMonth}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the start of month */}
          {Array.from({ length: startDay }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-9" />
          ))}
          
          {/* Actual days in month */}
          {daysInMonth.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            const isCompleted = getIsCompleted(day);
            
            return (
              <motion.div 
                key={format(day, 'yyyy-MM-dd')}
                className={cn(
                  "calendar-day h-9 rounded-md flex items-center justify-center text-sm relative",
                  isDayToday && "font-medium",
                  isCompleted ? "completed" : "hover:bg-secondary/50",
                  !isCurrentMonth && "opacity-50"
                )}
                whileTap={{ scale: 0.95 }}
              >
                {format(day, 'd')}
                {isCompleted && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                    <Check className="size-3 text-primary" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
