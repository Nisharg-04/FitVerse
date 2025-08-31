import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useStore } from '@/store/useStore';

const Layout: React.FC = () => {
  const { theme, sidebarOpen, isAuthenticated } = useStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="flex pt-20"> {/* Added padding-top to account for fixed navbar */}
  
        
        <main className={`flex-1 ${isAuthenticated ? 'md:ml-0' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={isAuthenticated ? "container mx-auto px-4 py-6" : ""}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl animate-pulse-soft [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-success/3 blur-3xl animate-pulse-soft [animation-delay:4s]" />
      </div>
    </div>
  );
};

export default Layout;