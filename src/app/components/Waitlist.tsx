import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useCart } from "./CartContext";
import confetti from "canvas-confetti";

export function Waitlist() {
  const { waitlistEmail, submitWaitlist } = useCart();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || email.length < 5) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to join waitlist. Please try again.");
      }
      
      submitWaitlist(email);
      
      // Trigger gorgeous confetti explosion!
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#F8C8D1", "#B0C4DE", "#FAFAFA", "#FFFFFF"]
      });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 relative overflow-hidden bg-[#F8C8D1]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 20%, #B0C4DE 0%, transparent 60%), radial-gradient(circle at 20% 80%, #FFFFFF 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <span
          className="text-[10px] font-bold uppercase tracking-widest text-[#F8C8D1] bg-white px-3.5 py-1 rounded-full shadow-sm"
        >
          Early Access
        </span>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#2C3E50",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          Be first to know when we launch
        </h2>

        <p
          className="text-xs leading-relaxed max-w-md text-[#2C3E50]/80 font-medium"
        >
          Join our waitlist for exclusive early access to our OB-GYN tested premium care range.
        </p>

        {waitlistEmail ? (
          <div
            className="flex flex-col items-center gap-3 p-8 rounded-3xl w-full max-w-md bg-white border border-[#2C3E50]/10 shadow-xl animate-[fadeIn_0.5s_ease-out]"
          >
            <CheckCircle size={44} color="#2C3E50" className="animate-pulse" />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "#2C3E50" }}>
              You're on the list!
            </div>
            <p className="text-xs text-[#2C3E50]/80 leading-relaxed max-w-[28ch] mx-auto font-medium">
              We've saved your spot. We'll send launch updates to <strong>{waitlistEmail}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-3">
            <div className="flex gap-2.5 p-1 bg-white rounded-full shadow-lg border border-[#2C3E50]/10 focus-within:border-[#F8C8D1] transition-all duration-300">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full outline-none text-[#2C3E50] placeholder-gray-400 bg-transparent text-sm font-medium"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full whitespace-nowrap transition-all duration-200 bg-[#2C3E50] text-white hover:bg-[#1a2632] font-bold text-xs shadow-md uppercase tracking-widest cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Joining..." : "Join"}
                {!isSubmitting && <ArrowRight size={14} />}
              </button>
            </div>
            {error && (
              <p className="text-xs font-semibold text-red-500 mt-1">
                ⚠️ {error}
              </p>
            )}
            <p className="text-[10px] text-[#2C3E50]/60 font-medium">
              No spam, ever. Unsubscribe any time.
            </p>
          </form>
        )}


      </div>
    </section>
  );
}
