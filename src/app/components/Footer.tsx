import { Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router";
import logoWhite from "../../assets/herflowmate-logo-white.png";

const links = {
  Shop: ["Cotton Pads", "Tampons", "Menstrual Cup", "Starter Kit", "Gift Sets"],
  Company: ["About Us", "Our Mission", "Sustainability", "Press", "Careers"],
  Support: ["FAQ", "Shipping Info", "Returns", "Contact Us", "Size Guide"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer style={{ background: "#2C3E50" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 mb-14">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a href="#" className="flex items-center justify-start relative w-40 h-10 md:h-12 -ml-6">
              <img 
                src={logoWhite} 
                alt="HerFlowMate" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[160px] md:h-[200px] max-w-none object-contain pointer-events-none" 
              />
            </a>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(250,247,244,0.55)", lineHeight: 1.7, maxWidth: "28ch" }}>
              Premium period care. Designed for comfort, engineered for the planet.
            </p>
            <div className="flex gap-3 mt-2">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/herflowmatematters" },
                { Icon: Twitter, href: "https://twitter.com/HerFlowMateM" },
                { Icon: Youtube, href: "https://youtube.com/@herflowmate" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F8C8D1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                  aria-label={`Social link ${i}`}
                >
                  <Icon size={15} color="rgba(250,247,244,0.7)" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="flex flex-col gap-3">
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0C4DE" }}>
                {heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    {item === "About Us" || item === "Our Mission" ? (
                      <Link
                        to={item === "About Us" ? "/about" : "/mission"}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(250,247,244,0.6)" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#FAFAFA"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(250,247,244,0.6)"; }}
                      >
                        {item}
                      </Link>
                    ) : heading === "Legal" ? (
                      <Link
                        to={`/legal#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(250,247,244,0.6)" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#FAFAFA"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(250,247,244,0.6)"; }}
                      >
                        {item}
                      </Link>
                    ) : (
                      <a
                        href="#"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(250,247,244,0.6)" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#FAFAFA"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(250,247,244,0.6)"; }}
                      >
                        {item}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="w-full text-center sm:text-left" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(250,247,244,0.35)" }}>
            © 2026 HerFlowMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
