import React, { useState } from 'react';
import { APP_CONFIG } from '../constants';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, Package, Settings, LogOut, Menu, X, User as UserIcon, Truck, Sun, Moon, Boxes
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.INVENTORY, label: 'Inventory', icon: Package },
    { id: ViewState.SUPPLIERS, label: 'Suppliers', icon: Truck },
    { id: ViewState.CATEGORIES, label: 'Categories', icon: Boxes },
    ...(user?.role === 'ADMIN' ? [{ id: ViewState.STAFF, label: 'Staff', icon: UserIcon }] : []),
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex selection:bg-brand-500 selection:text-black transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 h-screen w-64 bg-surface border-r border-surface-border z-30 transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-surface-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 text-black flex items-center justify-center rounded-md">
              <Boxes size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">{APP_CONFIG.appName}</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 border
                  ${isActive 
                    ? 'bg-brand-500/10 border-brand-500/50 text-brand-500' 
                    : 'border-transparent text-slate-400 hover:bg-surface-light hover:text-foreground'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-foreground hover:bg-surface-light transition-all w-full border border-transparent"
          >
            <LogOut size={20} />
            <span className="font-medium tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-surface-border sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-foreground hover:bg-surface-light"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:block">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest">
              {currentView}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-brand-500 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-surface-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">{user?.name}</p>
                <p className="text-xs font-mono text-brand-500 uppercase">{user?.role}</p>
              </div>
              <button 
                onClick={() => onNavigate(ViewState.PROFILE)}
                className="w-10 h-10 bg-surface-light flex items-center justify-center text-slate-300 border border-surface-border hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
              >
                <UserIcon size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;