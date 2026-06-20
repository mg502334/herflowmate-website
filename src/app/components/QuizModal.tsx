import { useState } from "react";
import { X, Check, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { useCart } from "./CartContext";
import cupHero from "../../assets/menstrual_cup_hero.png";

const questions = [
  {
    id: 1,
    title: "How heavy is your flow on average?",
    desc: "Every body is different. Choose what represents your heaviest days.",
    options: [
      { label: "Light Flow", val: "light", desc: "Minimal coverage needed, mostly light tampons or regular liners." },
      { label: "Medium Flow", val: "medium", desc: "Steady flow, standard pads or tampons replaced every 4-6 hours." },
      { label: "Heavy Flow", val: "heavy", desc: "Intense flow, require overnight pads or super tampons frequently." },
      { label: "Highly Varied", val: "varied", desc: "Changes dramatically day-to-day, requires a flexible mix of products." },
    ],
  },
  {
    id: 2,
    title: "What are your preferred care products?",
    desc: "We formulate our GOTS certified range to match your preference.",
    options: [
      { label: "Premium Cotton Pads Only", val: "pads", desc: "Ultra-thin, comfortable, chemical-free pads." },
      { label: "Premium Tampons Only", val: "tampons", desc: "Cardboard smooth applicator, synthetic-free cotton tampons." },
      { label: "Reusable Menstrual Cup", val: "cup", desc: "Zero-waste, medical-grade silicone, up to 12h protection." },
      { label: "Pads & Tampons Mix", val: "mix", desc: "Flexible subscription box containing a custom blend of both." },
    ],
  },
  {
    id: 3,
    title: "Have you ever given birth vaginally?",
    desc: "This helps our OB-GYN size guide recommend the perfect menstrual cup fit.",
    options: [
      { label: "No", val: "no", desc: "We recommend Menstrual Cup Size A (softer, snug fit)." },
      { label: "Yes", val: "yes", desc: "We recommend Menstrual Cup Size B (slightly larger, heavy protection)." },
      { label: "Not using a cup / Skip", val: "skip", desc: "No cup size recommendation needed." },
    ],
  },
];

export function QuizModal() {
  const { quizOpen, setQuizOpen, addToCart } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!quizOpen) return null;

  const currentQuestion = questions[step];

  const handleSelect = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setStep(questions.length); // Result screen
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
  };

  // Recommendations logic
  const getRecommendation = () => {
    const flow = answers[1];
    const pref = answers[2];
    const birth = answers[3];

    if (pref === "cup") {
      const size = birth === "yes" ? "Size B" : "Size A";
      return {
        type: "cup",
        name: `Premium Menstrual Cup (${size})`,
        price: 35,
        image: cupHero,
        desc: `Our OB-GYN approved medical-grade silicone cup in ${size}. Perfect for reusable 12-hour leak-free comfort.`,
        features: ["Lasts up to 10 years", "OB-GYN sized & tested", "Saves $1,200+ compared to disposables"],
        variant: size,
      };
    }

    if (flow === "heavy" || flow === "varied") {
      return {
        type: "box",
        name: "Comfort Plus Subscription Box",
        price: 22,
        image: "/tampons.png",
        desc: "Designed for intensive support. Includes standard essentials plus self-care extras like heat-patches and premium tea.",
        features: ["GOTS Certified Cotton", "OB-GYN Approved fit", "Self-care additions included"],
        variant: "Heavy Mix Box",
        isSubscription: true,
        frequency: "4 weeks",
      };
    }

    if (flow === "light" && pref === "pads") {
      return {
        type: "box",
        name: "Basic Care Subscription Box",
        price: 14,
        image: "/tampons.png",
        desc: "Your light monthly essentials. Fully premium, direct to your door, packaged in customized brand mailers.",
        features: ["100% Premium cotton", "Super-thin, active-proof", "Plain discreet box shipping"],
        variant: "Light Pads Box",
        isSubscription: true,
        frequency: "4 weeks",
      };
    }

    // Default Wellness Box
    return {
      type: "box",
      name: "Wellness Bundle Box",
      price: 32,
      image: "/tampons.png",
      desc: "The ultimate period care box. Contains full premium hygiene coverage, custom discreet brand storage bag, and curated premium self‑care goods.",
      features: ["Pads, liners & tampons included", "Includes custom brand cloth bag", "Cancel subscription anytime"],
      variant: "Full Wellness Bundle",
      isSubscription: true,
      frequency: "4 weeks",
    };
  };

  const recommendation = getRecommendation();

  const handleAddRecommendation = () => {
    addToCart({
      id: recommendation.name.replace(/\s+/g, "-").toLowerCase(),
      name: recommendation.name,
      price: recommendation.price,
      image: recommendation.image,
      variant: recommendation.variant,
      isSubscription: recommendation.isSubscription,
      frequency: recommendation.frequency,
    });
    setQuizOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2C3E50]/40 backdrop-blur-sm transition-opacity" onClick={() => setQuizOpen(false)} />

      {/* Modal Card */}
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 border border-[#F8C8D1]/10 flex flex-col max-h-[90vh]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#F8C8D1]/10 flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem", color: "#F8C8D1" }}>
              Period Care Fit Finder
            </h3>
            {step < questions.length && (
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Step {step + 1} of {questions.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setQuizOpen(false)}
            className="p-1 rounded-full hover:bg-[#FDF1F3]/50 transition-colors text-gray-500 hover:text-black"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quiz Steps */}
        {step < questions.length ? (
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
            <div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: "#2C3E50" }}>
                {currentQuestion.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{currentQuestion.desc}</p>
            </div>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.val;
                return (
                  <button
                    key={opt.val}
                    onClick={() => handleSelect(opt.val)}
                    className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? "border-[#F8C8D1] bg-[#FDF1F3]/30 shadow-md shadow-[#F8C8D1]/5"
                        : "border-gray-100 hover:border-[#F8C8D1]/30 hover:bg-[#FAFAFA]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        isSelected ? "border-[#F8C8D1] bg-[#F8C8D1]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={12} color="#white" strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#2C3E50]">{opt.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 leading-normal">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Recommendation Result Screen */
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#F8C8D1] bg-[#FDF1F3] px-3 py-1 rounded-full tracking-wider">
                Your Custom Recommendation
              </span>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#2C3E50", marginTop: "0.75rem" }}>
                {recommendation.name}
              </h4>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-[#FAFAFA] border border-[#F8C8D1]/5">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FDF1F3] flex-shrink-0">
                <img src={recommendation.image} alt={recommendation.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-600 leading-normal">{recommendation.desc}</p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">
                    Variant: {recommendation.variant}
                  </span>
                </div>
                <div className="text-base font-bold text-[#F8C8D1] mt-1">
                  ${recommendation.price}
                  {recommendation.isSubscription && <span className="text-xs text-gray-400 font-normal"> / month</span>}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#2C3E50] mb-2.5">Why this is perfect for you:</div>
              <ul className="flex flex-col gap-2">
                {recommendation.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#FDF1F3] flex items-center justify-center flex-shrink-0">
                      <Check size={10} color="#F8C8D1" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="p-6 border-t border-[#F8C8D1]/10 bg-[#FAFAFA] flex justify-between items-center gap-4">
          {step < questions.length ? (
            <>
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#F8C8D1] transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft size={14} />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#F8C8D1] hover:bg-[#5949c1] disabled:bg-gray-200 text-white disabled:text-gray-400 text-xs font-semibold rounded-full transition-all group"
              >
                Next Step
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#F8C8D1] transition-colors"
              >
                <RefreshCw size={12} />
                Retake Quiz
              </button>

              <button
                onClick={handleAddRecommendation}
                className="px-6 py-2.5 bg-[#F8C8D1] hover:bg-[#5949c1] text-white text-xs font-semibold rounded-full transition-all shadow-md shadow-[#F8C8D1]/10"
              >
                Add recommended to box
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
