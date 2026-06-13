import { useEffect, useState } from "react";
import { Gift, Sparkles, Check } from "lucide-react";
import { useCart } from "./CartContext";

export function PromoBag() {
  const { claimedFreeBag, claimFreeBag } = useCart();
  const [claimsCount, setClaimsCount] = useState(42);

  // Persistent simulated claims ticker
  useEffect(() => {
    const savedClaims = localStorage.getItem("herflowmate_claims_count");
    if (savedClaims) {
      setClaimsCount(Number(savedClaims));
    } else {
      localStorage.setItem("herflowmate_claims_count", "42");
    }

    // Occasional simulated increase to drive urgency
    const timer = setInterval(() => {
      setClaimsCount((prev) => {
        if (prev >= 49) return prev; // Hold at 49 so there's always 1 left!
        const next = prev + 1;
        localStorage.setItem("herflowmate_claims_count", String(next));
        return next;
      });
    }, 45000); // every 45s

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      {/* Background radial accent glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(108, 93, 211, 0.12) 0%, transparent 60%)" }} />

      <div className="max-w-4xl mx-auto px-6">
        <div
          className="relative rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border transition-all duration-300"
          style={{
            borderColor: "rgba(108, 93, 211, 0.15)",
            background: "linear-gradient(to right, #FAFAFA, #ffffff)",
            boxShadow: "0 8px 30px rgba(108, 93, 211, 0.04)"
          }}
        >
          {/* Sparkle effects */}
          <div className="absolute top-4 right-4 text-[#B0C4DE] animate-pulse">
            <Sparkles size={16} />
          </div>

          {/* Left: Gift Graphic */}
          <div className="w-20 h-20 rounded-2xl bg-[#FDF1F3] flex items-center justify-center text-[#F8C8D1] flex-shrink-0 shadow-inner">
            <Gift size={36} className="animate-bounce" />
          </div>

          {/* Middle: Text Details */}
          <div className="flex-1 flex flex-col gap-2.5 text-center md:text-left w-full">
            <div className="inline-flex items-center justify-center md:justify-start gap-1 text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest">
              <span>🎁 Special Launch Benefit</span>
            </div>
            
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#2C3E50"
              }}
            >
              First 50 Orders: Free Discreet Brand Bag
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
              Embrace convenience wherever you go. The first 50 customers to order receive our custom‑made, reusable cloth brand bag entirely for free (worth $15) containing all their products. Fits discreetly in any handbag!
            </p>

            {/* Claims Progress Bar */}
            <div className="mt-2 flex flex-col gap-1.5 max-w-sm">
              <div className="flex justify-between text-[11px] font-bold text-gray-600">
                <span>Claims Progress</span>
                <span className="text-[#F8C8D1]">{claimsCount} / 50 bags claimed</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-right from-[#B0C4DE] to-[#F8C8D1] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(claimsCount / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0 w-full md:w-auto">
            {claimedFreeBag ? (
              <div className="flex items-center justify-center gap-1.5 px-7 py-3.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold shadow-sm cursor-default">
                <Check size={14} />
                Bag Claimed!
              </div>
            ) : (
              <button
                onClick={claimFreeBag}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold text-white bg-[#F8C8D1] hover:bg-[#5949c1] transition-all duration-200 shadow-md shadow-[#F8C8D1]/15 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Claim Free Gift Bag
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
