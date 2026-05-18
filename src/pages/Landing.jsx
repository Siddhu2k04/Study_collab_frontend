import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Award, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-neon" />
          <span className="text-2xl font-bold tracking-tight">Study<span className="text-primary">Collab</span></span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2 rounded-full hover:bg-white/5 transition-colors">Login</Link>
          <Link to="/register" className="px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            The Future of <br/>
            <span className="text-gradient">Collaborative Study</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Join real-time study rooms, sync PDFs, share notes, and crush your goals together. Experience the most premium study environment ever built.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <Link to="/register" className="group flex items-center space-x-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
              <span>Start Studying</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
        >
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Rooms</h3>
            <p className="text-gray-400">Create private study rooms and collaborate instantly with synchronized tools.</p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-neon" />
            </div>
            <h3 className="text-xl font-bold mb-3">Synced PDF & Video</h3>
            <p className="text-gray-400">Watch lectures and read documents together. When you turn the page, everyone does.</p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gamified Progress</h3>
            <p className="text-gray-400">Earn achievements, build streaks, and track your productivity over time.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
