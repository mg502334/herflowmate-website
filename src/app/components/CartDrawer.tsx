import { X, Plus, Minus, Trash2, ShieldCheck, HelpCircle } from "lucide-react";
import { useCart } from "./CartContext";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useState } from "react";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    claimedFreeBag,
    claimFreeBag,
    unclaimFreeBag,
    clearCart,
  } = useCart();
  const { user } = useCustomerAuth();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "submitting" | "success">("cart");

  if (!cartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subscriptionDiscount = cart.some((i) => i.isSubscription) ? Math.round(subtotal * 0.15) : 0;
  const calculateShipping = () => {
    if (subtotal === 0) return 0;
    
    let totalShipping = 0;
    const customBoxes = cart.filter(item => item.shippingCost !== undefined && item.id !== "free-bag");
    const regularItems = cart.filter(item => item.shippingCost === undefined && item.id !== "free-bag");

    // Add specific shipping costs for boxes (e.g., $4 per Basic Box)
    customBoxes.forEach(box => {
      totalShipping += (box.shippingCost! * box.quantity);
    });

    // If they have regular items but no boxes, charge flat $5.99
    // If they DO have boxes, the regular items ship inside the box for free!
    if (regularItems.length > 0 && customBoxes.length === 0) {
      totalShipping += 5.99;
    }

    return totalShipping;
  };

  const shipping = calculateShipping();
  const total = subtotal - subscriptionDiscount + shipping;

  const handleCheckout = async () => {
    setCheckoutStep("submitting");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          total,
          userId: user?.id,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process checkout");
      }
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout session returned.");
      }
    } catch (err) {
      console.error(err);
      alert("There was an issue processing your request. Please try again.");
      setCheckoutStep("cart");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2C3E50]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className="relative w-full max-w-md bg-[#FAFAFA] h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 border-l border-[#F8C8D1]/10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#F8C8D1]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem", color: "#F8C8D1" }}>
              Your Flow Box
            </span>
            <span className="bg-[#FDF1F3] text-[#F8C8D1] text-xs font-semibold px-2 py-0.5 rounded-full">
              {cart.filter((item) => item.id !== "free-bag").reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

          <>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-[#FDF1F3] flex items-center justify-center text-[#F8C8D1]/60 mb-2">
                    🛒
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#2C3E50" }}>
                    Your box is empty
                  </h3>
                  <p className="text-xs text-gray-500 max-w-[25ch]">
                    Add premium essentials or customize a subscription box to get started.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2 px-6 py-2 border border-[#F8C8D1]/30 hover:border-[#F8C8D1] text-[#F8C8D1] rounded-full text-xs font-semibold transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F8C8D1]/5 hover:border-[#F8C8D1]/15 transition-all shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#FDF1F3] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600, color: "#2C3E50" }}>
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-medium">
                              {item.variant}
                            </span>
                            {item.isSubscription && (
                              <span className="text-[10px] bg-[#FDF1F3] text-[#F8C8D1] px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-[#F8C8D1]" />
                                Subs ({item.frequency})
                              </span>
                            )}
                          </div>
                        </div>

                        {item.id !== "free-bag" && (
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {item.id === "free-bag" ? (
                          <span className="text-xs font-semibold text-green-600">FREE GIFT</span>
                        ) : (
                          <div className="flex items-center gap-2.5 border border-[#F8C8D1]/10 bg-[#FAFAFA] rounded-full px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.variant, -1)}
                              className="text-gray-500 hover:text-[#F8C8D1] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold min-w-[12px] text-center text-[#2C3E50]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variant, 1)}
                              className="text-gray-500 hover:text-[#F8C8D1] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )}
                        <span className="text-sm font-bold text-[#2C3E50]">
                          {item.price === 0 ? "$0.00" : `$${(item.price * item.quantity).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#F8C8D1]/10 flex flex-col gap-4">
                <div className="flex flex-col gap-2.5 text-xs font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-sm font-bold text-[#2C3E50]">${subtotal.toFixed(2)}</span>
                  </div>

                  {subscriptionDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        Subscription Discount (15% Off)
                      </span>
                      <span className="text-sm font-bold">-${subscriptionDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-sm font-bold text-[#2C3E50]">
                      {shipping === 0 ? "TBD" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline mt-1">
                    <span className="text-sm font-bold text-[#2C3E50]">Total</span>
                    <span className="text-xl font-extrabold text-[#F8C8D1]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutStep === "submitting"}
                  className="w-full py-4 bg-[#F8C8D1] hover:bg-[#5949c1] text-white rounded-full font-bold transition-all shadow-lg shadow-[#F8C8D1]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {checkoutStep === "submitting" ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block mr-2" />
                      Processing Securely...
                    </>
                  ) : (
                    "Secure Checkout"
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                  🔒 Secured 256-bit encryption. Cancel subscription anytime.
                </p>
                <p className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <span className="font-bold bg-[#FDF1F3] text-[#F8C8D1] px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider">FSA / HSA</span> Eligible
                </p>
              </div>
            )}
          </>
      </div>
    </div>
  );
}
