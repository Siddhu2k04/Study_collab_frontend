import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Award, Settings, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, isExpanded }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {isExpanded && (
      <motion.span 
        initial={{ opacity: 0, w: 0 }}
        animate={{ opacity: 1, w: 'auto' }}
        exit={{ opacity: 0, w: 0 }}
        className="font-medium whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
  </NavLink>
);

const DashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Users, label: 'Study Rooms', to: '/rooms' },
    { icon: BarChart3, label: 'Analytics', to: '/analytics' },
    { icon: Award, label: 'Achievements', to: '/achievements' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-neon" />
          <span className="font-bold">StudyCollab</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarExpanded ? 240 : 80,
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 768 ? -240 : 0)
        }}
        className={`fixed md:relative top-0 left-0 h-full glass border-r border-white/10 z-40 flex flex-col transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center space-x-3 overflow-hidden">
            <BookOpen className="w-8 h-8 text-neon flex-shrink-0" />
            {isSidebarExpanded && (
              <span className="text-xl font-bold tracking-tight whitespace-nowrap">
                Study<span className="text-primary">Collab</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              icon={item.icon} 
              label={item.label} 
              to={item.to} 
              isExpanded={isSidebarExpanded} 
            />
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${isSidebarExpanded ? 'space-x-3' : 'justify-center'} mb-4`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-neon flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {isSidebarExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${
              !isSidebarExpanded && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarExpanded && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>

        {/* Desktop Expand Toggle */}
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="hidden md:flex absolute -right-3 top-24 w-6 h-6 bg-surface border border-white/10 rounded-full items-center justify-center hover:bg-white/10 transition-colors z-50"
        >
          {isSidebarExpanded ? <span className="text-xs">◁</span> : <span className="text-xs">▷</span>}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-background md:pt-0 pt-16 relative">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="p-6 md:p-10 relative z-10">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
