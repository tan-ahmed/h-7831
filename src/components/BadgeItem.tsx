
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/lib/habitData';
import { 
  Award, 
  Sunrise, 
  Compass, 
  CheckSquare,
  Target,
  Calendar,
  Zap,
  Trophy,
  Star,
  Medal
} from 'lucide-react';

const BadgeIcons: Record<string, React.ReactNode> = {
  'award': <Award />,
  'sunrise': <Sunrise />,
  'compass': <Compass />,
  'checkSquare': <CheckSquare />,
  'target': <Target />,
  'calendar': <Calendar />,
  'zap': <Zap />,
  'trophy': <Trophy />,
  'star': <Star />,
  'medal': <Medal />
};

type BadgeItemProps = {
  badge: Badge;
};

const BadgeItem = ({ badge }: BadgeItemProps) => {
  const isUnlocked = badge.progress >= badge.requiredProgress;
  
  return (
    <motion.div 
      className={cn(
        "badge-item rounded-xl overflow-hidden border bg-card shadow-sm",
        isUnlocked ? "bg-gradient-to-b from-card to-primary/5" : ""
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="p-5 flex flex-col items-center text-center">
        <div className={cn(
          "relative mb-4 rounded-full size-16 flex items-center justify-center",
          isUnlocked 
            ? "bg-primary/10 text-primary" 
            : "bg-secondary text-muted-foreground/50"
        )}>
          <div className="size-8">
            {BadgeIcons[badge.icon] || <Award />}
          </div>
          
          {!isUnlocked && (
            <svg className="absolute inset-0" width="100%" height="100%">
              <circle
                cx="50%"
                cy="50%"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="188.5"
                strokeDashoffset={188.5 - (188.5 * badge.progress / 100)}
                transform="rotate(-90 32 32)"
                className="text-primary/40"
              />
            </svg>
          )}
          
          {isUnlocked && (
            <motion.div 
              className="absolute inset-0 border-2 border-primary rounded-full"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          )}
        </div>
        
        <h3 className="font-medium">{badge.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-3">{badge.description}</p>
        
        {isUnlocked ? (
          <div className="text-xs text-primary font-medium">
            Unlocked {badge.unlockedAt ? `on ${badge.unlockedAt.toLocaleDateString()}` : ''}
          </div>
        ) : (
          <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
            <div 
              className="bg-primary rounded-full h-1.5 transition-all duration-500"
              style={{ width: `${badge.progress}%` }}
            ></div>
            <div className="text-xs text-muted-foreground mt-2">
              {badge.progress}% complete
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BadgeItem;
