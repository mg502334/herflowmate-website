import { useState } from "react";
import { Check, Shield, HelpCircle, PackageOpen, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";

const tiers = [
  {
    id: "basic",
    name: "Basic Care Box",
    tagline: "Monthly essentials",
    basePrice: 14,
    desc: "100% reliable protection to cover your regular flow days. Package shipped discreetly in custom mailers.",
    features: ["16 Premium cotton pads/tampons", "Biodegradable wrappers", "High-quality cotton", "Custom branding colors"],
    accent: "bg-[#FDF1F3] text-[#F8C8D1]",
  },
  {
    id: "comfort",
    name: "Comfort Plus Box",
    tagline: "Essentials + extras",
    basePrice: 22,
    desc: "Comprehensive premium care for heavier flow days, supplemented with soothing self‑care additions.",
    features: ["24 Premium cotton pads/tampons", "OB-GYN engineered fit", "1 Midol On-the-Go pack", "2 Self‑heating comfort patches"],
    accent: "bg-[#F8C8D1] text-white",
    badge: "Popular Pick",
  },
  {
    id: "wellness",
    name: "Wellness Bundle",
    tagline: "Full hygiene + self‑care",
    basePrice: 32,
    desc: "The ultimate cycle coverage. Premium pads, tampons, liners, pampering travel packs, heat patches, and a free brand bag.",
    features: ["36 Premium cotton items (any mix)", "Custom brand cloth bag included", "2 Pampering Travel Packs", "4 Self‑heating comfort patches", "1 Midol On-the-Go pack"],
    accent: "bg-[#B0C4DE] text-white",
  },
];

export function PlanBuilder() {
  const { addToCart } = useCart();
  const [billing, setBilling] = useState<"monthly" | "onetime">("monthly");
  const [selectedTier, setSelectedTier] = useState("comfort");
  
  // Customization state
  const [mix, setMix] = useState("mix"); // 'pads' | 'tampons' | 'mix'
  const [flow, setFlow] = useState("regular"); // 'regular' | 'heavy' | 'overnight'
  const [extra, setExtra] = useState("midol"); // 'midol' | 'patches' | 'pampering'

  const activeTier = tiers.find((t) => t.id === selectedTier) || tiers[1];
  
  const discountFactor = billing === "monthly" ? 0.85 : 1.0;
  const currentPrice = Math.round(activeTier.basePrice * discountFactor);

  const handleAddBox = () => {
    const mixLabel = mix === "pads" ? "Pads Only" : mix === "tampons" ? "Tampons Only" : "Pads & Tampons Mix";
    const flowLabel = flow === "regular" ? "Mostly Regular" : flow === "heavy" ? "Heavy Flow" : "Overnight Mix";
    
    let extraLabel = "";
    if (selectedTier !== "basic") {
      extraLabel = ` + ${extra === "midol" ? "Midol" : extra === "patches" ? "Heat Patches" : "Travel Pack"}`;
    }

    addToCart({
      id: `box-${activeTier.id}-${billing}`,
      name: activeTier.name,
      variant: `${mixLabel} (${flowLabel})${extraLabel}`,
      price: currentPrice,
      image: "https://images.unsplash.com/photo-1601379327190-e3ef16de9845?w=600&h=700&fit=crop&auto=format",
      isSubscription: billing === "monthly",
      frequency: billing === "monthly" ? "4 weeks" : undefined,
    });
  };

  return (
    <section id="products" className="py-24 bg-[#FAFAFA] relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Decorative backdrop gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#FDF1F3]/40 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#B0C4DE]/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12 gap-4">
          <span className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-3.5 py-1 rounded-full">
            Plan Builder
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
            }}
          >
            Choose your plan
          </h2>
          <p className="text-xs text-gray-500 max-w-lg leading-relaxed">
            Select an essentials tier and customize it to match your body's rhythm. Save 15% on monthly cycles. Swap, pause, or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full shadow-md border border-[#F8C8D1]/5 mt-4">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                billing === "monthly"
                  ? "bg-[#F8C8D1] text-white shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Subscribe & Save (15%)
            </button>
            <button
              onClick={() => setBilling("onetime")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                billing === "onetime"
                  ? "bg-[#F8C8D1] text-white shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              One-Time Buy
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-stretch">
          {/* Left: Customizer & Tiers */}
          <div className="flex flex-col gap-8">
            {/* Tiers Grid */}
            <div className="grid sm:grid-cols-3 gap-5">
              {tiers.map((tier) => {
                const isSelected = selectedTier === tier.id;
                const tierPrice = Math.round(tier.basePrice * discountFactor);
                
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative text-left p-6 bg-white rounded-3xl border transition-all flex flex-col justify-between shadow-sm cursor-pointer ${
                      isSelected
                        ? "border-[#F8C8D1] shadow-md shadow-[#F8C8D1]/5 transform -translate-y-0.5"
                        : "border-gray-100 hover:border-[#F8C8D1]/20"
                    }`}
                  >
                    {tier.badge && (
                      <span className="absolute -top-2.5 right-6 px-3 py-1 rounded-full text-[9px] font-bold bg-[#F8C8D1] text-white uppercase tracking-wider">
                        {tier.badge}
                      </span>
                    )}

                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                        {tier.tagline}
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2C3E50" }}>
                        {tier.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 leading-normal min-h-[64px]">
                        {tier.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline gap-1">
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#2C3E50" }}>
                        ${tierPrice}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {billing === "monthly" ? "/ month" : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Customization Options */}
            <div className="bg-white rounded-3xl p-7 border border-[#F8C8D1]/5 flex flex-col gap-6 shadow-sm">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C3E50" }} className="border-b border-gray-100 pb-3 flex items-center gap-2">
                🔧 Customize Box Contents
              </h3>

              {/* Option 1: Product Preference */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>1. Product Preference</span>
                  <span className="text-[#2C3E50] text-[10px] bg-[#F8C8D1] font-bold px-2 py-0.5 rounded-full">Premium cotton</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Pads only", val: "pads" },
                    { label: "Tampons only", val: "tampons" },
                    { label: "Pads & Tampons", val: "mix" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setMix(opt.val)}
                      className={`py-3 rounded-2xl text-xs font-semibold transition-all border ${
                        mix === opt.val
                          ? "border-[#F8C8D1] bg-[#F8C8D1] text-[#2C3E50] shadow-inner font-bold"
                          : "border-gray-100 hover:border-[#F8C8D1]/20 hover:bg-[#FAFAFA] text-gray-500"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Flow Intensity / Absorption */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>2. Flow Absorption Mix</span>
                  <span className="text-[#2C3E50] text-[10px] bg-[#F8C8D1] font-bold px-2 py-0.5 rounded-full">Leak-free fit</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Mostly Regular", val: "regular" },
                    { label: "Mostly Heavy", val: "heavy" },
                    { label: "Overnight Protect", val: "overnight" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setFlow(opt.val)}
                      className={`py-3 rounded-2xl text-xs font-semibold transition-all border ${
                        flow === opt.val
                          ? "border-[#F8C8D1] bg-[#F8C8D1] text-[#2C3E50] shadow-inner font-bold"
                          : "border-gray-100 hover:border-[#F8C8D1]/20 hover:bg-[#FAFAFA] text-gray-500"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Self-care Extras (Only for Comfort Plus & Wellness) */}
              {selectedTier !== "basic" && (
                <div className="flex flex-col gap-3 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>3. Choose Your Self-Care Add-on</span>
                    <span className="text-[#2C3E50] text-[10px] bg-[#F8C8D1] font-bold px-2 py-0.5 rounded-full">Included bonus</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Midol On-the-Go", val: "midol" },
                      { label: "Soothing Heat Patches", val: "patches" },
                      { label: "Pampering Travel Pack", val: "pampering" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setExtra(opt.val)}
                        className={`py-3 px-2 rounded-2xl text-[11px] font-semibold transition-all border leading-tight ${
                          extra === opt.val
                            ? "border-[#F8C8D1] bg-[#F8C8D1] text-[#2C3E50] shadow-inner font-bold"
                            : "border-gray-100 hover:border-[#F8C8D1]/20 hover:bg-[#FAFAFA] text-gray-500"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Beautiful Visual Box Preview Panel */}
          <div
            className="rounded-3xl p-8 border flex flex-col justify-between shadow-lg text-white"
            style={{
              borderColor: "rgba(108, 93, 211, 0.15)",
              background: "linear-gradient(135deg, #F8C8D1 0%, #2C3E50 100%)",
            }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
                <PackageOpen size={13} />
                Live Box Preview
              </div>

              {/* Graphical Box Layout */}
              <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-8 flex items-center justify-center">
                {/* Visual stylings for Box */}
                <div className="absolute w-36 h-36 bg-[#B0C4DE]/20 rounded-full blur-2xl" />
                <div className="relative border-4 border-white/20 w-32 h-24 rounded-2xl flex flex-col items-center justify-center shadow-2xl bg-white/5 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <div className="text-white text-3xl mb-1">📦</div>
                  <span className="text-[10px] tracking-widest font-mono text-[#FDF1F3] uppercase font-bold">
                    HerFlowMate
                  </span>
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FDF1F3] text-[#F8C8D1] rounded-full flex items-center justify-center text-[7px] font-bold transform translate-x-1.5 -translate-y-1.5 shadow-md">
                    ✓
                  </div>
                </div>
              </div>

              {/* Config Details */}
              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }} className="text-white">
                    {activeTier.name}
                  </h4>
                  <div className="text-[10px] text-[#FDF1F3] uppercase tracking-wider font-semibold mt-1">
                    {billing === "monthly" ? "Subscription Mode" : "One-Time Delivery"}
                  </div>
                </div>

                {/* Checklist of what's inside */}
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2.5 text-xs text-[#FDF1F3]">
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Check size={10} color="white" />
                    </div>
                    <span>
                      {mix === "pads" ? "Premium Cotton Pads" : mix === "tampons" ? "Premium applicator Tampons" : "Pads & Tampons mixed"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-[#FDF1F3]">
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Check size={10} color="white" />
                    </div>
                    <span>
                      Flow profile: {flow === "regular" ? "Mostly Regular" : flow === "heavy" ? "Heavy Absorption" : "Overnight Protection"}
                    </span>
                  </li>
                  {selectedTier !== "basic" && (
                    <li className="flex items-center gap-2.5 text-xs text-[#FDF1F3]">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Check size={10} color="white" />
                      </div>
                      <span className="capitalize">
                        Self-Care: {extra === "midol" ? "Midol On-the-Go" : extra === "patches" ? "Heat Patch Pack" : "Pampering Travel Pack"}
                      </span>
                    </li>
                  )}
                  {selectedTier === "wellness" && (
                    <li className="flex items-center gap-2.5 text-xs text-[#FDF1F3]">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Check size={10} color="white" />
                      </div>
                      <span>Free custom brand bag included</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#FDF1F3]">Total Cost</span>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold">
                  ${currentPrice}
                  {billing === "monthly" && <span className="text-xs font-normal"> / mo</span>}
                </span>
              </div>

              <button
                onClick={handleAddBox}
                className="w-full py-4 bg-white hover:bg-[#FDF1F3] text-[#F8C8D1] rounded-full font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
              >
                Add custom box to cart
                <ArrowRight size={14} />
              </button>

              <div className="text-[10px] text-center text-[#FDF1F3]/60 flex items-center justify-center gap-1 mt-1">
                <Shield size={10} />
                OB-GYN sized & chemical-free certified
              </div>
              <div className="text-[10px] text-center text-[#FDF1F3]/60 flex items-center justify-center gap-1">
                <span className="font-bold bg-[#FDF1F3] text-[#F8C8D1] px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider">FSA / HSA</span> Eligible
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
