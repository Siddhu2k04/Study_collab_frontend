import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Clock, Flame, Target, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 6 },
  { name: 'Sun', hours: 5 },
];

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 flex items-start space-x-4"
  >
    <div className={`p-3 rounded-xl bg-${color}/20 text-${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-xs text-green-400">{subtitle}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.username}! 👋</h1>
          <p className="text-gray-400">Here's what's happening with your study progress.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Study Hours" 
          value={`${user?.total_study_time || 0}h`} 
          subtitle="+2.5h this week" 
          icon={Clock} 
          color="primary" 
          delay={0.1} 
        />
        <StatCard 
          title="Current Streak" 
          value={`${user?.study_streak || 0} Days`} 
          subtitle="Keep it up!" 
          icon={Flame} 
          color="orange-500" 
          delay={0.2} 
        />
        <StatCard 
          title="Focus Sessions" 
          value="12" 
          subtitle="+3 vs last week" 
          icon={Target} 
          color="neon" 
          delay={0.3} 
        />
        <StatCard 
          title="Productivity Score" 
          value="85%" 
          subtitle="Top 10% of users" 
          icon={Trophy} 
          color="secondary" 
          delay={0.4} 
        />
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold mb-6">Weekly Study Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
