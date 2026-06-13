import React from 'react';
import { AlertCircle, TrendingUp, Package, RefreshCw, ShoppingCart } from 'lucide-react';

export function PricingStrategyPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pricing Strategy Model</h1>
        <p className="text-gray-400">
          Proposed pricing strategy for HerFlowMate, considering existing product cost structures and custom kitting goals.
        </p>
      </div>

      {/* Current Margin Analysis */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#38BDF8] flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Current Margin Analysis (Baseline)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-medium text-white mb-4">Diva Cup (Standalone)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Retail Price</span>
                <span className="text-white font-medium">$35.00</span>
              </div>
              <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                <span>Total COGS</span>
                <span className="text-red-400">$13.00</span>
              </div>
              <div className="pl-4 space-y-1 text-sm text-gray-400">
                <div className="flex justify-between"><span>Manufacturing</span><span>$8.50</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>$3.00</span></div>
                <div className="flex justify-between"><span>Packaging</span><span>$1.50</span></div>
              </div>
              <div className="flex justify-between text-[#38BDF8] font-bold pt-2">
                <span>Gross Margin</span>
                <span>$22.00 (62.8%)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-medium text-white mb-4">First Period Kit (Curated Box)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Retail Price</span>
                <span className="text-white font-medium">$45.00</span>
              </div>
              <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                <span>Total COGS</span>
                <span className="text-red-400">$24.50</span>
              </div>
              <div className="pl-4 space-y-1 text-sm text-gray-400">
                <div className="flex justify-between"><span>Manufacturing</span><span>$15.00</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>$5.00</span></div>
                <div className="flex justify-between"><span>Packaging</span><span>$4.50</span></div>
              </div>
              <div className="flex justify-between text-[#38BDF8] font-bold pt-2">
                <span>Gross Margin</span>
                <span>$20.50 (45.5%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg flex items-start gap-3 mt-4">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <p className="text-yellow-200/90 text-sm">
            <strong>Warning:</strong> While the Diva Cup has a healthy 60%+ margin, the First Period Kit is below 50%. If we plan to offer discounts, influencer codes, or affiliate payouts, we need to ensure our blended margin stays above 50% to maintain a healthy CAC (Customer Acquisition Cost) ratio.
          </p>
        </div>
      </section>

      {/* Proposed Pricing Models */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#38BDF8] flex items-center gap-2">
          <RefreshCw className="w-5 h-5" /> Proposed Pricing Models
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-800 flex flex-col">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">1. One-off Purchases</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">
              Customers buy items individually at full retail price. Flat rate shipping of $5.99 for orders under $50. Free shipping $50+.
            </p>
            <div className="bg-gray-800/50 p-3 rounded text-sm text-gray-300">
              <strong>Goal:</strong> Maximize margin on impulse buys and one-time needs.
            </div>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-800 flex flex-col">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">2. Build-a-Box Custom</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">
              Base fee of $12/delivery (covers premium packaging, baseline items). Add-ons offered at 15-20% discount vs retail.
            </p>
            <div className="bg-gray-800/50 p-3 rounded text-sm text-gray-300">
              <strong>Goal:</strong> High personalization, increased AOV, strong retention.
            </div>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-800 flex flex-col">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">3. Curated Subscriptions</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">
              Fixed-price boxes shipped monthly/quarterly. <br/>
              - The Essentials ($19.99)<br/>
              - The Comfort Box ($34.99)<br/>
              - The Ultimate Flow ($54.99)
            </p>
            <div className="bg-gray-800/50 p-3 rounded text-sm text-gray-300">
              <strong>Goal:</strong> Predictable recurring revenue, simple choices.
            </div>
          </div>
        </div>
      </section>

      {/* Open Questions */}
      <section className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Strategic Questions for Review
        </h3>
        <ul className="space-y-3 text-sm text-blue-100/80">
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">1.</span> 
            <div><strong>Shipping Costs:</strong> Build shipping costs into the subscription price (for "Free Shipping"), or charge it as a separate line item?</div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">2.</span> 
            <div><strong>Focus:</strong> Prioritize UI development for custom build-a-box, or push the 3 pre-curated tiers first?</div>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">3.</span> 
            <div><strong>Discounts:</strong> Comfortable offering ~15% discount on products when bundled into a subscription?</div>
          </li>
        </ul>
      </section>
    </div>
  );
}
