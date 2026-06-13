import { useState } from "react";
import { Search, Plus, Minus, PackageX, DollarSign } from "lucide-react";
import { AddProductModal } from "./AddProductModal";
import { useProducts } from "../data/useProducts";
import { Product } from "../data/products";
import { useAdminAuth } from "./AdminAuthContext";
import { RequestPriceModal } from "./RequestPriceModal";
import { RecipeBuilderModal } from "./RecipeBuilderModal";

export function InventoryPage() {
  const { products, loading, error, updateStock, addProduct } = useProducts();
  const { role } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = async (newProduct: Product) => {
    try {
      await addProduct(newProduct);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to add product.");
    }
  };

  const handleRequestPrice = (product: Product) => {
    setSelectedProduct(product);
    setIsPriceModalOpen(true);
  };

  const handleManageRecipe = (product: Product) => {
    setSelectedProduct(product);
    setIsRecipeModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading inventory from database...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search products..."
              className="bg-[#1E293B] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#38BDF8] text-[#0F172A] font-bold px-4 py-2 rounded-lg hover:bg-[#38BDF8]/90 transition-colors flex items-center shadow-lg shadow-[#38BDF8]/20"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Product
            </button>
          )}
        </div>
      </div>

      {role === 'admin' && (
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddProduct} 
        />
      )}

      {selectedProduct && (
        <>
          <RequestPriceModal
            isOpen={isPriceModalOpen}
            onClose={() => setIsPriceModalOpen(false)}
            product={selectedProduct}
          />
          <RecipeBuilderModal
            isOpen={isRecipeModalOpen}
            onClose={() => setIsRecipeModalOpen(false)}
            product={selectedProduct}
          />
        </>
      )}

      <div className="bg-[#1E293B] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0F172A]/50 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold text-gray-400">Product</th>
                <th className="p-4 font-semibold text-gray-400">SKU</th>
                <th className="p-4 font-semibold text-gray-400">Status</th>
                <th className="p-4 font-semibold text-gray-400">Retail Price</th>
                <th className="p-4 font-semibold text-gray-400 text-right">Stock Level</th>
                <th className="p-4 font-semibold text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.isStandalone !== false && !product.isCustomBox && (
                            <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Item</span>
                          )}
                          {(product.isStandalone === false || product.isCustomBox) && (
                            <span className="text-[10px] uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">Kit</span>
                          )}
                          <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {product.stock > 10 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        In Stock
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                      {role === 'staff' && (
                        <button 
                          onClick={() => handleRequestPrice(product)}
                          className="text-xs bg-[#1E293B] border border-gray-700 hover:border-[#38BDF8] px-2 py-1 rounded-md text-gray-400 hover:text-white transition-colors flex items-center"
                          title="Request Price Change"
                        >
                          <DollarSign className="w-3 h-3 mr-1" /> Edit
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-lg">
                    {product.stock}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      {role === 'admin' && (product.isStandalone === false || product.isCustomBox) && (
                        <button 
                          onClick={() => handleManageRecipe(product)}
                          className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 px-2 py-1.5 rounded-md transition-colors mr-2"
                        >
                          Recipe
                        </button>
                      )}
                      <button 
                        onClick={() => updateStock(product.id, -1)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        disabled={product.stock <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => updateStock(product.id, 1)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <PackageX className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No products found matching "{searchQuery}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
