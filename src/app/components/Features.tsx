import { Leaf, Heart, Package, ShieldCheck, Recycle, Zap } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Premium Quality",
    desc: "Premium quality materials chosen for maximum comfort and reliability. Safe, clean, and gentle.",
  },
  {
    icon: Heart,
    title: "OB-GYN Designed",
    desc: "Engineered in partnership with leading OB-GYNs to fit your anatomy naturally. Zero compromises on leak protection.",
  },
  {
    icon: Recycle,
    title: "Zero-Plastic Packaging",
    desc: "Biodegradable wrapping, recycled cardboard, and zero single-use plastics. Kind to your body, gentle on the Earth.",
  },
  {
    icon: ShieldCheck,
    title: "Hypoallergenic Certified",
    desc: "Free from synthetic fragrances, chlorine bleach, toxins, or dyes. Formulated specifically for highly sensitive skin.",
  },
  {
    icon: Package,
    title: "Teen-Centric Affordability",
    desc: "Dedicated to empowering adolescents. Accessible, premium-tier kits that combat period poverty head-on.",
  },
  {
    icon: Zap,
    title: "Discreet Plain Delivery",
    desc: "Ships in plain, unbranded boxes. Fast, reliable delivery scheduled perfectly to align with your natural cycle.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#FAFAFA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <span
            className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-3.5 py-1 rounded-full"
          >
            Why HerFlowMate
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Period care that actually <em className="text-[#F8C8D1] not-italic">cares</em>
          </h2>
          <p
            className="text-xs text-gray-500 max-w-md leading-relaxed"
          >
            We started HerFlowMate to address the massive gaps in safety, transparency, and affordability for teens and young women. Here's our difference.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-7 rounded-3xl transition-all duration-300 group cursor-default bg-white border border-[#F8C8D1]/5 hover:shadow-lg hover:shadow-[#F8C8D1]/5 hover:border-[#F8C8D1]/15"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[#FDF1F3] text-[#F8C8D1] transition-transform duration-300 group-hover:scale-105"
              >
                <Icon size={22} />
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#2C3E50",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                className="text-xs text-gray-500 leading-relaxed"
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
