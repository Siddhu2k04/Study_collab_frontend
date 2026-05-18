import React from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-400">Manage your profile and preferences.</p>
      </motion.div>
      <div className="glass-card p-6 h-64 flex items-center justify-center">
        <p className="text-gray-400">Coming soon</p>
      </div>
    </div>
  );
};
export default Settings;
