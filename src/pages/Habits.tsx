
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, habits, toggleHabitCompletion } from '@/lib/habitData';
import HabitCard from '@/components/HabitCard';
import NewHabitForm from '@/components/NewHabitForm';
import CategoryTag from '@/components/CategoryTag';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Habits = () => {
  const [updatedHabits, setUpdatedHabits] = useState(habits);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter habits based on category and search query
  const filteredHabits = updatedHabits.filter(habit => {
    const matchesCategory = selectedCategoryId ? habit.category.id === selectedCategoryId : true;
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (habit.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handler for creating a new habit
  const handleCreateHabit = (newHabit: { name: string; description: string; categoryId: string }) => {
    const category = categories.find(c => c.id === newHabit.categoryId) || categories[0];
    
    const habit = {
      id: `${updatedHabits.length + 1}`,
      name: newHabit.name,
      description: newHabit.description,
      category,
      completions: [],
      createdAt: new Date(),
      streak: 0,
      bestStreak: 0,
      totalCompletions: 0
    };
    
    setUpdatedHabits([...updatedHabits, habit]);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Habits</h1>
        <p className="text-muted-foreground">Manage and track all your habits in one place.</p>
      </div>
      
      <div className="mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-5" />
          <Input
            type="text"
            placeholder="Search habits..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <CategoryTag
            category={{ id: 'all', name: 'All', color: '#94a3b8' }}
            isSelected={selectedCategoryId === null}
            onClick={() => setSelectedCategoryId(null)}
          />
          {categories.map(category => (
            <CategoryTag
              key={category.id}
              category={category}
              isSelected={selectedCategoryId === category.id}
              onClick={() => setSelectedCategoryId(category.id)}
            />
          ))}
        </div>
      </div>
      
      <NewHabitForm onSubmit={handleCreateHabit} />
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <motion.div
                key={habit.id}
                variants={itemVariants}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <HabitCard habit={habit} onHabitUpdate={setUpdatedHabits} />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-habits"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-dashed rounded-xl p-8 text-center"
            >
              {searchQuery || selectedCategoryId ? (
                <p className="text-muted-foreground">No habits found matching your filters.</p>
              ) : (
                <p className="text-muted-foreground">You haven't created any habits yet.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Habits;
