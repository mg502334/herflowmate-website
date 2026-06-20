import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function EducationTeaser() {
  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-xl border border-[#957DAD]/20 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          
          {/* Decorative background circle */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F0E6FA] rounded-full blur-3xl opacity-50 pointer-events-none" />

          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 relative z-10">
            <span className="text-[10px] font-bold text-[#957DAD] uppercase tracking-widest bg-[#F0E6FA] px-3.5 py-1 rounded-full flex items-center gap-2 w-fit">
              <BookOpen size={12} />
              Knowledge is Power
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
              Your Body, Decoded.
            </h2>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
              We believe that understanding your body shouldn't require a medical degree. 
              Explore our beautifully curated guides to the amazing processes happening within you, 
              from the menstrual cycle to menopause.
            </p>

            <Link 
              to="/learn"
              className="mt-4 flex items-center gap-2 w-fit px-8 py-3.5 bg-[#957DAD] text-white rounded-full font-bold shadow-md shadow-[#957DAD]/20 hover:bg-[#7D649A] hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Learning
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 relative z-10">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-lg border border-gray-100">
              <img 
                src="/hormonal_changes_education.png" 
                alt="Hormonal changes illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
