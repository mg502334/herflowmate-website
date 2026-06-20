import { BookOpen, Droplets, Activity, Flower2, Wind, ShieldAlert, Sparkles, HeartPulse, Sunset, Printer } from "lucide-react";
import { Link } from "react-router";

export function Education() {
  const sections = [
    {
      id: "puberty",
      title: "The Start: Puberty",
      icon: <Sparkles className="text-[#FFD54F]" size={28} />,
      image: "/puberty_education.png",
      content: "Puberty is the first major hormonal transition in a woman's life, typically beginning between ages 8 and 13. Your body starts producing more estrogen, leading to physical changes and the onset of the menstrual cycle. It's a foundational phase that marks the beginning of your reproductive years.",
      color: "bg-[#FFF9C4]",
      border: "border-[#FFD54F]"
    },
    {
      id: "menstruation",
      title: "Understanding Menstruation",
      icon: <Droplets className="text-[#F8C8D1]" size={28} />,
      image: "/menstruation_education.png",
      content: "The menstrual cycle is a natural, beautiful process that prepares the body for potential pregnancy. It involves a complex dance of hormones that can affect everything from your energy levels to your mood. By learning the four phases of your cycle, you can better align your lifestyle to support your body's natural rhythm.",
      color: "bg-[#FDF1F3]",
      border: "border-[#F8C8D1]"
    },
    {
      id: "ovulation",
      title: "The Ovulation Phase",
      icon: <Flower2 className="text-[#E0BBE4]" size={28} />,
      image: "/ovulation_education.png",
      content: "Ovulation is the release of an egg from an ovary, marking the most fertile window in your cycle. Usually occurring around day 14, it brings a peak in estrogen and testosterone. Many women report feeling most energetic, social, and vibrant during this time. Knowing when you ovulate is key to understanding your body's deep internal clock.",
      color: "bg-[#F4EBFF]",
      border: "border-[#E0BBE4]"
    },
    {
      id: "hormonal",
      title: "Hormonal Fluctuations",
      icon: <Activity className="text-[#957DAD]" size={28} />,
      image: "/hormonal_changes_education.png",
      content: "Throughout your cycle, fluctuations in estrogen and progesterone impact your skin, sleep, metabolism, and emotional wellbeing. These shifts are completely normal. Embracing these changes—rather than fighting them—helps you navigate each phase with self-compassion and tailored care.",
      color: "bg-[#F0E6FA]",
      border: "border-[#957DAD]"
    },
    {
      id: "perimenopause",
      title: "Approaching Perimenopause",
      icon: <Sunset className="text-[#FF8A65]" size={28} />,
      image: "/perimenopause_education.png",
      content: "Perimenopause is the transitional phase leading up to menopause, often starting in a woman's 40s. Hormone levels gradually begin to fluctuate more irregularly, leading to changes in cycle length, mood, and temperature regulation. Recognizing these signs early allows for better comfort and management strategies.",
      color: "bg-[#FBE9E7]",
      border: "border-[#FF8A65]"
    },
    {
      id: "menopause",
      title: "Embracing Menopause",
      icon: <Wind className="text-[#FFCC80]" size={28} />,
      image: "/menopause_education.png",
      content: "Menopause is a profound, natural transition marking the end of menstrual cycles, characterized by a decrease in reproductive hormones. Far from an end, it is a significant new chapter that calls for comfort, patience, and specialized wellness routines to support your evolving body.",
      color: "bg-[#FFF3E0]",
      border: "border-[#FFCC80]"
    },
    {
      id: "pcos",
      title: "Navigating PCOS",
      icon: <ShieldAlert className="text-[#81C784]" size={28} />,
      image: "/pcos_education.png",
      content: "Polycystic Ovary Syndrome (PCOS) involves hormonal imbalances that can cause irregular periods, skin changes, and other systemic symptoms. While it affects many women globally, education, proper medical guidance, and the right self-care strategies can effectively manage its impact on daily life.",
      color: "bg-[#E8F5E9]",
      border: "border-[#81C784]"
    },
    {
      id: "cervical-cancer",
      title: "Cervical Health",
      icon: <HeartPulse className="text-[#4DB6AC]" size={28} />,
      image: "/cervical_cancer_education.png",
      content: "Cervical health is a critical part of a woman's wellness journey. Regular screenings, such as Pap smears and HPV tests, usually begin in your 20s and are the most effective way to prevent cervical cancer. Education and proactive care empower you to stay healthy and informed about your body.",
      color: "bg-[#E0F2F1]",
      border: "border-[#4DB6AC]"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-6 mb-20">
          <span className="text-xs font-bold text-[#957DAD] uppercase tracking-widest bg-[#F0E6FA] px-4 py-1.5 rounded-full flex items-center gap-2">
            <BookOpen size={14} />
            Knowledge is Power
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Your Body, Decoded.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl">
            We believe that understanding your body shouldn't require a medical degree. Explore our beautifully curated guides to the amazing processes happening within you.
          </p>
        </div>

        {/* Educational Content */}
        <div className="space-y-24">
          {sections.map((section, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div 
                key={section.id} 
                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${isReversed ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className={`relative aspect-square rounded-[40px] p-2 bg-white shadow-xl border ${section.border}/30 overflow-hidden group`}>
                    <div className={`absolute inset-0 opacity-20 ${section.color} transition-opacity duration-500 group-hover:opacity-40`}></div>
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                  <div className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center shadow-sm`}>
                    {section.icon}
                  </div>
                  
                  <h2 
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(2rem, 3vw, 2.5rem)",
                      fontWeight: 600,
                      color: "#2C3E50",
                      lineHeight: 1.2,
                    }}
                  >
                    {section.title}
                  </h2>
                  
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    {section.content}
                  </p>
                  
                  {section.id === "puberty" && (
                    <Link 
                      to="/flyer/puberty"
                      className="mt-4 w-fit px-8 py-3.5 rounded-full font-bold transition-all bg-[#2C3E50] text-white shadow-md shadow-[#2C3E50]/20 hover:bg-[#1A252F] hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      Print Free Flyer
                      <Printer size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
