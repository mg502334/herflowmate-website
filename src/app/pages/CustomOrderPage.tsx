import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, PackageOpen, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { useCart } from "../components/CartContext";

const tiers = [
  { id: "basic", name: "Basic Care", price: 14, budget: 14, color: "bg-[#FDF1F3] text-[#F8C8D1]", shipping: 4 },
  { id: "comfort", name: "Comfort Plus", price: 22, budget: 22, color: "bg-[#F8C8D1] text-white", shipping: 5 },
  { id: "wellness", name: "Wellness Bundle", price: 32, budget: 32, color: "bg-[#B0C4DE] text-white", shipping: 6 },
];

const brandsCatalog = [
  {
    brand: "Always",
    category: "Conventional",
    sublines: [
      { name: "Radiant", products: ["Pads", "Pantyliners"] },
      { name: "Infinity", products: ["Pads"] },
      { name: "Teen", products: ["Pads"] },
      { name: "Ultra Thin", products: ["Pads", "Pantyliners"] },
      { name: "Maxi", products: ["Pads"] },
      { name: "Pure Cotton", products: ["Pads"] },
      { name: "ZZZ", products: ["Period Underwear"] }
    ]
  },
  {
    brand: "Tampax",
    category: "Conventional",
    sublines: [
      { name: "Pearl", products: ["Tampons"] },
      { name: "Radiant", products: ["Tampons"] },
      { name: "Pure Cotton", products: ["Tampons"] }
    ]
  },
  {
    brand: "U by Kotex",
    category: "Conventional",
    sublines: [
      { name: "CleanWear", products: ["Pads"] },
      { name: "Security", products: ["Pads", "Tampons"] },
      { name: "Click", products: ["Tampons"] },
      { name: "Balance", products: ["Pads", "Pantyliners"] }
    ]
  },
  {
    brand: "Playtex",
    category: "Conventional",
    sublines: [
      { name: "Sport", products: ["Tampons"] },
      { name: "Clean Comfort", products: ["Tampons"] },
      { name: "Simply Glide", products: ["Tampons"] }
    ]
  },
  {
    brand: "L.",
    category: "Organic/Natural",
    sublines: [
      { name: "Organic Cotton", products: ["Pads", "Pantyliners", "Tampons"] }
    ]
  },
  {
    brand: "Rael",
    category: "Organic/Natural",
    sublines: [
      { name: "Organic Cotton Cover", products: ["Pads", "Pantyliners"] },
      { name: "Organic Cotton Core", products: ["Tampons"] }
    ]
  },
  {
    brand: "Cora",
    category: "Organic/Natural",
    sublines: [
      { name: "Organic Cotton", products: ["Pads", "Tampons"] }
    ]
  },
  {
    brand: "DivaCup",
    category: "Cups/Discs",
    sublines: [
      { name: "Model 0", products: ["Menstrual Cup"] },
      { name: "Model 1", products: ["Menstrual Cup"] },
      { name: "Model 2", products: ["Menstrual Cup"] }
    ]
  },
  {
    brand: "Saalt",
    category: "Cups/Discs",
    sublines: [
      { name: "Teen Cup", products: ["Menstrual Cup"] },
      { name: "Soft Cup", products: ["Menstrual Cup"] },
      { name: "Regular Cup", products: ["Menstrual Cup"] },
      { name: "Disc", products: ["Disc"] }
    ]
  },
  {
    brand: "Flex",
    category: "Cups/Discs",
    sublines: [
      { name: "Flex Disc", products: ["Disc"] },
      { name: "Flex Cup", products: ["Menstrual Cup"] }
    ]
  },
  {
    brand: "Thinx",
    category: "Period Underwear",
    sublines: [
      { name: "Hiphugger", products: ["Period Underwear"] },
      { name: "Boyshort", products: ["Period Underwear"] },
      { name: "Brief", products: ["Period Underwear"] }
    ]
  },
  {
    brand: "Knix",
    category: "Period Underwear",
    sublines: [
      { name: "Bikini", products: ["Period Underwear"] },
      { name: "Thong", products: ["Period Underwear"] },
      { name: "Boyshort", products: ["Period Underwear"] }
    ]
  }
];

const categoriesList = ["Conventional", "Organic/Natural", "Period Underwear", "Cups/Discs"];

