import React from 'react';
import { motion } from 'framer-motion';

const Achievements = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Achievements</h1>
        <p className="text-gray-400">Your unlocked badges and gamification progress.</p>
      </motion.div>
      <div className="glass-card p-6 h-64 flex items-center justify-center">
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  );
};
export default Achievements;
