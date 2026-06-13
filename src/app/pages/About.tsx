import { Heart } from "lucide-react";

export function About() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-8 bg-white p-12 md:p-20 rounded-[40px] shadow-xl border border-[#F8C8D1]/20">
          
          <span className="text-xs font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-4 py-1.5 rounded-full flex items-center gap-2">
            <Heart fill="#F8C8D1" color="#F8C8D1" size={14} />
            Women Led & Operated
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Created by women, for women.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mt-4">
            HerFlowMate is proudly <strong>women-led and operated</strong>. We understand the physical and emotional nuances of the menstrual cycle because we experience them ourselves.
          </p>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl">
            We started this company to bring premium, reliable, and OB-GYN tested care to everyone. Our vision goes beyond just providing beautiful essentials; we want to redefine how society talks about and cares for menstrual health.
          </p>

          <div className="mt-8 w-full h-[300px] md:h-[400px] bg-[#FDF1F3] rounded-3xl border-2 border-dashed border-[#F8C8D1] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
               <Heart fill="#F8C8D1" color="#F8C8D1" size={24} />
            </div>
            <p className="text-[#2C3E50] font-medium" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>
              Meet the Fam Gang (Coming Soon)
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
