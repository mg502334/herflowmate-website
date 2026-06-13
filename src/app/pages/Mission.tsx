import { Globe, HeartHandshake } from "lucide-react";

export function Mission() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Our Purpose & Vision
          </h1>
          <p className="mt-6 text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Every purchase powers our mission to build a more equitable world for menstruators globally.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Immediate Mission */}
          <div className="flex-1 bg-white border border-[#F8C8D1]/20 p-10 md:p-12 rounded-[40px] shadow-xl flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF1F3] flex items-center justify-center">
              <HeartHandshake className="text-[#F8C8D1]" size={28} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#2C3E50" }}>
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              We are on a mission to make period products more accessible for <strong>at-risk girls</strong> and individuals in areas where it is difficult to get reliable care. 
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Every purchase helps us move closer to <strong>donating period products directly to schools</strong>—ensuring no student has to miss class because of their cycle. We believe that access to safe hygiene should never be a barrier to education.
            </p>
          </div>

          {/* Global Vision */}
          <div className="flex-1 bg-[#FDF1F3]/40 border border-[#F8C8D1]/40 p-10 md:p-12 rounded-[40px] shadow-xl flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#F8C8D1]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm relative z-10">
              <Globe className="text-[#F8C8D1]" size={28} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#2C3E50" }} className="relative z-10">
              Global Impact Vision
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium relative z-10">
              We believe period care is a fundamental human right. We are building the foundation to become a for-profit social enterprise, and our ultimate goal is to scale our impact globally.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium relative z-10">
              We are working toward reaching native tribes and partnering with nurses' clinics across <strong>Africa, South America, and Mexico</strong>. We are building a future where your self-care directly funds sustainable, global change for the women and girls who need it most.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
