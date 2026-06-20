import { Heart, Printer, CheckCircle2, Sparkles } from "lucide-react";
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
            
            {/* Handling Cramps */}
            <div className="col-span-1 sm:col-span-2 mt-2 bg-[#FDF1F3] rounded-[32px] p-8 border border-[#F8C8D1]/30">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4 text-[#2C3E50]">
                Navigating Cramps & Discomfort
              </h2>
              <p className="text-gray-700 font-medium mb-5">
                When you get your period, it's very common to experience lower belly or back pain, known as cramps. This happens because your body is working to shed the uterine lining. While normal, you don't have to just "tough it out." Here are some proven ways to find relief:
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
                  <span className="font-bold text-[#F06292] flex items-center gap-2">🔥 Use Heat</span>
                  <p className="text-sm text-gray-600">A warm heating pad or hot water bottle helps relax the muscles instantly. <strong>Caution:</strong> Never apply direct heat to bare skin and never fall asleep with an electric heating pad turned on!</p>
                </div>
                <div className="flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
                  <span className="font-bold text-[#F06292] flex items-center gap-2">🛌 Rest & Comfort</span>
                  <p className="text-sm text-gray-600">Listen to your body! Sometimes the absolute best thing you can do is curl up, get comfortable, and sleep through the worst of the pain.</p>
                </div>
                <div className="flex flex-col gap-2 bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
                  <span className="font-bold text-[#F06292] flex items-center gap-2">💊 OTC Relief</span>
                  <p className="text-sm text-gray-600">Over-the-counter pain relievers like Ibuprofen or Midol are highly effective at stopping cramps. Always ask a trusted adult for the right dose first!</p>
                </div>
              </div>
            </div>

            {/* Flow Guide Section */}
            <div className="col-span-1 sm:col-span-2 mt-4 flex flex-col gap-8 pt-8 border-t border-gray-100">
              <div className="text-center">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-[#2C3E50]">
                  Product & Flow Guide
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto font-medium">
                  Understanding what products to use and when can take the guesswork out of your period.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-10">
                {/* Absorbency */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-bold text-[#2C3E50] border-b-2 border-[#E0BBE4] w-fit pb-1">
                    Understanding "Drops"
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="flex text-blue-300 shrink-0 mt-1 tracking-widest text-sm">💧<span className="opacity-20 grayscale">💧💧</span></div>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Light (1 Drop)</span>
                        <p className="text-sm text-gray-600">Best for spotting or the very beginning/end of your period.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="flex text-blue-400 shrink-0 mt-1 tracking-widest text-sm">💧💧<span className="opacity-20 grayscale">💧</span></div>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Regular (2 Drops)</span>
                        <p className="text-sm text-gray-600">The standard for average flow days. Change every 4-6 hours.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="flex text-blue-500 shrink-0 mt-1 tracking-widest text-sm">💧💧💧</div>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Super / Heavy (3+ Drops)</span>
                        <p className="text-sm text-gray-600">For heavy flow days (usually days 1-2). Designed to hold more fluid.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Box to balance columns */}
                  <div className="mt-4 flex-1 flex flex-col justify-end">
                    <div className="w-full h-48 rounded-[24px] bg-gradient-to-br from-[#F8C8D1]/30 to-[#E0BBE4]/30 flex flex-col items-center justify-center border-2 border-white shadow-sm relative overflow-hidden">
                      <Heart className="absolute -top-4 -left-4 text-[#F8C8D1] opacity-50" size={80} fill="currentColor" />
                      <Heart className="absolute -bottom-6 -right-6 text-[#E0BBE4] opacity-50" size={100} fill="currentColor" />
                      <Sparkles className="text-[#957DAD] mb-2 z-10" size={32} />
                      <span className="font-bold text-[#2C3E50] tracking-widest uppercase text-sm z-10">You've Got This!</span>
                    </div>
                  </div>
                </div>

                {/* Product Types */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-bold text-[#2C3E50] border-b-2 border-[#957DAD] w-fit pb-1">
                    Types of Protection
                  </h3>
                  <ul className="flex flex-col gap-4">
                    <li className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">🌸</span>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Pads & Liners</span>
                        <p className="text-sm text-gray-600">Worn in your underwear. The best and easiest choice when first starting your period!</p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">🩲</span>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Period Underwear</span>
                        <p className="text-sm text-gray-600">Looks like regular underwear but magically absorbs flow. Super comfortable and reusable.</p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">💧</span>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Tampons</span>
                        <p className="text-sm text-gray-600">Worn internally. Ideal for swimming or sports. Once inserted correctly, you won't even feel them.</p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-xl shrink-0">🌙</span>
                      <div>
                        <span className="font-bold text-[#2C3E50]">Overnight Pads</span>
                        <p className="text-sm text-gray-600">Extra-long pads designed to prevent leaks while lying down asleep.</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-2 bg-[#FFF3E0] p-4 rounded-xl border border-[#FFCC80]/50 flex gap-3 items-start">
                    <span className="text-xl shrink-0">⚠️</span>
                    <div>
                      <span className="font-bold text-[#E65100] text-sm block mb-0.5">Important Tampon Safety (TSS)</span>
                      <p className="text-xs text-[#E65100]/90 leading-relaxed">Toxic Shock Syndrome (TSS) is a rare but serious infection. To prevent it, always use the lowest absorbency tampon needed and <strong>change it every 4-8 hours</strong>. Never wear a tampon overnight while sleeping—always use a pad instead!</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Disposal Section */}
              <div className="bg-[#E0F2F1] rounded-[24px] p-6 border border-[#4DB6AC]/30 flex flex-col sm:flex-row gap-6 items-center mt-2">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-3xl">
                  🗑️
                </div>
                <div>
                  <h3 className="font-bold text-[#00796B] text-lg mb-1.5">Proper Disposal Do's & Don'ts</h3>
                  <p className="text-sm text-[#00796B]/90 font-medium leading-relaxed">
                    <strong>Never flush</strong> pads, tampons, or wrappers down the toilet—they will clog the plumbing! Instead, wrap your used product in toilet paper (or its original wrapper) and throw it in the trash bin. When using public restrooms, look for the small sanitary bins provided inside the stalls.
                  </p>
                </div>
              </div>

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
