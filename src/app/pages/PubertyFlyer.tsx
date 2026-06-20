import { Heart, Printer, CheckCircle2 } from "lucide-react";
import logoWhite from "../../assets/herflowmate-logo-white.png";
import { useEffect } from "react";

export function PubertyFlyer() {
  useEffect(() => {
    // Scroll to top automatically
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white print:bg-white text-[#2C3E50] p-6 md:p-12 print:p-0">
      
      {/* Web Only Controls */}
      <div className="print:hidden max-w-4xl mx-auto flex justify-between items-center mb-8 pb-4 border-b border-gray-100 mt-28">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-[#2C3E50] font-medium transition-colors"
        >
          &larr; Back to Education
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#2C3E50] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-[#1A252F] transition-all"
        >
          <Printer size={18} />
          Print Flyer
        </button>
      </div>

      {/* Printable Flyer Container */}
      <div className="max-w-[800px] mx-auto bg-white print:max-w-none print:w-full print:h-full print:m-0 print:border-none relative border border-gray-100 shadow-xl print:shadow-none rounded-[40px] print:rounded-none overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-[#FFF9C4] w-full py-4 text-center border-b border-[#FFD54F]/30">
          <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center justify-center gap-2">
            <Heart size={14} fill="#D4AF37" color="#D4AF37" />
            Your Body Is Amazing
            <Heart size={14} fill="#D4AF37" color="#D4AF37" />
          </span>
        </div>

        <div className="p-10 sm:p-12 print:p-10 flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row print:flex-row items-center gap-8 border-b border-gray-100 pb-10">
            <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 rounded-full overflow-hidden border-4 border-[#FFF9C4] shadow-sm">
              <img 
                src="/puberty_education.png" 
                alt="Puberty Illustration" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", lineHeight: 1.1 }} 
                className="font-bold text-[#2C3E50] mb-3"
              >
                Welcome to <br/> The Next Chapter
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Puberty is the beautiful, natural transition from childhood to adulthood. 
                Your body is growing, changing, and preparing to do amazing things. It's completely 
                normal to feel excited, confused, or even a little nervous!
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="grid sm:grid-cols-2 print:grid-cols-2 gap-10">
            
            {/* What to Expect */}
            <div className="flex flex-col gap-5">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold border-b-2 border-[#FFD54F] w-fit pb-1">
                What to Expect
              </h2>
              <ul className="flex flex-col gap-4 text-gray-700 font-medium">
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-2 h-2 rounded-full bg-[#FFD54F]"></div>
                  <p><strong>Growth Spurts:</strong> You'll likely grow taller and your body shape will change naturally.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-2 h-2 rounded-full bg-[#FFD54F]"></div>
                  <p><strong>Skin & Hair:</strong> You might notice oilier skin, occasional breakouts, and new hair growth.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-2 h-2 rounded-full bg-[#FFD54F]"></div>
                  <p><strong>Mood Swings:</strong> New hormones can make your emotions feel bigger than usual. Be kind to yourself!</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-2 h-2 rounded-full bg-[#FFD54F]"></div>
                  <p><strong>Your First Period:</strong> Your body will start a natural monthly cycle called menstruation.</p>
                </li>
              </ul>
            </div>

            {/* Your Toolkit */}
            <div className="bg-[#FAFAFA] rounded-[32px] p-8 border border-gray-100">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-5 text-[#2C3E50]">
                Your Starter Toolkit
              </h2>
              <ul className="flex flex-col gap-3">
                {[
                  "Light panty liners for spotting",
                  "A comfortable starter sports bra",
                  "Gentle facial cleanser",
                  "A tracking app or journal",
                  "A trusted adult to talk to!"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 size={20} className="text-[#81C784]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

        </div>

        {/* Footer Brand */}
        <div className="bg-[#2C3E50] w-full p-8 mt-4 flex items-center justify-between text-white print:absolute print:bottom-0">
          <div className="flex flex-col gap-2">
            <div className="relative w-32 h-8 -ml-4">
              <img 
                src={logoWhite} 
                alt="HerFlowMate" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[140px] max-w-none object-contain pointer-events-none" 
              />
            </div>
            <span className="text-xs text-white/70">Created by women, for women.</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold">herflowmate.com</span>
            <br/>
            <span className="text-xs text-white/50">Free Educational Resource</span>
          </div>
        </div>

      </div>
      
    </main>
  );
}
