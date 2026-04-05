import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';
import { useStock } from '../contexts/StockContext';
import { useSuppliers } from '../contexts/SupplierContext';
import { useCategories } from '../contexts/CategoryContext';
import { X, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addProduct, updateProduct } = useStock();
  const { suppliers } = useSuppliers();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: categories[0]?.name || '',
    price: 0,
    quantity: 0,
    minThreshold: 10,
    supplier: '',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=200'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        sku: '',
        category: categories[0]?.name || '',
        price: 0,
        quantity: 0,
        minThreshold: 10,
        supplier: suppliers[0]?.name || '',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=200'
      });
    }
  }, [initialData, isOpen, suppliers, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku) {
      toast.error("Please fill in all required fields");
      return;
    }

    let success = false;
    if (initialData && initialData.id) {
      success = await updateProduct(initialData.id, formData);
      if (success) toast.success('Product updated successfully');
    } else {
      success = await addProduct(formData as any);
      if (success) toast.success('Product added successfully');
    }
    
    if (success) {
      onClose();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl border border-surface-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-surface-border bg-black shrink-0">
          <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-brand-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload Area */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Product Image</label>
                <div className="relative border-2 border-dashed border-surface-border hover:border-brand-500/50 bg-black p-8 text-center transition-colors group cursor-pointer overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {formData.imageUrl && formData.imageUrl.startsWith('data:') ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain opacity-50 group-hover:opacity-30 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="font-mono text-sm">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-slate-500 group-hover:text-brand-500 mb-2 transition-colors relative z-0" />
                      <p className="text-sm text-slate-400 font-mono relative z-0">Drag and drop or click to upload</p>
                      <p className="text-xs text-slate-600 mt-1 font-mono relative z-0">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Product Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                    placeholder="e.g. Premium Widget"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">SKU *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors uppercase"
                    placeholder="e.g. WID-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors appearance-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Price ({APP_CONFIG.currency}) *</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      required
                      value={formData.price === undefined || Number.isNaN(formData.price) ? '' : formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Initial Qty</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.quantity === undefined || Number.isNaN(formData.quantity) ? '' : formData.quantity}
                      onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Min Threshold</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.minThreshold === undefined || Number.isNaN(formData.minThreshold) ? '' : formData.minThreshold}
                    onChange={e => setFormData({...formData, minThreshold: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Supplier</label>
                  <select 
                    value={formData.supplier}
                    onChange={e => setFormData({...formData, supplier: e.target.value})}
                    className="w-full px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors appearance-none"
                  >
                    <option value="">Select a supplier...</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Product Image URL</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="flex-1 px-4 py-2 bg-black border border-surface-border text-foreground focus:outline-none focus:border-brand-500 font-mono text-sm transition-colors"
                />
                <div className="w-10 h-10 bg-black border border-surface-border overflow-hidden shrink-0">
                  {formData.imageUrl && <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-surface-border">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-black border border-surface-border text-foreground hover:border-slate-500 font-mono text-sm uppercase transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-black font-bold hover:bg-brand-400 font-mono text-sm uppercase transition-colors"
              >
                <Save size={18} />
                <span>{initialData ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;