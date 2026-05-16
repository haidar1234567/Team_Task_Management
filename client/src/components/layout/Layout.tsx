import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Projects', icon: FolderKanban, href: '/projects' },
    { label: 'Tasks', icon: CheckSquare, href: '/tasks' },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-foreground relative bg-background">
      <AnimatedBackground />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : (window.innerWidth >= 768 ? 0 : -300) }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#09090b] md:static md:translate-x-0 transition-transform md:transition-none flex flex-col`}
      >
        <div className="flex h-14 items-center px-5 border-b border-white/5">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center mr-3 shadow-button-primary">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm font-semibold text-white">Task.Nexus</span>
        </div>
        <div className="flex flex-col flex-1 justify-between py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}>
                  <div
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-muted-foreground hover:text-white hover:bg-white/[0.04]'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          <div className="px-3 mt-auto">
            <div className="mb-4 rounded-lg bg-white/[0.02] border border-white/5 p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center font-medium text-xs text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white leading-none truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{user.role}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-white" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="flex h-14 items-center px-4 border-b border-white/5 md:hidden bg-[#09090b]">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-white" />
          </Button>
          <span className="ml-3 text-sm font-semibold text-white">Task.Nexus</span>
        </header>
        
        {/* Animated Page Transitions */}
        <div className="flex-1 overflow-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-6xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
