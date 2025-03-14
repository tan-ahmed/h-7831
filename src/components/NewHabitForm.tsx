
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { categories } from '@/lib/habitData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CategoryTag from './CategoryTag';

type NewHabitFormProps = {
  onSubmit: (habit: {
    name: string;
    description: string;
    categoryId: string;
  }) => void;
};

const NewHabitForm = ({ onSubmit }: NewHabitFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name,
      description,
      categoryId: selectedCategoryId
    });
    
    // Reset form
    setName('');
    setDescription('');
    setSelectedCategoryId(categories[0]?.id || '');
    setIsOpen(false);
  };
  
  return (
    <div className="mb-6">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed 
                     border-muted-foreground/30 text-muted-foreground hover:bg-secondary/50 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="size-5" />
            <span>Add New Habit</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border rounded-xl bg-card shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Create New Habit</h3>
                <button 
                  className="p-1 rounded-md hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                      Habit Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter habit name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                      Description (optional)
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe your habit"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Habit</Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewHabitForm;
