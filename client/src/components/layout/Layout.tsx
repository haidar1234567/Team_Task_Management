import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-xl font-semibold">Loading...</div>
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold tracking-tight text-primary">TaskManager</span>
        </div>
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between py-4">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}>
                <span className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="px-4">
            <div className="mb-4 rounded-md bg-secondary/50 p-4">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-6 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-4 text-lg font-semibold">TaskManager</span>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
