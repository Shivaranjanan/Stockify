import React, { useState } from 'react';
import { useCategories } from '../contexts/CategoryContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

const CategoriesManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    const success = await addCategory(newCategoryName);
    if (success) {
      toast.success('Category added successfully');
      setNewCategoryName('');
      setIsAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    const success = await updateCategory(id, editName);
    if (success) {
      toast.success('Category updated successfully');
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const success = await deleteCategory(itemToDelete);
      if (success) {
        toast.success('Category deleted successfully');
      }
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Categories</h2>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 transition-colors"
          >
            <Plus size={18} />
            <span className="font-mono text-sm uppercase">Add Category</span>
          </button>
        )}
      </div>

      <div className="bg-surface border border-surface-border overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light text-slate-400 text-xs font-mono uppercase tracking-widest">
                <th className="p-4 border-b border-surface-border">Name</th>
                <th className="p-4 border-b border-surface-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isAdding && (
                <tr className="bg-surface-light">
                  <td className="p-4">
                    <input 
                      type="text" 
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category Name"
                      className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={handleAdd}
                        className="p-2 text-brand-500 hover:text-brand-400 bg-black border border-surface-border hover:border-brand-500 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                      <button 
                        onClick={() => { setIsAdding(false); setNewCategoryName(''); }}
                        className="p-2 text-slate-400 hover:text-red-500 bg-black border border-surface-border hover:border-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-surface-light transition-colors group">
                    <td className="p-4">
                      {editingId === category.id ? (
                        <input 
                          type="text" 
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                        />
                      ) : (
                        <span className="font-bold text-foreground">{category.name}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user?.role === 'ADMIN' && (
                          <>
                            {editingId === category.id ? (
                              <>
                                <button 
                                  onClick={() => handleUpdate(category.id)}
                                  className="p-2 text-brand-500 hover:text-brand-400 bg-black border border-surface-border hover:border-brand-500 transition-colors"
                                >
                                  <Save size={16} />
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="p-2 text-slate-400 hover:text-red-500 bg-black border border-surface-border hover:border-red-500 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => { setEditingId(category.id); setEditName(category.name); }}
                                  className="p-2 text-slate-400 hover:text-brand-500 bg-black border border-surface-border hover:border-brand-500 transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(category.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 bg-black border border-surface-border hover:border-red-500 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                !isAdding && (
                  <tr>
                    <td colSpan={2} className="p-8 text-center font-mono text-slate-500 uppercase">
                      No categories found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default CategoriesManagement;
