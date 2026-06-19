import React, { useEffect, useState } from "react";
import { useProducts } from "../data/useProducts";
import { PackagePlus, Truck } from "lucide-react";
import { Product } from "../data/products";
import { AddProductModal } from "./AddProductModal";

export function PurchasesPage() {
  const { products, fetchPurchases, logPurchase, addProduct } = useProducts();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [skuScan, setSkuScan] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [boxesPurchased, setBoxesPurchased] = useState("");
  const [itemsPerBox, setItemsPerBox] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [notes, setNotes] = useState("");

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await fetchPurchases();
      setPurchases(data || []);
    } catch (err) {
      console.error("Failed to load purchases", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !boxesPurchased || !itemsPerBox || !totalCost) return;

    setIsSubmitting(true);
    try {
      await logPurchase(
        parseInt(selectedProductId),
        parseInt(boxesPurchased),
        parseInt(itemsPerBox),
        parseFloat(totalCost),
        notes
      );
      
      // Reset form
      setSkuScan("");
      setBoxesPurchased("");
      setItemsPerBox("");
      setTotalCost("");
      setNotes("");
      
      loadPurchases();
      alert("Purchase logged! Stock and unit costs updated automatically.");
    } catch (err) {
      alert("Failed to log purchase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show individual/raw items in the dropdown, not pre-fab kits (which are built from components)
  const buyableProducts = products.filter(p => !p.isCustomBox && p.isStandalone !== false);

  const handleSkuScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSkuScan(val);
    
    // Auto-select product if SKU matches
    if (val.trim()) {
      const matchedProduct = buyableProducts.find(
        p => p.sku?.toLowerCase() === val.toLowerCase() || p.id.toString() === val
      );
      if (matchedProduct) {
        setSelectedProductId(matchedProduct.id.toString());
      }
    }
  };

  // Global Barcode Scanner Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      // If time between keystrokes is more than 50ms, it's likely human typing, not a scanner
      if (currentTime - lastKeyTime > 50) {
        buffer = '';
      }
      
      if (e.key.length === 1) {
        buffer += e.key;
      }

      // Barcode scanners usually send an 'Enter' key at the end
      if (e.key === 'Enter' && buffer.length > 2) {
        // If we are currently focused on an input that isn't the body, we might not want to intercept,
        // BUT barcode typing is so fast that it's safe to assume it's a scan.
        
        const matchedProduct = buyableProducts.find(
          p => p.sku?.toLowerCase() === buffer.toLowerCase() || p.id.toString() === buffer
        );
        
        if (matchedProduct) {
          setSkuScan(buffer);
          setSelectedProductId(matchedProduct.id.toString());
          // Optional: blur whatever was focused so it doesn't submit a form if they were in a text field
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
        buffer = '';
      }
      
      lastKeyTime = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buyableProducts]);

  if (loading && purchases.length === 0) {
    return <div className="p-10 text-center text-gray-400">Loading purchasing data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Truck className="w-8 h-8 mr-3 text-[#38BDF8]" />
          Receive Shipments
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Purchase Form */}
        <div className="bg-[#1E293B] rounded-xl border border-gray-800 p-6 shadow-xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <PackagePlus className="w-5 h-5 mr-2 text-[#38BDF8]" />
            Log New Supply Run
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#0F172A]/50 p-3 rounded-lg border border-[#38BDF8]/20">
              <label className="block text-xs font-bold text-[#38BDF8] mb-1 uppercase tracking-wider">Quick Scan Barcode</label>
              <input
                type="text"
                value={skuScan}
                onChange={handleSkuScan}
                className="w-full bg-black/20 border border-gray-700 text-[#38BDF8] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none font-mono"
                placeholder="Scan or type SKU here..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-400">Item Purchased</label>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs bg-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8]/20 px-2 py-1 rounded transition-colors"
                >
                  + New Product
                </button>
              </div>
              <select
                required
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
              >
                <option value="" disabled>Select product...</option>
                {buyableProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Boxes Bought</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={boxesPurchased}
                  onChange={(e) => setBoxesPurchased(e.target.value)}
                  className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Items Per Box</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={itemsPerBox}
                  onChange={(e) => setItemsPerBox(e.target.value)}
                  className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                  placeholder="e.g. 40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Total Cost ($) for ALL Boxes</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                placeholder="e.g. 50.00"
              />
            </div>

            {boxesPurchased && itemsPerBox && totalCost && (
              <div className="bg-[#0F172A] border border-[#38BDF8]/30 rounded-lg p-3 text-sm">
                <p className="text-gray-400 mb-1">Calculation Summary:</p>
                <p className="text-emerald-400">Total Yield: <strong>{parseInt(boxesPurchased) * parseInt(itemsPerBox)}</strong> individual items</p>
                <p className="text-[#38BDF8]">New Unit Cost: <strong>${(parseFloat(totalCost) / (parseInt(boxesPurchased) * parseInt(itemsPerBox))).toFixed(4)}</strong> / item</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                placeholder="e.g. Target run, receipt #123"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#38BDF8] text-[#0F172A] font-bold px-4 py-2 mt-4 rounded-lg hover:bg-[#38BDF8]/90 transition-colors shadow-lg shadow-[#38BDF8]/20 disabled:opacity-50"
            >
              {isSubmitting ? "Logging..." : "Log Supply Run"}
            </button>
          </form>
        </div>

        {/* Purchase History Table */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold">Recent Shipments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0F172A]/50 border-b border-gray-800">
                <tr>
                  <th className="p-4 font-semibold text-gray-400">Date</th>
                  <th className="p-4 font-semibold text-gray-400">Item</th>
                  <th className="p-4 font-semibold text-gray-400">Purchase</th>
                  <th className="p-4 font-semibold text-gray-400">Yield</th>
                  <th className="p-4 font-semibold text-gray-400">Unit Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-300 text-sm">
                      {new Date(p.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {p.products?.name}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {p.boxes_purchased} boxes @ ${p.total_cost.toFixed(2)}
                      <div className="text-xs text-gray-500">({p.items_per_box} items/box)</div>
                    </td>
                    <td className="p-4 text-emerald-400 font-medium">
                      +{p.total_yield}
                    </td>
                    <td className="p-4 text-[#38BDF8] font-bold">
                      ${p.unit_cost.toFixed(4)}
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No purchase history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (newProduct) => {
          try {
            await addProduct(newProduct);
            alert("Product added! You can now select it from the dropdown.");
          } catch (err) {
            alert("Failed to add product.");
          }
        }}
      />
    </div>
  );
}
