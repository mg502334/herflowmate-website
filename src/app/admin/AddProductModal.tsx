import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { Product } from "../data/products";
import { supabase } from "../../lib/supabase";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    manufacturingCost: "",
    shippingCost: "",
    packagingCost: ""
  });

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let imageUrl = "https://via.placeholder.com/150";

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('public-assets')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('public-assets')
          .getPublicUrl(fileName);
        
        if (data?.publicUrl) imageUrl = data.publicUrl;
      }

      // Create new mock product
      const newProduct: Product = {
        id: Math.floor(Math.random() * 10000), // Random ID for mock
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        manufacturingCost: parseFloat(formData.manufacturingCost) || 0,
        shippingCost: parseFloat(formData.shippingCost) || 0,
        packagingCost: parseFloat(formData.packagingCost) || 0,
        // Default mock fields
        tagline: "New Product",
        description: "Description coming soon.",
        originalPrice: null,
        image: imageUrl,
        variants: [],
        features: []
      };

      onAdd(newProduct);
      
      // Reset form
      setFormData({
        name: "", sku: "", price: "", stock: "", 
        manufacturingCost: "", shippingCost: "", packagingCost: ""
      });
      setFile(null);
      onClose();
    } catch (err) {
      console.error("Failed to add product", err);
      alert("Failed to add product image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-[#0F172A] border border-gray-700 text-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1E293B] file:text-[#38BDF8] hover:file:bg-[#1E293B]/80 cursor-pointer" 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="e.g. Heating Pad" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SKU</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="e.g. HFM-PAD-01" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Initial Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="0" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Retail Price ($)</label>
                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Mfg Cost ($)</label>
                <input required type="number" step="0.01" name="manufacturingCost" value={formData.manufacturingCost} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Shipping Cost ($)</label>
                <input required type="number" step="0.01" name="shippingCost" value={formData.shippingCost} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Packaging Cost ($)</label>
                <input required type="number" step="0.01" name="packagingCost" value={formData.packagingCost} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none" placeholder="0.00" />
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
            form="add-product-form" 
            disabled={isUploading}
            className={`font-bold px-6 py-2 rounded-lg transition-colors shadow-lg ${
              isUploading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#38BDF8]/90 shadow-[#38BDF8]/20'
            }`}
          >
            {isUploading ? "Uploading..." : "Add Product"}
          </button>
        </div>

      </div>
    </div>
  );
}
