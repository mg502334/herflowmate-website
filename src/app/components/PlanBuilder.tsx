import { useState } from "react";
import { Check, Shield, PackageOpen, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "./CartContext";
import padsHero from "../../assets/pads_hero.png";
import { motion, AnimatePresence } from "motion/react";

const tiers = [
  {
    id: "basic",
    name: "Basic Care",
    tagline: "Monthly essentials",
    basePrice: 14,
    desc: "100% reliable protection to cover your regular flow days. Package shipped discreetly in standard mailers.",
    features: ["16 Brand-name pads/tampons", "Standard wrappers", "Reliable protection", "Discreetly packaged"],
    accent: "bg-[#FDF1F3] text-[#F8C8D1]",
  },
  {
    id: "comfort",
    name: "Comfort Plus",
    tagline: "Essentials + extras",
    basePrice: 22,
    desc: "Comprehensive name-brand care for heavier flow days, supplemented with soothing additions.",
    features: ["24 Brand-name pads/tampons", "Trusted leak protection", "1 Midol On-the-Go pack", "2 Name-brand heat patches"],
    accent: "bg-[#F8C8D1] text-white",
    badge: "Popular Pick",
  },
  {
    id: "wellness",
    name: "Wellness Bundle",
    tagline: "Full hygiene + self-care",
    basePrice: 32,
    desc: "The ultimate cycle coverage. Brand-name pads, tampons, liners, Advil travel packs, heat patches, and a free pouch.",
    features: ["36 Brand-name items (any mix)", "Free carrying pouch", "1 Advil Travel Pack", "2 Name-brand heat patches", "1 Midol On-the-Go pack"],
    accent: "bg-[#B0C4DE] text-white",
  },
];

export function PlanBuilder() {
  const { addToCart } = useCart();
  const [billing, setBilling] = useState<"monthly" | "onetime">("monthly");
  const [selectedTier, setSelectedTier] = useState("comfort");
  
  const [mix, setMix] = useState("mix");
  const [flow, setFlow] = useState("regular");
  const [extra, setExtra] = useState("midol");

  const activeTier = tiers.find((t) => t.id === selectedTier) || tiers[1];
  
  const discountFactor = billing === "monthly" ? 0.85 : 1.0;
  const currentPrice = Math.round(activeTier.basePrice * discountFactor);

  const handleAddBox = () => {
    const mixLabel = mix === "pads" ? "Pads Only" : mix === "tampons" ? "Tampons Only" : "Pads & Tampons Mix";
    const flowLabel = flow === "regular" ? "Mostly Regular" : flow === "heavy" ? "Heavy Flow" : "Overnight Mix";
    
    let extraLabel = "";
    if (selectedTier !== "basic") {
      extraLabel = ` + ${extra === "midol" ? "Midol" : extra === "patches" ? "Heat Patches" : "Advil Pack"}`;
    }

    addToCart({
      id: `box-${activeTier.id}-${billing}`,
      name: `${activeTier.name} Box`,
      variant: `${mixLabel} (${flowLabel})${extraLabel}`,
      price: currentPrice,
      image: padsHero,
      isSubscription: billing === "monthly",
      frequency: billing === "monthly" ? "4 weeks" : undefined,
    });
  };

  return (
    <section id="products" className="py-24 bg-[#FAFAFA] relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Decorative backdrop gradients with framer-motion */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-[#FDF1F3]/60 rounded-full blur-[100px] opacity-70 pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-[#B0C4DE]/30 rounded-full blur-[100px] opacity-60 pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 gap-5">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-white shadow-sm border border-[#FDF1F3] px-4 py-1.5 rounded-full flex items-center gap-2"
          >
            <Sparkles size={12} />
            Phase 1: Custom Box
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 700, color: "#2C3E50", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Curate your cycle
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed"
          >
            Select an essentials tier and customize it to match your body's rhythm. Save 15% on monthly deliveries. Pause or cancel anytime.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50 mt-4 relative z-20"
          >
            <button
              onClick={() => setBilling("monthly")}
              className={`relative px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 ${
                billing === "monthly" ? "text-white shadow-md" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {billing === "monthly" && (
                <motion.div layoutId="billing-pill" className="absolute inset-0 bg-[#F8C8D1] rounded-full -z-10" />
              )}
              Subscribe & Save (15%)
            </button>
            <button
              onClick={() => setBilling("onetime")}
              className={`relative px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 ${
                billing === "onetime" ? "text-white shadow-md" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {billing === "onetime" && (
                <motion.div layoutId="billing-pill" className="absolute inset-0 bg-[#F8C8D1] rounded-full -z-10" />
              )}
              One-Time Buy
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Customizer & Tiers */}
          <div className="flex-1 flex flex-col gap-10 w-full">
            {/* Tiers List */}
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => {
                const isSelected = selectedTier === tier.id;
                const tierPrice = Math.round(tier.basePrice * discountFactor);
                
                return (
                  <motion.div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-7 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-white border-[#F8C8D1] shadow-xl shadow-[#F8C8D1]/10 z-10"
                        : "bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    {isSelected && (
                      <motion.div layoutId="tier-outline" className="absolute inset-0 border-2 border-[#F8C8D1] rounded-[2rem] pointer-events-none" />
                    )}
                    {tier.badge && (
                      <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#F8C8D1] to-[#F3A5B8] text-white uppercase tracking-wider shadow-md">
                        {tier.badge}
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {tier.tagline}
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#2C3E50" }}>
                        {tier.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed min-h-[60px]">
                        {tier.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-baseline gap-1.5">
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2C3E50" }}>
                        ${tierPrice}
                      </span>
                      <span className="text-[11px] font-medium text-gray-400">
                        {billing === "monthly" ? "/ month" : ""}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Customization Options */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white shadow-xl shadow-[#2C3E50]/5 flex flex-col gap-10">
              <div className="flex items-center gap-3 border-b border-gray-100/80 pb-5">
                <div className="w-10 h-10 rounded-full bg-[#FDF1F3] flex items-center justify-center text-[#F8C8D1]">
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#2C3E50" }}>
                  Customize Box Contents
                </h3>
              </div>

              {/* Option 1: Product Preference */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2C3E50]">1. Product Preference</span>
                  <span className="text-[#F8C8D1] text-[10px] bg-[#FDF1F3] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Brand-name</span>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[
                    { label: "Pads only", val: "pads" },
                    { label: "Tampons only", val: "tampons" },
                    { label: "Mixed", val: "mix" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setMix(opt.val)}
                      className={`relative py-3.5 px-2 rounded-2xl text-[11px] md:text-xs font-bold transition-all duration-300 border overflow-hidden ${
                        mix === opt.val
                          ? "border-[#F8C8D1] text-white shadow-md"
                          : "border-gray-200 hover:border-[#F8C8D1]/40 bg-white text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {mix === opt.val && (
                        <motion.div layoutId="mix-bg" className="absolute inset-0 bg-[#F8C8D1] -z-10" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Flow Intensity / Absorption */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2C3E50]">2. Flow Profile</span>
                  <span className="text-[#F8C8D1] text-[10px] bg-[#FDF1F3] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Leak-free</span>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[
                    { label: "Regular", val: "regular" },
                    { label: "Heavy", val: "heavy" },
                    { label: "Overnight", val: "overnight" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setFlow(opt.val)}
                      className={`relative py-3.5 px-2 rounded-2xl text-[11px] md:text-xs font-bold transition-all duration-300 border overflow-hidden ${
                        flow === opt.val
                          ? "border-[#F8C8D1] text-white shadow-md"
                          : "border-gray-200 hover:border-[#F8C8D1]/40 bg-white text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {flow === opt.val && (
                        <motion.div layoutId="flow-bg" className="absolute inset-0 bg-[#F8C8D1] -z-10" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Self-care Extras */}
              <AnimatePresence>
                {selectedTier !== "basic" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-bold text-[#2C3E50]">3. Self-Care Add-on</span>
                      <span className="text-[#F8C8D1] text-[10px] bg-[#FDF1F3] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Bonus</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {[
                        { label: "Midol Pack", val: "midol" },
                        { label: "Heat Patches", val: "patches" },
                        { label: "Advil Pack", val: "advil" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => setExtra(opt.val)}
                          className={`relative py-3.5 px-2 rounded-2xl text-[11px] md:text-xs font-bold transition-all duration-300 border overflow-hidden ${
                            extra === opt.val
                              ? "border-[#F8C8D1] text-white shadow-md"
                              : "border-gray-200 hover:border-[#F8C8D1]/40 bg-white text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          {extra === opt.val && (
                            <motion.div layoutId="extra-bg" className="absolute inset-0 bg-[#F8C8D1] -z-10" />
                          )}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Beautiful Visual Box Preview Panel (Sticky) */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-28">
            <motion.div
              layout
              className="rounded-[2.5rem] p-8 border flex flex-col justify-between shadow-2xl text-white relative overflow-hidden"
              style={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                background: "linear-gradient(145deg, #2C3E50 0%, #1A2530 100%)",
              }}
            >
              {/* Glass decorative elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F8C8D1]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#B0C4DE]/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
                  <PackageOpen size={14} className="text-[#F8C8D1]" />
                  Live Preview
                </div>

                {/* Graphical Box Layout */}
                <div className="relative w-full max-w-[240px] h-[200px] mx-auto mb-10 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedTier + mix}
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="relative border border-white/20 w-40 h-32 rounded-3xl flex flex-col items-center justify-center shadow-2xl bg-white/5 backdrop-blur-md"
                    >
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="text-white text-5xl mb-2 drop-shadow-lg"
                      >
                        📦
                      </motion.div>
                      <span className="text-[10px] tracking-widest font-mono text-[#F8C8D1] uppercase font-bold">
                        {activeTier.name}
                      </span>
                      
                      {/* Floating Badges based on config */}
                      <div className="absolute -right-4 -top-4 w-10 h-10 bg-[#FDF1F3] rounded-full flex items-center justify-center shadow-lg border-2 border-[#1A2530]">
                        <span className="text-[#2C3E50] text-sm font-bold text-center">
                          {mix === "pads" ? "🌸" : mix === "tampons" ? "🩸" : "✨"}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Config Details */}
                <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700 }} className="text-white">
                      {activeTier.name} Box
                    </h4>
                    <div className="text-[10px] text-[#F8C8D1] uppercase tracking-wider font-bold mt-1">
                      {billing === "monthly" ? "Monthly Subscription" : "One-Time Delivery"}
                    </div>
                  </div>

                  {/* Checklist of what's inside */}
                  <ul className="flex flex-col gap-3 mt-2">
                    <li className="flex items-center gap-3 text-xs md:text-sm text-gray-200">
                      <div className="w-5 h-5 rounded-full bg-[#F8C8D1]/20 border border-[#F8C8D1]/30 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-[#F8C8D1]" />
                      </div>
                      <span className="font-medium">
                        {mix === "pads" ? "Brand-name Pads Only" : mix === "tampons" ? "Brand-name Applicator Tampons" : "Pads & Tampons Assortment"}
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-xs md:text-sm text-gray-200">
                      <div className="w-5 h-5 rounded-full bg-[#F8C8D1]/20 border border-[#F8C8D1]/30 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-[#F8C8D1]" />
                      </div>
                      <span className="font-medium">
                        Flow: {flow === "regular" ? "Regular Absorption" : flow === "heavy" ? "Heavy Absorption" : "Overnight Protection"}
                      </span>
                    </li>
                    {selectedTier !== "basic" && (
                      <li className="flex items-center gap-3 text-xs md:text-sm text-gray-200">
                        <div className="w-5 h-5 rounded-full bg-[#F8C8D1]/20 border border-[#F8C8D1]/30 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-[#F8C8D1]" />
                        </div>
                        <span className="font-medium capitalize">
                          Bonus: {extra === "midol" ? "Midol On-the-Go" : extra === "patches" ? "Heat Patch Pack" : "Advil Travel Pack"}
                        </span>
                      </li>
                    )}
                    {selectedTier === "wellness" && (
                      <li className="flex items-center gap-3 text-xs md:text-sm text-gray-200">
                        <div className="w-5 h-5 rounded-full bg-[#F8C8D1]/20 border border-[#F8C8D1]/30 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-[#F8C8D1]" />
                        </div>
                        <span className="font-medium">Free Carrying Pouch</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="mt-10 flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-end bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Total</span>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-white">
                      ${currentPrice}
                    </span>
                    {billing === "monthly" && <span className="text-xs text-[#F8C8D1] font-bold">/ mo</span>}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddBox}
                  className="w-full py-4 bg-gradient-to-r from-[#F8C8D1] to-[#F3A5B8] text-white rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer mt-2"
                >
                  Add box to cart
                  <ArrowRight size={16} />
                </motion.button>

                <div className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1.5 mt-2 font-medium">
                  <Shield size={12} className="text-[#F8C8D1]" />
                  Trusted retailer-sourced essentials
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
