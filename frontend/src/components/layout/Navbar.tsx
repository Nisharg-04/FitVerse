import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Menu, Moon, Sun, User, ShoppingCart, Dumbbell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { useStore } from '@/store/useStore';

const FitVerseNavbarLogo = () => {
  return (
    <Link
      to="/"
      className="relative z-20 mr-4 flex items-center space-x-3 px-2 py-1 text-sm font-normal hover:scale-105 transition-transform duration-200"
    >
      <img
        src="/fitverse-logo.png"
        alt="FitVerse Logo"
        width={45}
        height={45}
        className="object-contain"
      />
      <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden md:block">
        FitVerse
      </span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { 
    theme, 
    toggleTheme,
    unreadCount,
    cart 
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { title: 'Home', link: '/', protected: false },
    { title: 'Gyms', link: '/gyms', protected: true },
    { title: 'Tracker', link: '/tracker', protected: true },
    { title: 'Nutrition', link: '/nutrition', protected: true },
    { title: 'Store', link: '/store', protected: false },
  ];

  const renderAuthLinks = () => {
    if (!isAuthenticated) return null;
    
    return (
      <>
        <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </Link>

        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </Link>
      </>
    );
  };

  const renderAuthButtons = () => (
    isAuthenticated ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link to="/register">
          <Button 
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
          >
            Get Started
          </Button>
        </Link>
      </div>
    )
  );

  const renderNavItems = () => {
    return navItems
      .filter(item => !item.protected || isAuthenticated)
      .map((item, idx) => (
        <Link
          key={idx}
          to={item.link}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === item.link ? "text-foreground" : "text-foreground/60"
          )}
        >
          {item.title}
        </Link>
      ));
  };

  return (
    <ResizableNavbar className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Desktop Navigation */}
      <NavBody className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center">
          <FitVerseNavbarLogo />
        </div>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 px-6 text-sm">
          {renderNavItems()}
        </nav>

        <div className="flex items-center gap-3">
          {renderAuthLinks()}
          {renderAuthButtons()}
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative hover:bg-accent"
          >
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.div>
          </Button>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MobileNavHeader className="px-4 py-3">
          <FitVerseNavbarLogo />
          <div className="flex items-center gap-3">
            {/* Mobile Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 hover:bg-accent shrink-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="px-6 py-6"
        >
          {/* Navigation Items */}
          {navItems
            .filter(item => !item.protected || isAuthenticated)
            .map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-foreground hover:text-primary transition-colors py-2 text-base font-medium"
              >
                <span className="block">{item.title}</span>
              </Link>
            ))}
          
          {/* Auth Section */}
          <div className="flex w-full flex-col gap-4 pt-6 border-t border-border">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col gap-3">
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="relative w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {cartItemsCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                          {cartItemsCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  
                  <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="relative w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Alerts
                      {unreadCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="relative w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </div>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton variant="secondary" className="w-full">
                    Login
                  </NavbarButton>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton 
                    variant="primary"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    Get Started
                  </NavbarButton>
                </Link>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;
