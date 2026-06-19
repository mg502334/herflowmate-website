import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, PackageOpen, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { useCart } from "../components/CartContext";

const tiers = [
  { id: "basic", name: "Basic Care", price: 14, budget: 14, color: "bg-[#FDF1F3] text-[#F8C8D1]", shipping: 4 },
  { id: "comfort", name: "Comfort Plus", price: 22, budget: 22, color: "bg-[#F8C8D1] text-white", shipping: 5 },
  { id: "wellness", name: "Wellness Bundle", price: 32, budget: 32, color: "bg-[#B0C4DE] text-white", shipping: 6 },
];

const brandCategories = {
  "Conventional": ["Always", "U by Kotex", "Playtex", "Tampax", "Stayfree", "Carefree", "Equate", "Up & Up", "CVS Health", "Walgreens"],
  "Organic/Natural": ["L.", "Rael", "Cora", "O.B.", "Seventh Generation"],
  "Period Underwear": ["Thinx", "Knix", "Always ZZZ"],
  "Cups/Discs": ["DivaCup", "Saalt", "Flex", "Cora Cup"],
};

const productTypes = {
  "Pads": 0.50,
  "Pantyliners": 0.20,
  "Tampons": 0.40,
  "Period Underwear": 15.00,
  "Menstrual Cup": 25.00,
  "Disc": 3.00,
};

const flows = ["Light", "Regular", "Super", "Overnight"];

