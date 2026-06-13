import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { Product } from "../data/products";
import { useProducts } from "../data/useProducts";

interface RecipeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function RecipeBuilderModal({ isOpen, onClose, product }: RecipeBuilderModalProps) {
  const { products, fetchComponents, addComponent, removeComponent } = useProducts();
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add form state
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const loadComponents = async () => {
    try {
      setLoading(true);
      const data = await fetchComponents(product.id);
      setComponents(data || []);
    } catch (err) {
      console.error("Failed to load components", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadComponents();
    }
  }, [isOpen, product.id]);

  if (!isOpen) return null;

  const handleAddComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComponentId || !quantity) return;

    setIsSubmitting(true);
    try {
      await addComponent(product.id, parseInt(selectedComponentId), parseInt(quantity));
      setSelectedComponentId("");
      setQuantity("1");
      loadComponents();
    } catch (err: any) {
      if (err.code === '23505') {
        alert("This item is already in the recipe. Remove it first to change the quantity.");
      } else {
        alert("Failed to add component.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveComponent = async (rowId: number) => {
    try {
      await removeComponent(rowId);
      loadComponents();
    } catch (err) {
      alert("Failed to remove component.");
    }
  };

  // Only standalone/raw items can be added as components (can't add a kit to a kit)
  const availableItems = products.filter(p => p.id !== product.id && p.isStandalone !== false && !p.isCustomBox);
  
  // Calculate total internal cost of the kit
  const totalCost = components.reduce((sum, row) => {
    return sum + (row.quantity_needed * (row.component_product?.manufacturing_cost || 0));
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1E293B] rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <LinkIcon className="w-5 h-5 mr-2 text-[#38BDF8]" />
              Recipe Builder: {product.name}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Define the individual items needed to assemble this kit.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Add Component Form */}
          <form onSubmit={handleAddComponent} className="flex gap-4 mb-8 bg-[#0F172A] p-4 rounded-xl border border-gray-800">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Item to Add</label>
              <select
                required
                value={selectedComponentId}
                onChange={(e) => setSelectedComponentId(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
              >
                <option value="" disabled>Select item...</option>
                {availableItems.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Cost: ${p.manufacturingCost.toFixed(2)})</option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-400 mb-1">Quantity</label>
              <input
                required
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#1E293B] border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#38BDF8] text-[#0F172A] font-bold px-4 py-2 rounded-lg hover:bg-[#38BDF8]/90 transition-colors flex items-center disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
          </form>

          {/* Current Components List */}
          <h3 className="text-lg font-bold mb-3 text-white">Current Ingredients</h3>
          {loading ? (
            <div className="text-center text-gray-400 py-4">Loading recipe...</div>
          ) : components.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-[#0F172A] rounded-xl border border-dashed border-gray-700">
              No items added to this recipe yet.
            </div>
          ) : (
            <div className="space-y-3">
              {components.map((row) => (
                <div key={row.id} className="flex items-center justify-between bg-[#0F172A] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1E293B] text-[#38BDF8] font-bold px-3 py-1 rounded-md">
                      {row.quantity_needed}x
                    </div>
                    <div>
                      <p className="font-medium text-white">{row.component_product?.name}</p>
                      <p className="text-xs text-gray-400">SKU: {row.component_product?.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-400">
                        ${(row.quantity_needed * (row.component_product?.manufacturing_cost || 0)).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        (${row.component_product?.manufacturing_cost?.toFixed(2)} ea)
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveComponent(row.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center p-4 bg-[#38BDF8]/10 border border-[#38BDF8]/30 rounded-xl mt-4">
                <span className="font-bold text-white">Total Internal Cost to Build:</span>
                <span className="font-bold text-[#38BDF8] text-xl">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end">
          <button onClick={onClose} className="bg-gray-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
