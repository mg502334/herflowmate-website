import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Can I use my FSA or HSA to pay?",
    a: "Yes! Menstrual care products are eligible expenses. You can use your Flexible Spending Account (FSA) or Health Savings Account (HSA) card directly at checkout, or submit your receipt for reimbursement.",
  },
  {
    q: "Are your products high quality?",
    a: "Yes — we carefully source premium materials designed for maximum comfort, reliability, and safety from trusted manufacturers.",
  },
  {
    q: "How does the subscription work?",
    a: "You choose your products, quantities, and delivery frequency (every 4, 6, or 8 weeks). You can adjust, pause, or cancel at any time from your account — no fees, no questions asked.",
  },
  {
    q: "Which menstrual cup size should I choose?",
    a: "Size A is recommended if you've never given birth vaginally. Size B is recommended if you have, or if you have a heavier flow. If you're unsure, our 3-step Care Quiz takes 1 minute to recommend the perfect fit.",
  },
  {
    q: "How long does delivery take?",
    a: "North American and UK orders arrive within 2–3 working days. International shipping is available to the EU and selected countries, typically 5–8 working days. All orders ship in completely plain, discreet packaging.",
  },
  {
    q: "Are your products suitable for sensitive skin?",
    a: "Absolutely. We formulate without fragrances, dyes, chlorine bleach, or synthetic additives. Our products are dermatologically tested and hypoallergenic.",
  },
  {
    q: "What's your returns policy?",
    a: "If you're not happy, we'll make it right — full refund within 30 days. Hygiene products can't be returned once opened for safety, but we'll always find a fair solution for you.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#FAFAFA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-14 gap-4">
          <span
            className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-3.5 py-1 rounded-full"
          >
            FAQ
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
            Common questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300 bg-white"
              style={{
                border: `1px solid ${open === i ? "rgba(108, 93, 211, 0.3)" : "rgba(108, 93, 211, 0.08)"}`,
                boxShadow: open === i ? "0 4px 20px rgba(108, 93, 211, 0.03)" : "none"
              }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#2C3E50",
                  }}
                >
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ml-4 transition-all duration-200"
                  style={{ background: open === i ? "#F8C8D1" : "#FDF1F3" }}
                >
                  {open === i ? (
                    <Minus size={13} color="#ffffff" />
                  ) : (
                    <Plus size={13} color="#F8C8D1" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 animate-[fadeIn_0.2s_ease-out]">
                  <p
                    className="text-xs text-gray-500 leading-relaxed"
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
