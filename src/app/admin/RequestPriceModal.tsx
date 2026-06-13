import React, { useState } from "react";
import { X, DollarSign } from "lucide-react";
import { Product } from "../data/products";
import { useProducts } from "../data/useProducts";
import { useAdminAuth } from "./AdminAuthContext";

interface RequestPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function RequestPriceModal({ isOpen, onClose, product }: RequestPriceModalProps) {
  const [requestedPrice, setRequestedPrice] = useState(product.price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPriceChange } = useProducts();
  const { session } = useAdminAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setIsSubmitting(true);
    try {
      await requestPriceChange(product.id, session.user.id, parseFloat(requestedPrice));
      alert("Price change request submitted to Admin successfully!");
      onClose();
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1E293B] rounded-2xl w-full max-w-sm shadow-2xl border border-gray-800 flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Request Price Change</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-400 mb-4">
            You are requesting a price change for <strong className="text-white">{product.name}</strong>.
            The current retail price is <strong className="text-white">${product.price.toFixed(2)}</strong>.
          </p>
          
          <form id="request-price-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">New Requested Price ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  required 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={requestedPrice} 
                  onChange={(e) => setRequestedPrice(e.target.value)} 
                  className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" 
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="request-price-form" 
            disabled={isSubmitting}
            className="bg-[#38BDF8] text-[#0F172A] font-bold px-6 py-2 rounded-lg hover:bg-[#38BDF8]/90 transition-colors shadow-lg shadow-[#38BDF8]/20 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>

      </div>
    </div>
  );
}
