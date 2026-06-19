import { ArrowRight, Sparkles, Package } from "lucide-react";
import heroImg from "../../assets/menstrual_cup_hero.png";
import { useCart } from "./CartContext";
import { Link } from "react-router";

export function Hero() {
  const { setQuizOpen } = useCart();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAFA] pt-24 pb-16">
      {/* Background soft lavender and pink organic gradient aura */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 30%, #FDF1F3 0%, transparent 55%), radial-gradient(circle at 10% 70%, #FFFFFF 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10 w-full">
        {/* Left: Text & CTAs */}
        <div className="flex flex-col gap-6.5 text-left">
          {/* Pill Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full w-fit text-xs font-bold uppercase tracking-wider bg-[#FDF1F3] text-[#2C3E50]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Redefining Wellness
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
            }}
          >
            Embrace Your Flow <br />
            With Confidence.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.1rem",
              color: "#2C3E50",
              lineHeight: 1.65,
              maxWidth: "42ch",
            }}
          >
            Premium feminine care that puts your comfort and body first. Experience the new standard in wellness.
          </p>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-3.5 mt-2 flex-wrap">
            <Link
              to="/custom-order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#F8C8D1] to-[#F3A5B8] hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#F8C8D1]/20 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Package size={16} />
              Custom Order
            </Link>
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold bg-white text-[#2C3E50] hover:bg-[#FAFAFA] transition-all duration-200 border border-[#2C3E50]/15 shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Products
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold bg-white text-[#2C3E50] hover:bg-[#FAFAFA] transition-all duration-200 border border-[#2C3E50]/15 shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              onClick={() => setQuizOpen(true)}
            >
              <Sparkles size={14} />
              Find Your Fit
            </button>
          </div>

          {/* Statistics Grid */}
          <div className="flex items-center gap-8 mt-6 pt-6 border-t border-[#F8C8D1]/10">
            {[
              { val: "100%", label: "Leak-Free Design" },
              { val: "100%", label: "High-Quality Materials" },
              { val: "0%", label: "Harsh Chemicals" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontWeight: 700, color: "#2C3E50" }}>{val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#2C3E50", fontWeight: 500 }} className="mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Graphic Card Mockup */}
        <div className="relative flex justify-center md:justify-end">
          <div
            className="absolute -inset-6 rounded-3xl opacity-50 pointer-events-none"
            style={{ background: "radial-gradient(circle at center, rgba(108, 93, 211, 0.12) 0%, transparent 70%)" }}
          />
          <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] w-full max-w-[480px] shadow-2xl border-4 border-white/80 bg-white">
            <img
              src={heroImg}
              alt="Premium Diva Cup Menstrual Care"
              className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(28,21,48,0.08) 0%, transparent 40%)" }} />
          </div>

          {/* Floating Certificate Badge */}
          <div
            className="absolute -left-6 bottom-10 p-4.5 rounded-2xl shadow-xl bg-white border border-[#F8C8D1]/10 flex flex-col gap-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              OB-GYN APPROVED
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C3E50" }}>
              100% Medical Grade
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
