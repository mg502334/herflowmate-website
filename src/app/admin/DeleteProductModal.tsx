import { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Product } from "../data/products";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onConfirm: (productId: number) => Promise<void>;
}

export function DeleteProductModal({ isOpen, onClose, product, onConfirm }: DeleteProductModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isMatch = confirmationText === product.name;

  const handleDelete = async () => {
    if (!isMatch) return;
    
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(product.id);
      // Reset state and close on success
      setConfirmationText("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmationText("");
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1E293B] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-amber-500/5">
          <div className="flex items-center text-amber-400">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Archive Product</h2>
          </div>
          <button 
            onClick={handleClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200 text-sm">
            <p className="font-semibold mb-1">Notice: This product will be safely hidden.</p>
            <p>You are about to archive <strong className="text-white">{product.name}</strong>. It will be removed from your active inventory, but all associated purchase logs and price requests will be retained.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Please type <span className="font-bold text-white bg-gray-800 px-1 py-0.5 rounded">{product.name}</span> to confirm.
            </label>
            <input 
              type="text" 
              className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              placeholder={product.name}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-black/20 flex justify-end space-x-3">
          <button 
            onClick={handleClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={!isMatch || isDeleting}
            className={`px-5 py-2.5 rounded-lg font-bold flex items-center transition-all ${
              isMatch 
                ? 'bg-amber-500 hover:bg-amber-600 text-[#0F172A] shadow-lg shadow-amber-500/20' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <span className="w-5 h-5 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin mr-2"></span>
                Archiving...
              </span>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2" />
                Archive Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
