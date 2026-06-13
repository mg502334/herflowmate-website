import { Heart } from "lucide-react";

export function AboutUs() {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-8">
          
          <span className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-3.5 py-1 rounded-full flex items-center gap-2">
            <Heart fill="#F8C8D1" color="#F8C8D1" size={12} />
            Women Led & Operated
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Created by women, for women.
          </h2>

          <p className="text-base text-gray-600 leading-relaxed font-medium max-w-2xl">
            HerFlowMate is proudly <strong>women-led and operated</strong>. We understand the physical and emotional nuances of the menstrual cycle because we experience them ourselves. We started this company to bring premium, reliable, and OB-GYN tested care to everyone. But our vision goes beyond just providing beautiful essentials.
          </p>

          {/* Mission & Vision Box */}
          <div className="mt-6 flex flex-col md:flex-row gap-6 text-left">
            <div className="flex-1 bg-[#FAFAFA] border border-[#F8C8D1]/20 p-8 rounded-3xl flex flex-col gap-4 shadow-sm">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#2C3E50" }}>
                Our Mission
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                We are on a mission to make period products more accessible for <strong>at-risk girls</strong> and individuals in areas where it is difficult to get reliable care. Every purchase helps us move closer to <strong>donating period products directly to schools</strong>—ensuring no student has to miss class because of their cycle.
              </p>
            </div>

            <div className="flex-1 bg-[#FDF1F3]/50 border border-[#F8C8D1]/30 p-8 rounded-3xl flex flex-col gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#F8C8D1]/20 rounded-full blur-2xl pointer-events-none" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#2C3E50" }}>
                Global Impact Vision
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium relative z-10">
                We believe period care is a fundamental human right. We are building the foundation to become a for-profit social enterprise, and our ultimate goal is to scale our impact globally—reaching native tribes and partnering with nurses' clinics across <strong>Africa, South America, and Mexico</strong>. We are building a future where your self-care directly funds sustainable, global change for the women and girls who need it most.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
