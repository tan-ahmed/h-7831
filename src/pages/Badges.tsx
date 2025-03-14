
import React from 'react';
import { motion } from 'framer-motion';
import { badges } from '@/lib/habitData';
import BadgeItem from '@/components/BadgeItem';

const Badges = () => {
  // Separate badges into unlocked and locked
  const unlockedBadges = badges.filter(badge => badge.progress >= badge.requiredProgress);
  const lockedBadges = badges.filter(badge => badge.progress < badge.requiredProgress);
  
  // Animation variants
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
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">Collect badges and track your achievements.</p>
      </div>
      
      {unlockedBadges.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Unlocked Badges</h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {unlockedBadges.map(badge => (
              <motion.div key={badge.id} variants={itemVariants}>
                <BadgeItem badge={badge} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Badges to Unlock</h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: unlockedBadges.length > 0 ? 0.3 : 0 }}
          >
            {lockedBadges.map(badge => (
              <motion.div key={badge.id} variants={itemVariants}>
                <BadgeItem badge={badge} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      {badges.length === 0 && (
        <div className="bg-card border rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No badges available yet</h3>
          <p className="text-muted-foreground">
            Start completing your habits consistently to earn badges and track your achievements.
          </p>
        </div>
      )}
    </div>
  );
};

export default Badges;