const productTypes = {
  "Pads": 0.35,
  "Pantyliners": 0.20,
  "Tampons": 0.35,
  "Period Underwear": 25.00,
  "Menstrual Cup": 35.00,
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
  const [subline, setSubline] = useState("");
  const [product, setProduct] = useState("");
  const [flowQuantities, setFlowQuantities] = useState<Record<string, number>>({});

  // Box Contents
  const [items, setItems] = useState<any[]>([]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5)); // Increased to 5 steps
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const currentRetailValue = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const remainingBudget = boxType.budget - boxType.shipping - currentRetailValue;
  const currentItemPrice = productTypes[product as keyof typeof productTypes] || 0;
  
  // Calculate total cost for the quantities currently selected in Step 4
  const totalSelectedQty = Object.values(flowQuantities).reduce((a, b) => a + b, 0);
  const pendingCost = totalSelectedQty * currentItemPrice;

  const handleAddItem = () => {
    if (!brand || !product || totalSelectedQty === 0) return;
    if (pendingCost > remainingBudget) {
      alert("This exceeds your box's remaining budget!");
      return;
    }

    const newItems = [];
    const isFlowBased = product === "Pads" || product === "Tampons";

    if (isFlowBased) {
      // Add each flow as a separate line item
      for (const [f, qty] of Object.entries(flowQuantities)) {
        if (qty > 0) {
          newItems.push({ id: Date.now() + Math.random(), category, brand, subline, product, flow: f, qty, price: currentItemPrice });
        }
      }
    } else {
      // Non-flow based (Underwear, Cups)
      const qty = flowQuantities["Standard"] || 0;
      if (qty > 0) {
        newItems.push({ id: Date.now() + Math.random(), category, brand, subline, product, flow: "", qty, price: currentItemPrice });
      }
    }

    setItems([...items, ...newItems]);

    // Reset selection for next item
    setBrand("");
    setSubline("");
    setProduct("");
    setFlowQuantities({});
    setStep(5); // Go straight to review to see the added item
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleAddBoxToCart = () => {
    const totalItemsInBox = items.reduce((sum, item) => sum + item.qty, 0);

    addToCart({
      id: `custom-${boxType.id}-${Date.now()}`,
      name: `Custom ${boxType.name}`,
      variant: `${totalItemsInBox} items included`,
      price: billing === "monthly" ? Math.round(boxType.price * 0.85) : boxType.price,
      image: "https://images.unsplash.com/photo-1601379327190-e3ef16de9845?w=600&h=700&fit=crop&auto=format",
      isSubscription: billing === "monthly",
      frequency: billing === "monthly" ? "4 weeks" : undefined,
      shippingCost: boxType.shipping,
    });
    // AddToCart automatically opens the cart drawer, so we don't need to do anything else here.
  };

  const currentBrandData = brandsCatalog.find(b => b.brand === brand);
  const currentSublineData = currentBrandData?.sublines.find(s => s.name === subline);
  
  const updateQuantity = (f: string, delta: number) => {
    setFlowQuantities(prev => {
      const current = prev[f] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [f]: next };
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FAFAFA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header & Progress */}
        <div className="mb-10 text-center">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#2C3E50" }}>
            Curate Your Box
          </h1>
          <p className="text-gray-500 mt-2">Step {step} of 5</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
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
                    {categoriesList.map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => { setCategory(cat); setBrand(""); setSubline(""); setProduct(""); }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-[#2C3E50] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {brandsCatalog.filter(b => b.category === category).map((b) => (
                      <button 
                        key={b.brand} 
                        onClick={() => { setBrand(b.brand); setSubline(""); setProduct(""); }}
                        className={`py-4 px-2 rounded-xl border-2 text-sm font-bold transition-all ${brand === b.brand ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                      >
                        {b.brand}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Subline & Product Type</h2>
                    <p className="text-sm text-gray-500 mt-1">Which exact product do you need from {brand}?</p>
                  </div>

                  {currentBrandData && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-[#2C3E50] mb-3">1. Select Subline / Model</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {currentBrandData.sublines.map((sub) => (
                            <button 
                              key={sub.name} 
                              onClick={() => { setSubline(sub.name); setProduct(""); }}
                              className={`py-4 px-2 rounded-xl border-2 text-sm font-bold transition-all ${subline === sub.name ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {subline && currentSublineData && (
                        <div>
                          <h3 className="text-sm font-bold text-[#2C3E50] mb-3">2. Select Product Form</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {currentSublineData.products.map((p) => (
                              <button 
                                key={p} 
                                onClick={() => setProduct(p)}
                                className={`py-4 px-2 flex flex-col items-center gap-1 rounded-xl border-2 text-sm font-bold transition-all ${product === p ? 'border-[#F8C8D1] bg-[#FDF1F3] text-[#2C3E50]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                              >
                                <span>{p}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Quantities & Flow</h2>
                    <p className="text-sm text-gray-500 mt-1">Specify how many of each flow you want to add to your box.</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                    <div className="font-bold text-[#2C3E50] text-lg mb-4">{brand} {subline} {product}</div>
                    
                    <div className="flex flex-col gap-4">
                      {product === "Pads" || product === "Tampons" ? (
                        flows.map((f) => {
                          const qty = flowQuantities[f] || 0;
                          return (
                            <div key={f} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                              <span className="font-bold text-[#2C3E50] text-sm">{f}</span>
                              <div className="flex items-center gap-4">
                                <button onClick={() => updateQuantity(f, -1)} className="w-8 h-8 rounded-full bg-gray-50 border flex items-center justify-center hover:bg-gray-100 transition-colors">-</button>
                                <span className="font-bold w-4 text-center">{qty}</span>
                                <button onClick={() => updateQuantity(f, 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">+</button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <span className="font-bold text-[#2C3E50] text-sm">Quantity</span>
                          <div className="flex items-center gap-4">
                            <button onClick={() => updateQuantity("Standard", -1)} className="w-8 h-8 rounded-full bg-gray-50 border flex items-center justify-center hover:bg-gray-100 transition-colors">-</button>
                            <span className="font-bold w-4 text-center">{flowQuantities["Standard"] || 0}</span>
                            <button onClick={() => updateQuantity("Standard", 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add to Box Button */}
                  <button 
                    onClick={handleAddItem}
                    disabled={totalSelectedQty === 0 || pendingCost > remainingBudget}
                    className="w-full py-4 bg-[#2C3E50] text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    <Plus size={18} />
                    Add to Box
                  </button>
                  {pendingCost > remainingBudget && (
                    <div className="text-xs text-red-500 flex items-center gap-1 justify-center">
                      <AlertCircle size={12} /> Exceeds available box capacity
                    </div>
                  )}

                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-[#2C3E50]">Review Your Box</h2>
                    <p className="text-sm text-gray-500 mt-1">Review your selections or click back to add more brands to your box.</p>
                  </div>

                  {/* Box Items List */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    {items.length === 0 ? (
                      <div className="text-sm text-gray-400 italic text-center py-8">Your box is empty.</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#FDF1F3] rounded-full flex items-center justify-center text-[10px] text-[#F8C8D1] font-bold">x{item.qty}</div>
                              <div>
                                <div className="text-sm font-bold text-[#2C3E50]">{item.brand} {item.subline} {item.product}</div>
                                {item.flow && <div className="text-[10px] text-gray-400 uppercase tracking-wider">{item.flow} Flow</div>}
                              </div>
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-4 mt-4 bg-white border-2 border-gray-200 text-[#2C3E50] rounded-xl font-bold flex items-center justify-center gap-2 hover:border-[#F8C8D1] transition-all"
                  >
                    <Plus size={18} />
                    Add More Items to Box
                  </button>
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
              
              <div className="flex gap-4">
                {items.length > 0 && step < 5 && (
                  <button 
                    onClick={() => setStep(5)}
                    className="px-6 py-3 rounded-full text-sm font-bold text-[#2C3E50] bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    Review Box
                  </button>
                )}
                {step < 5 ? (
                  <button 
                    onClick={handleNext} 
                    disabled={(step === 2 && !brand) || (step === 3 && !product)}
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
                    <span className="text-gray-300">Box Capacity</span>
                    <span className="text-white">{Math.min(100, Math.round(((currentRetailValue + pendingCost) / (boxType.budget - boxType.shipping)) * 100))}% Full</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-[#F8C8D1] to-[#F3A5B8] h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentRetailValue + pendingCost) / (boxType.budget - boxType.shipping)) * 100}%` }}
                    />
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
