import { Products } from "../components/Products";

export function Shop() {
  return (
    <main className="pt-24 pb-12 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12 gap-4">
          <span className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-3.5 py-1 rounded-full">
            Shop All
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
            }}
          >
            Essentials Collection
          </h1>
          <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
            Discover our full range of carefully curated products designed to make your cycle more comfortable, sustainable, and empowering.
          </p>
        </div>
      </div>

      <Products />
    </main>
  );
}
