import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "./CartContext";
import { useCustomerAuth } from "./CustomerAuthContext";
import { User as UserIcon } from "lucide-react";
import logoBlack from "../../assets/herflowmate-logo-black.png";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, setCartOpen, setQuizOpen } = useCart();
  const { user } = useCustomerAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalCartCount = cart.filter(i => i.id !== "free-bag").reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col bg-[#F8C8D1] ${
        scrolled ? "shadow-md shadow-[#2C3E50]/10 backdrop-blur-md bg-[#F8C8D1]/95" : ""
      }`}
    >
      {/* Announcement Bar */}
      <div className="w-full bg-[#2C3E50] text-center py-1.5 text-[10px] sm:text-xs font-semibold text-white/90 tracking-wide uppercase shadow-sm flex items-center justify-center gap-2">
        <Sparkles size={12} className="text-[#B0C4DE]" />
        <span>Note: Product images shown are conceptual mockups currently in development</span>
        <Sparkles size={12} className="text-[#B0C4DE]" />
      </div>

      <div className={`w-full max-w-6xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? "py-3" : "py-4.5"}`}>
        {/* Brand Logo */}
        <Link to="/" className="flex items-center justify-center hover:opacity-95 transition-opacity relative w-32 md:w-40 lg:w-48 h-12 md:h-14 group">
          <img 
            src={logoBlack}
            alt="HerFlowMate" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[160px] md:h-[200px] lg:h-[240px] max-w-none object-contain pointer-events-none" 
            style={{ filter: "invert(20%) sepia(21%) saturate(1478%) hue-rotate(170deg) brightness(94%) contrast(85%)" }}
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-9">
          <li>
            <Link
              to="/mission"
              className="text-sm font-semibold text-[#2C3E50]/85 hover:text-[#2C3E50] transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Our Mission
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              className="text-sm font-semibold text-[#2C3E50]/85 hover:text-[#2C3E50] transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop
            </Link>
          </li>
          <li>
            <button
              onClick={() => setQuizOpen(true)}
              className="text-sm font-semibold text-[#2C3E50]/85 hover:text-[#2C3E50] transition-colors duration-200 flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Sparkles size={13} className="text-[#FDF1F3]" />
              Find Your Fit
            </button>
          </li>
          <li>
            <Link
              to="/#faq"
              className="text-sm font-semibold text-[#2C3E50]/85 hover:text-[#2C3E50] transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              FAQ
            </Link>
          </li>
        </ul>

        {/* Right Nav Options */}
        <div className="hidden md:flex items-center gap-4">
          {/* Account Links */}
          {user ? (
            <Link to="/account" className="relative p-2 rounded-full hover:bg-white/10 text-[#2C3E50] transition-all cursor-pointer" aria-label="Account">
              <UserIcon size={20} />
            </Link>
          ) : (
            <Link to="/sign-in" className="text-sm font-semibold text-[#2C3E50]/85 hover:text-[#2C3E50] transition-colors duration-200">
              Sign In
            </Link>
          )}

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-white/10 text-[#2C3E50] transition-all cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {totalCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-white text-[#2C3E50] rounded-full flex items-center justify-center text-[9px] font-bold shadow-md shadow-[#2C3E50]/10 border border-[#F8C8D1]/5">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Join Waitlist Pill */}
          <button
            className="px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 bg-white text-[#2C3E50] hover:bg-[#FDF1F3] shadow-sm cursor-pointer border border-white/20"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          >
            Join Waitlist
          </button>
        </div>

        {/* Mobile Nav Button Row */}
        <div className="flex md:hidden items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-[#2C3E50]"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-white text-[#2C3E50] rounded-full flex items-center justify-center text-[8px] font-bold">
                {totalCartCount}
              </span>
            )}
          </button>

          <button className="text-[#2C3E50] p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-[#FAFAFA] border-t border-gray-100 px-6 py-5 flex flex-col gap-4 shadow-inner">
          <Link
            to="/mission"
            className="text-sm font-semibold text-[#2C3E50] hover:text-[#2C3E50] py-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => setOpen(false)}
          >
            Our Mission
          </Link>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#2C3E50] hover:text-[#2C3E50] py-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => setOpen(false)}
          >
            Shop
          </Link>
          <button
            className="text-sm font-semibold text-[#2C3E50] hover:text-[#2C3E50] py-1 text-left flex items-center gap-1.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => { setOpen(false); setQuizOpen(true); }}
          >
            Find Your Fit
          </button>
          <Link
            to="/#faq"
            className="text-sm font-semibold text-[#2C3E50] hover:text-[#2C3E50] py-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => setOpen(false)}
          >
            FAQ
          </Link>

          <div className="border-t border-gray-200 my-2 pt-2">
            {user ? (
              <Link
                to="/account"
                className="text-sm font-bold text-[#2C3E50] hover:text-[#2C3E50] py-1 flex items-center gap-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => setOpen(false)}
              >
                <UserIcon size={16} /> My Account
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="text-sm font-semibold text-[#2C3E50] hover:text-[#2C3E50] py-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="mt-3 px-5 py-3 rounded-full text-xs font-bold w-full bg-[#F8C8D1] hover:bg-[#5949c1] text-[#2C3E50] transition-all shadow-md shadow-[#F8C8D1]/10"
            onClick={() => { setOpen(false); document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            Join Waitlist
          </button>
        </div>
      )}
    </nav>
  );
}
