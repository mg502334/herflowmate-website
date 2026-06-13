const reviews = [
  {
    name: "Sophie Adeyemi",
    location: "London, UK",
    rating: 5,
    text: "I've tried every premium brand out there and HerFlowMate is genuinely different. The pads don't shift, the packaging is beautiful, and I finally feel good about what I'm putting on my body.",
    avatar: "SA",
  },
  {
    name: "Mia Johansson",
    location: "Stockholm, Sweden",
    rating: 5,
    text: "Switched to the menstrual cup 6 months ago and I can't believe I waited this long. The size guide was spot-on and the silicone is so soft. Zero leaks.",
    avatar: "MJ",
  },
  {
    name: "Priya Sharma",
    location: "Manchester, UK",
    rating: 5,
    text: "The subscription model is brilliant. I set it and forget it — the right products arrive a week before I need them. Customer support is also incredibly kind.",
    avatar: "PS",
  },
  {
    name: "Layla Hassan",
    location: "Dubai, UAE",
    rating: 5,
    text: "As someone with sensitive skin, finding products without fragrances and chemicals is so hard. HerFlowMate is the first brand that hasn't caused me any irritation.",
    avatar: "LH",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-[#2C3E50]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-[#B0C4DE] bg-white/5 px-3.5 py-1 rounded-full"
          >
            Real Reviews
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#FAFAFA",
              letterSpacing: "-0.01em",
            }}
          >
            Loved by thousands
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-7 rounded-3xl flex flex-col gap-4 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(108, 93, 211, 0.15)" }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-[#B0C4DE] text-sm">★</span>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(250,247,244,0.8)",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                  fontStyle: "italic",
                }}
              >
                "{r.text}"
              </p>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono"
                  style={{ background: "#F8C8D1", color: "#FAFAFA" }}
                >
                  {r.avatar}
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 650, color: "#FAFAFA" }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(250,247,244,0.5)" }}>
                    {r.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