export function CustomOrderPage() {
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  
  // Overall Box State
  const [boxType, setBoxType] = useState(tiers[1]);
  const [billing, setBilling] = useState<"monthly" | "onetime">("monthly");
  
  // Current Item State (Loop)
  const [category, setCategory] = useState("Conventional");
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [flow, setFlow] = useState("");
  const [qty, setQty] = useState(1);

  // Box Contents
  const [items, setItems] = useState<any[]>([]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const currentRetailValue = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const remainingBudget = boxType.budget - boxType.shipping - currentRetailValue;
  const currentItemPrice = productTypes[product as keyof typeof productTypes] || 0;
  
  const handleAddItem = () => {
    if (!brand || !product) return;
    const newItemCost = currentItemPrice * qty;
    if (newItemCost > remainingBudget) {
      alert("This exceeds your box's remaining budget!");
      return;
    }
    setItems([...items, { id: Date.now(), category, brand, product, flow, qty, price: currentItemPrice }]);
    // Reset selection for next item
    setBrand("");
    setProduct("");
    setFlow("");
    setQty(1);
    setStep(2); // Go back to brand selection to add more
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleAddBoxToCart = () => {
    addToCart({
      id: `custom-${boxType.id}-${Date.now()}`,
      name: `Custom ${boxType.name}`,
      variant: `${items.length} items included`,
      price: billing === "monthly" ? Math.round(boxType.price * 0.85) : boxType.price,
      image: "https://images.unsplash.com/photo-1601379327190-e3ef16de9845?w=600&h=700&fit=crop&auto=format",
      isSubscription: billing === "monthly",
      frequency: billing === "monthly" ? "4 weeks" : undefined,
    });
    // Redirect or show success
    window.location.href = "/?success=true";
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FAFAFA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header & Progress */}
        <div className="mb-10 text-center">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#2C3E50" }}>
            Curate Your Box
          </h1>
          <p className="text-gray-500 mt-2">Step {step} of 4</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all duration-500 ${step >= s ? 'w-10 bg-[#F8C8D1]' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Wizard Area */}
          <div className="flex-1 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[#2C3E50]/5 border border-white relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Select Box Tier</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose the base capacity for your custom box.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {tiers.map((tier) => (
                      <div 
                        key={tier.id} 
                        onClick={() => setBoxType(tier)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${boxType.id === tier.id ? 'border-[#F8C8D1] bg-[#FDF1F3]/30' : 'border-gray-100 hover:border-[#F8C8D1]/50'}`}
                      >
                        <h3 className="font-bold text-lg text-[#2C3E50]">{tier.name}</h3>
                        <div className="text-2xl font-bold mt-2">${tier.price}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Billing Preference</h2>
                    <div className="flex gap-4">
                      <button onClick={() => setBilling("monthly")} className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm ${billing === 'monthly' ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500'}`}>Subscribe & Save 15%</button>
                      <button onClick={() => setBilling("onetime")} className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm ${billing === 'onetime' ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500'}`}>One-Time Purchase</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Choose a Brand</h2>
                    <p className="text-sm text-gray-500 mt-1">Select the brand you'd like to add to your box.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.keys(brandCategories).map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => { setCategory(cat); setBrand(""); }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-[#2C3E50] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {brandCategories[category as keyof typeof brandCategories].map((b) => (
                      <button 
                        key={b} 
                        onClick={() => setBrand(b)}
                        className={`py-4 px-2 rounded-xl border-2 text-sm font-bold transition-all ${brand === b ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Product & Flow</h2>
                    <p className="text-sm text-gray-500 mt-1">What exact product do you need from {brand}?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(productTypes).map((p) => {
                      const isValidForCategory = 
                        (category === "Period Underwear" && p === "Period Underwear") ||
                        (category === "Cups/Discs" && (p === "Menstrual Cup" || p === "Disc")) ||
                        (category !== "Period Underwear" && category !== "Cups/Discs" && (p === "Pads" || p === "Pantyliners" || p === "Tampons"));
                      
                      if (!isValidForCategory) return null;

                      return (
                        <button 
                          key={p} 
                          onClick={() => setProduct(p)}
                          className={`py-4 px-2 flex flex-col items-center gap-1 rounded-xl border-2 text-sm font-bold transition-all ${product === p ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                        >
                          <span>{p}</span>
                          <span className="text-[10px] text-gray-400">${productTypes[p as keyof typeof productTypes].toFixed(2)}/ea</span>
                        </button>
                      );
                    })}
                  </div>

                  {product && (product === "Pads" || product === "Tampons") && (
                    <div className="mt-4">
                      <h3 className="text-sm font-bold text-[#2C3E50] mb-3">Select Flow Intensity</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {flows.map((f) => (
                          <button 
                            key={f} 
                            onClick={() => setFlow(f)}
                            className={`py-3 px-1 rounded-lg border-2 text-xs font-bold transition-all ${flow === f ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Quantity & Review</h2>
                    <p className="text-sm text-gray-500 mt-1">How many would you like to add?</p>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <div className="font-bold text-[#2C3E50]">{brand} {product}</div>
                      <div className="text-xs text-gray-500">{flow && `${flow} flow • `} ${currentItemPrice.toFixed(2)}/ea</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm">-</button>
                      <span className="font-bold w-4 text-center">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm">+</button>
                    </div>
                  </div>

                  {/* Add to Box Button */}
                  <button 
                    onClick={handleAddItem}
                    disabled={currentItemPrice * qty > remainingBudget}
                    className="w-full py-4 bg-[#2C3E50] text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus size={18} />
                    Add to Box (${(currentItemPrice * qty).toFixed(2)})
                  </button>
                  {currentItemPrice * qty > remainingBudget && (
                    <div className="text-xs text-red-500 flex items-center gap-1 justify-center">
                      <AlertCircle size={12} /> Exceeds available box budget
                    </div>
                  )}

                  {/* Box Items List */}
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-[#2C3E50] mb-4">Items in Box</h3>
                    {items.length === 0 ? (
                      <div className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl">Your box is empty.</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#FDF1F3] rounded-full flex items-center justify-center text-[10px] text-[#F8C8D1] font-bold">x{item.qty}</div>
                              <div>
                                <div className="text-sm font-bold text-[#2C3E50]">{item.brand} {item.product}</div>
                                {item.flow && <div className="text-[10px] text-gray-400 uppercase tracking-wider">{item.flow}</div>}
                              </div>
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
              <button 
                onClick={handlePrev} 
                disabled={step === 1}
                className="px-6 py-3 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 flex items-center gap-2 transition-all"
              >
                <ArrowLeft size={16} /> Back
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={handleNext} 
                  disabled={(step === 2 && !brand) || (step === 3 && !product) || (step === 3 && (product === "Pads" || product === "Tampons") && !flow)}
                  className="px-8 py-3 rounded-full text-sm font-bold bg-[#F8C8D1] text-[#2C3E50] hover:bg-[#FDF1F3] shadow-md shadow-[#F8C8D1]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all"
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={handleAddBoxToCart}
                  disabled={items.length === 0}
                  className="px-8 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-[#F8C8D1] to-[#F3A5B8] text-white shadow-lg shadow-[#F8C8D1]/30 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  Complete Box <Check size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sticky Live Preview */}
          <div className="w-full lg:w-[350px] lg:sticky lg:top-28 self-start">
            <div className="rounded-[2.5rem] p-8 border flex flex-col shadow-2xl text-white relative overflow-hidden" style={{ background: "linear-gradient(145deg, #2C3E50 0%, #1A2530 100%)" }}>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F8C8D1]/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
                  <PackageOpen size={14} className="text-[#F8C8D1]" />
                  Box Preview
                </div>

                <h3 className="text-2xl font-bold font-serif mb-1">{boxType.name}</h3>
                <div className="text-xs text-[#F8C8D1] uppercase tracking-wider font-bold mb-6">
                  {billing === "monthly" ? "Monthly Subscription" : "One-Time Delivery"}
                </div>

                {/* Progress Bar / Budget Tracker */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-300">Retail Value</span>
                    <span className="text-white">${currentRetailValue.toFixed(2)} / ${(boxType.budget - boxType.shipping).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-[#F8C8D1] to-[#F3A5B8] h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentRetailValue / (boxType.budget - boxType.shipping)) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 flex justify-between">
                    <span>Est. Shipping: ${boxType.shipping.toFixed(2)}</span>
                    <span className="text-[#F8C8D1]">Remaining: ${remainingBudget.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4 pt-6 border-t border-white/10">
                  <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Your Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-serif text-white">
                      ${billing === "monthly" ? Math.round(boxType.price * 0.85) : boxType.price}
                    </span>
                    {billing === "monthly" && <span className="text-xs text-[#F8C8D1] font-bold">/ mo</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
