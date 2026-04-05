import React, { useState, useEffect } from 'react';
import { StockProvider } from './contexts/StockContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupplierProvider } from './contexts/SupplierContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ViewState } from './types';
import { APP_CONFIG } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import SuppliersTable from './components/SuppliersTable';
import CategoriesManagement from './components/CategoriesManagement';
import Login from './components/Login';
import Profile from './components/Profile';
import StaffManagement from './components/StaffManagement';
import { Toaster, toast } from 'sonner';
import { CategoryProvider } from './contexts/CategoryContext';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    lowStockThreshold: 10,
    autoReorder: false,
    emailNotifications: true,
    taxRate: 18,
    timezone: 'Asia/Kolkata'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">System Settings</h2>
      
      <div className="bg-surface p-6 border border-surface-border space-y-8">
        <div>
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6 border-b border-surface-border pb-2">Application Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">App Name</label>
              <input disabled value={APP_CONFIG.appName} className="w-full px-4 py-2 bg-black/50 border border-surface-border text-slate-500 font-mono text-sm cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Primary Currency</label>
              <input disabled value={APP_CONFIG.currency} className="w-full px-4 py-2 bg-black/50 border border-surface-border text-slate-500 font-mono text-sm cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6 border-b border-surface-border pb-2">Inventory Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Global Low Stock Threshold</label>
              <input 
                type="number" 
                value={Number.isNaN(settings.lowStockThreshold) ? '' : settings.lowStockThreshold} 
                onChange={(e) => setSettings({...settings, lowStockThreshold: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Default Tax Rate (%)</label>
              <input 
                type="number" 
                value={Number.isNaN(settings.taxRate) ? '' : settings.taxRate} 
                onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors" 
              />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="autoReorder"
                checked={settings.autoReorder}
                onChange={(e) => setSettings({...settings, autoReorder: e.target.checked})}
                className="w-4 h-4 accent-brand-500 bg-black border-surface-border"
              />
              <label htmlFor="autoReorder" className="text-sm font-mono text-slate-300 uppercase tracking-wider cursor-pointer">Enable Auto-Reorder Suggestions</label>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="emailNotif"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="w-4 h-4 accent-brand-500 bg-black border-surface-border"
              />
              <label htmlFor="emailNotif" className="text-sm font-mono text-slate-300 uppercase tracking-wider cursor-pointer">Low Stock Email Alerts</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6 border-b border-surface-border pb-2">Localization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Timezone</label>
              <select 
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors appearance-none"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 font-mono text-sm uppercase transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  useEffect(() => {
    if (user) {
      document.title = `${APP_CONFIG.appName} | ${currentView.charAt(0) + currentView.slice(1).toLowerCase()}`;
    } else {
      document.title = `${APP_CONFIG.appName} | Login`;
    }
  }, [currentView, user]);

  if (!user) {
    return <Login />;
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === ViewState.DASHBOARD && <Dashboard />}
      {currentView === ViewState.INVENTORY && <InventoryTable />}
      {currentView === ViewState.SUPPLIERS && <SuppliersTable />}
      {currentView === ViewState.CATEGORIES && <CategoriesManagement />}
      {currentView === ViewState.STAFF && <StaffManagement />}
      {currentView === ViewState.PROFILE && <Profile />}
      {currentView === ViewState.SETTINGS && <SettingsView />}
    </Layout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SupplierProvider>
          <CategoryProvider>
            <StockProvider>
              <Toaster position="top-right" theme="dark" richColors toastOptions={{ style: { background: '#0a0a0a', border: '1px solid #27272a', color: '#fff' } }} />
              <AppContent />
            </StockProvider>
          </CategoryProvider>
        </SupplierProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}