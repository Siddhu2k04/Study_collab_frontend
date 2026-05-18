import React from 'react';
import { motion } from 'framer-motion';

const Analytics = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-gray-400">Detailed insights into your study habits.</p>
      </motion.div>
      <div className="glass-card p-6 h-64 flex items-center justify-center">
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  );
};
export default Analytics;
