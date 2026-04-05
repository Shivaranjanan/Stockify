import React, { useState } from 'react';
import { useSuppliers } from '../contexts/SupplierContext';
import { useAuth } from '../contexts/AuthContext';
import { Supplier } from '../types';
import { 
  Search, Plus, Trash2, Edit2, MapPin, Phone, Mail, Building, X, Save
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

const SuppliersTable = () => {
  const { suppliers, deleteSupplier, addSupplier, updateSupplier } = useSuppliers();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSupplier(undefined);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteSupplier(itemToDelete);
      toast.success('Supplier deleted successfully');
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    let success = false;
    if (editingSupplier && editingSupplier.id) {
      success = await updateSupplier(editingSupplier.id, formData);
      if (success) toast.success('Supplier updated successfully');
    } else {
      success = await addSupplier(formData as any);
      if (success) toast.success('Supplier added successfully');
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Supplier Directory</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 transition-colors"
        >
          <Plus size={18} />
          <span className="font-mono text-sm uppercase">Add Supplier</span>
        </button>
      </div>

      <div className="bg-surface p-4 border border-surface-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH SUPPLIERS BY NAME OR CONTACT..." 
            className="w-full pl-10 pr-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="bg-surface border border-surface-border p-6 hover:border-brand-500/50 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                  <Building size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{supplier.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{supplier.contactPerson}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(supplier)} className="p-2 text-slate-400 hover:text-brand-500 bg-black border border-surface-border hover:border-brand-500 transition-colors">
                  <Edit2 size={16} />
                </button>
                {user?.role === 'ADMIN' && (
                  <button onClick={() => handleDelete(supplier.id)} className="p-2 text-slate-400 hover:text-red-500 bg-black border border-surface-border hover:border-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-3 text-sm font-mono text-slate-400 relative z-10">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-500" />
                <a href={`mailto:${supplier.email}`} className="hover:text-brand-500 transition-colors">{supplier.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-slate-500 shrink-0" />
                <span className="truncate">{supplier.address}</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors"></div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg border border-surface-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-surface-border bg-black">
              <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-brand-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Company Name *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Contact Person *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                  value={formData.contactPerson || ''}
                  onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Email *</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Phone *</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                    value={formData.phone || ''}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Address</label>
                <textarea 
                  className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                  rows={3}
                  value={formData.address || ''}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-surface-border">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-black border border-surface-border text-foreground hover:border-slate-500 font-mono text-sm uppercase transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 font-mono text-sm uppercase transition-colors"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This may affect products linked to them."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default SuppliersTable;