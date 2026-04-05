import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md border border-surface-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-surface-border bg-black shrink-0">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              {title}
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-300 font-mono text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-surface-border bg-black/50">
          <button 
            onClick={onCancel}
            className="px-6 py-2 bg-black border border-surface-border text-foreground hover:border-slate-500 font-mono text-sm uppercase transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-6 py-2 bg-red-500 text-white font-bold hover:bg-red-600 font-mono text-sm uppercase transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
