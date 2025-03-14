
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, ListTodo, BarChart3, Award, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutGrid className="size-5" /> },
    { path: '/habits', label: 'Habits', icon: <ListTodo className="size-5" /> },
    { path: '/progress', label: 'Progress', icon: <BarChart3 className="size-5" /> },
    { path: '/badges', label: 'Achievements', icon: <Award className="size-5" /> }
  ];

  // Update indicator position based on active link
  useEffect(() => {
    if (!isMobile && indicatorRef.current && navRef.current) {
      const activeLink = navRef.current.querySelector('.active');
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
        indicatorRef.current.style.width = `${offsetWidth}px`;
        indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
      }
    }
  }, [location, isMobile]);

  const closeMobileNav = () => setMobileNavOpen(false);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Habitual</span>
          </div>
          
          {isMobile ? (
            <button 
              className="p-2 rounded-md"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? 
                <X className="size-6" /> : 
                <Menu className="size-6" />
              }
            </button>
          ) : (
            <nav ref={navRef} className="flex space-x-4 relative">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors relative",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
              <div ref={indicatorRef} className="nav-indicator" />
            </nav>
          )}
        </div>
      </header>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isMobile && mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={closeMobileNav}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-16 w-3/4 h-[calc(100vh-4rem)] bg-card shadow-lg p-4 flex flex-col space-y-2"
              onClick={e => e.stopPropagation()}
            >
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-secondary"
                  )}
                  onClick={closeMobileNav}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 container px-4 py-6 md:py-8 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
