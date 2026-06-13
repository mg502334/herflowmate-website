import { useProducts } from "../data/useProducts";
import { DollarSign, TrendingUp, TrendingDown, Info } from "lucide-react";

export function PriceAnalysisPage() {
  const { products, loading, error } = useProducts();

  if (loading) return <div className="p-10 text-center text-gray-400">Loading analysis data...</div>;
  if (error) return <div className="p-10 text-center text-red-400">Error loading data.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Price & Margin Analysis</h1>
        <p className="text-gray-400">Overview of unit economics</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {products.map(product => {
          const totalCost = product.manufacturingCost + product.shippingCost + product.packagingCost;
          const grossProfit = product.price - totalCost;
          const marginPercentage = (grossProfit / product.price) * 100;
          
          return (
            <div key={product.id} className="bg-[#1E293B] rounded-2xl border border-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              {/* Decorative gradient blur */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#38BDF8] opacity-5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-400 mb-1">Retail Price</p>
                  <p className="text-3xl font-bold text-[#38BDF8]">${product.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 flex items-center">
                      Manufacturing 
                      <Info className="w-3 h-3 ml-1 text-gray-500" />
                    </span>
                    <span className="font-mono text-gray-200">${product.manufacturingCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${(product.manufacturingCost / product.price) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 flex items-center">
                      Shipping (Est.)
                    </span>
                    <span className="font-mono text-gray-200">${product.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${(product.shippingCost / product.price) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 flex items-center">
                      Packaging
                    </span>
                    <span className="font-mono text-gray-200">${product.packagingCost.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: `${(product.packagingCost / product.price) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Unit Cost</p>
                  <p className="text-xl font-mono text-gray-200">${totalCost.toFixed(2)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-xs text-emerald-500/70 uppercase tracking-wider font-semibold mb-1">Gross Margin</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-emerald-400">${grossProfit.toFixed(2)}</p>
                    <div className="flex items-center text-emerald-400 text-sm font-semibold mb-1">
                      {marginPercentage > 50 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {marginPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
