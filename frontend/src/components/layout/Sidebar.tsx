import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Activity, 
  Apple, 
  ShoppingBag, 
  Bell, 
  Settings,
  User,
  X,
  Dumbbell,
  TrendingUp,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, user, isAuthenticated } = useStore();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Find Gyms', path: '/gyms', icon: MapPin },
    { name: 'Fitness Tracker', path: '/tracker', icon: Activity },
    { name: 'Nutrition', path: '/nutrition', icon: Apple },
    { name: 'Store', path: '/store', icon: ShoppingBag },
  ];

  const secondaryNavItems = [
    { name: 'Health Insights', path: '/insights', icon: TrendingUp },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const NavItem: React.FC<{
    item: { name: string; path: string; icon: any };
    onClick?: () => void;
  }> = ({ item, onClick }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link to={item.path} onClick={onClick}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
            ${isActive 
              ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30' 
              : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
          <span className="font-medium">{item.name}</span>
          {isActive && (
            <motion.div
              layoutId="activeSidebar"
              className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className="fixed left-0 top-0 z-50 h-full w-80 bg-card border-r border-border md:translate-x-0 md:static md:h-auto"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gradient">FitVerse</h2>
                <p className="text-xs text-muted-foreground">Your Fitness Journey</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Heart className="h-3 w-3 text-destructive fill-current" />
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.membershipType} Member
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <div className="px-2 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Main
                </h3>
              </div>
              {mainNavItems.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={() => setSidebarOpen(false)} 
                />
              ))}
              
              <Separator className="my-4" />
              
              <div className="px-2 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
              </div>
              {secondaryNavItems.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={() => setSidebarOpen(false)} 
                />
              ))}
            </div>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border">
            <div className="fitness-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Daily Goal</p>
                  <p className="text-xs text-muted-foreground">85% Complete</p>
                </div>
              </div>
              <div className="mt-3 bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-success to-success/80 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;