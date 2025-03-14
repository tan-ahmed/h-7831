
import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/habitData';

type CategoryTagProps = {
  category: Category;
  isSelected?: boolean;
  onClick?: () => void;
};

const CategoryTag = ({ category, isSelected = false, onClick }: CategoryTagProps) => {
  return (
    <button
      className={cn(
        "category-tag inline-flex items-center px-3 py-1 rounded-full text-sm",
        "border transition-colors",
        isSelected 
          ? "bg-primary/10 border-primary/30 text-primary" 
          : "bg-secondary/50 border-secondary/50 text-muted-foreground hover:bg-secondary"
      )}
      onClick={onClick}
      style={{
        ...(isSelected && { 
          backgroundColor: `${category.color}20`,
          borderColor: `${category.color}40`,
          color: category.color
        })
      }}
    >
      <span 
        className="size-2 rounded-full mr-2"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </button>
  );
};

export default CategoryTag;
