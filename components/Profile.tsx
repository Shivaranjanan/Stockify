import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">User Profile</h2>
      
      <div className="bg-surface p-8 border border-surface-border flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 bg-surface-light border border-surface-border flex items-center justify-center text-slate-400 shrink-0">
          <UserIcon size={64} />
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{user.name}</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-mono uppercase tracking-wider">
              <Shield size={14} />
              {user.role}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-surface-border">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <div className="text-foreground font-mono">{user.email}</div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Shield size={14} /> Account ID
              </label>
              <div className="text-foreground font-mono text-sm break-all">{user.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
