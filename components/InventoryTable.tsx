import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../contexts/CategoryContext';
import { APP_CONFIG } from '../constants';
import { Product } from '../types';
import { 
  Search, Plus, Filter, Trash2, Edit2, AlertCircle, CheckCircle, 
  ChevronLeft, ChevronRight, FileDown 
} from 'lucide-react';
import ProductModal from './ProductModal';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

const InventoryTable = () => {
  const { products, deleteProduct, updateProduct } = useStock();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteProduct(itemToDelete);
      toast.success('Item deleted successfully');
      setItemToDelete(null);
    }
  };

  const handleQuickUpdate = (id: string, currentQty: number, change: number) => {
    const newQty = Math.max(0, currentQty + change);
    updateProduct(id, { quantity: newQty });
    toast.success(`Quantity updated to ${newQty}`);
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Quantity', 'Min Threshold', 'Supplier', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => 
        [
          p.id, 
          `"${p.name.replace(/"/g, '""')}"`, 
          `"${p.sku}"`, 
          `"${p.category}"`, 
          p.price, 
          p.quantity, 
          p.minThreshold, 
          `"${p.supplier}"`, 
          p.lastUpdated
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Inventory exported successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Inventory Data</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-surface-border text-slate-300 hover:text-foreground hover:border-slate-500 transition-colors"
          >
            <FileDown size={18} />
            <span className="hidden sm:inline font-mono text-sm uppercase">Export</span>
          </button>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => { setEditingProduct(undefined); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 transition-colors"
            >
              <Plus size={18} />
              <span className="font-mono text-sm uppercase">Add Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface p-4 border border-surface-border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME OR SKU..." 
            className="w-full pl-10 pr-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 appearance-none font-mono text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">ALL CATEGORIES</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-surface-border overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light text-slate-400 text-xs font-mono uppercase tracking-widest">
                <th className="p-4 border-b border-surface-border">Product</th>
                <th className="p-4 border-b border-surface-border">SKU</th>
                <th className="p-4 border-b border-surface-border">Category</th>
                <th className="p-4 border-b border-surface-border">Price</th>
                <th className="p-4 border-b border-surface-border">Status</th>
                <th className="p-4 border-b border-surface-border">Qty</th>
                <th className="p-4 border-b border-surface-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {currentData.length > 0 ? (
                currentData.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-light transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover bg-black border border-surface-border"
                        />
                        <div>
                          <p className="font-bold text-foreground">{product.name}</p>
                          <p className="text-xs font-mono text-slate-500">{product.supplier}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-brand-500 font-mono">{product.sku}</td>
                    <td className="p-4 text-sm text-slate-300">
                      <span className="px-2 py-1 border border-surface-border bg-black text-xs font-mono uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-foreground">
                      {APP_CONFIG.currency}{product.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {product.quantity <= product.minThreshold ? (
                        <div className="flex items-center gap-1 text-red-500 text-xs font-mono uppercase px-2 py-1 border border-red-500/20 bg-red-500/10 w-fit">
                          <AlertCircle size={14} />
                          <span>Low Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-brand-500 text-xs font-mono uppercase px-2 py-1 border border-brand-500/20 bg-brand-500/10 w-fit">
                          <CheckCircle size={14} />
                          <span>Optimal</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleQuickUpdate(product.id, product.quantity, -1)}
                          className="w-6 h-6 bg-black border border-surface-border hover:border-brand-500 flex items-center justify-center text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-foreground">{product.quantity}</span>
                        <button 
                          onClick={() => handleQuickUpdate(product.id, product.quantity, 1)}
                          className="w-6 h-6 bg-black border border-surface-border hover:border-brand-500 flex items-center justify-center text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user?.role === 'ADMIN' && (
                          <>
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 text-slate-400 hover:text-brand-500 bg-black border border-surface-border hover:border-brand-500 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-slate-400 hover:text-red-500 bg-black border border-surface-border hover:border-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-mono text-slate-500 uppercase">
                    No items found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-surface-border flex justify-between items-center bg-black">
          <span className="text-xs font-mono text-slate-500 uppercase">
            Showing {Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredProducts.length, currentPage * itemsPerPage)} of {filteredProducts.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-surface-border bg-surface hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:hover:border-surface-border disabled:hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-surface-border bg-surface hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:hover:border-surface-border disabled:hover:text-foreground transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={editingProduct} 
        />
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default InventoryTable;