import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Mail, MoreVertical, Search, Plus, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import ConfirmModal from './ConfirmModal';

// Initialize a secondary Firebase app for admin operations
const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
const secondaryAuth = getAuth(secondaryApp);

const StaffManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staffData: any[] = [];
      snapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() });
      });
      setStaffList(staffData);
    }, (error) => {
      console.error('Error fetching staff:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use secondary auth instance to create user without logging out the admin
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newStaff.email, newStaff.password);
      
      // Create profile in Firestore
      await setDoc(doc(db, 'profiles', userCredential.user.uid), {
        id: userCredential.user.uid,
        email: newStaff.email,
        name: newStaff.name,
        role: newStaff.role,
        createdAt: new Date().toISOString()
      });
      
      // Sign out the secondary auth instance just to be clean
      await secondaryAuth.signOut();
      
      toast.success('Staff added successfully');
      setIsAdding(false);
      setNewStaff({ name: '', email: '', password: '', role: 'STAFF' });
    } catch (err: any) {
      console.error('Error adding staff:', err);
      toast.error(`Failed to add staff: ${err.message || JSON.stringify(err)}`);
    }
  };

  const handleDeleteStaff = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteDoc(doc(db, 'profiles', itemToDelete));
        toast.success('Staff profile deleted. They will no longer have access.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete staff');
      }
      setItemToDelete(null);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <Shield size={48} className="text-red-500" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-slate-400">You do not have permission to view this page. Admin access required.</p>
      </div>
    );
  }

  const filteredStaff = staffList.filter(staff => 
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Staff Management</h2>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 transition-colors">
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {isAdding && (
        <div className="bg-surface p-6 border border-surface-border relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold mb-4">Add New Staff</h3>
          <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-4 py-2 bg-surface-light border border-surface-border focus:border-brand-500 outline-none text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <input required type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-4 py-2 bg-surface-light border border-surface-border focus:border-brand-500 outline-none text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input required type={showPassword ? "text" : "password"} value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} className="w-full px-4 py-2 bg-surface-light border border-surface-border focus:border-brand-500 outline-none text-foreground pr-10" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Role</label>
              <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-4 py-2 bg-surface-light border border-surface-border focus:border-brand-500 outline-none text-foreground">
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 mt-4">
              <button type="submit" className="px-6 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 transition-colors">
                Save Staff
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface p-4 border border-surface-border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-light border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="bg-surface border border-surface-border overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light text-slate-400 text-xs font-mono uppercase tracking-widest">
                <th className="p-4 border-b border-surface-border font-medium">Name</th>
                <th className="p-4 border-b border-surface-border font-medium">Email</th>
                <th className="p-4 border-b border-surface-border font-medium">Role</th>
                <th className="p-4 border-b border-surface-border font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-surface-light transition-colors group">
                  <td className="p-4 border-b border-surface-border text-foreground font-medium flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-light border border-surface-border flex items-center justify-center text-slate-400 shrink-0">
                      <User size={16} />
                    </div>
                    {staff.name}
                  </td>
                  <td className="p-4 border-b border-surface-border text-slate-300 font-mono text-xs">{staff.email}</td>
                  <td className="p-4 border-b border-surface-border">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-800 text-slate-300 text-xs font-mono uppercase tracking-wider border border-slate-700">
                      {staff.role}
                    </span>
                  </td>
                  <td className="p-4 border-b border-surface-border text-right">
                    {user?.id !== staff.id && (
                      <button onClick={() => handleDeleteStaff(staff.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors">
                        <X size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaff.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono text-sm">
              No staff members found matching your search.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? They will immediately lose access to the system."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default StaffManagement;
