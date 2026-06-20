import { useState } from "react";
import { ShoppingBag, Check, Info } from "lucide-react";
import { useCart } from "./CartContext";
import { useProducts } from "../data/useProducts";
import { Link } from "react-router";
import { FlowGuideModal } from "./FlowGuideModal";

export function Products() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({
    1: "Regular",
    2: "Regular",
    3: "Model 1",
  });

  const handleAdd = (product: any) => {
    addToCart({
      id: `single-${product.id}`,
      name: product.name,
      variant: selectedVariants[product.id],
      price: product.price,
      image: product.image,
      isSubscription: false,
    });
    
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((x) => x !== product.id)), 1500);
  };

  const handleWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="products-single" className="py-24 bg-white border-t border-[#F8C8D1]/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <span
            className="text-[10px] font-bold text-[#F8C8D1] uppercase tracking-widest bg-[#FDF1F3] px-3.5 py-1 rounded-full"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A La Carte
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "-0.01em",
            }}
          >
            Shop Individual Brands
          </h2>
          <p className="text-xs text-gray-500 max-w-md mb-2">
            Prefer not to subscribe? Stock up on your favorite specific brands and products directly from our A La Carte shop.
          </p>
          <button 
            onClick={() => setGuideOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#957DAD]/30 text-[#957DAD] rounded-full text-xs font-bold hover:bg-[#F0E6FA] transition-colors shadow-sm"
          >
            <Info size={14} />
            Not sure what to buy? View Product & Flow Guide
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading products...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const added = addedIds.includes(product.id);
              const isSoldOut = product.stock <= 0 && !product.isWaitlist;
            return (
              <div
                key={product.id}
                className="rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-[#F8C8D1]/5 border border-gray-100 hover:border-[#F8C8D1]/15"
                style={{ background: "#ffffff" }}
              >
                {/* Image */}
                <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-gray-50 block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.badge && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold bg-[#F8C8D1] text-[#2C3E50] uppercase tracking-wider z-10"
                    >
                      {product.badge}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <Link to={`/product/${product.slug}`} className="hover:opacity-80 transition-opacity">
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "#2C3E50",
                        }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#7d7597" }} className="mt-0.5">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Variants */}
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariants((prev) => ({ ...prev, [product.id]: v }))}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          selectedVariants[product.id] === v
                            ? "bg-[#F8C8D1] text-[#2C3E50] border-[#F8C8D1]"
                            : "border-gray-100 hover:border-gray-300 text-gray-500 hover:text-black"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-1.5 mt-1 border-t border-dashed border-gray-100 pt-3">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FDF1F3]">
                          <Check size={10} color="#F8C8D1" strokeWidth={3} />
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#7d7597" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontWeight: 700, color: "#2C3E50" }}>
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(125,117,151,0.6)", textDecoration: "line-through" }}>
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.isWaitlist ? (
                      <button
                        onClick={handleWaitlist}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer bg-[#2C3E50] hover:bg-[#1a2632] text-white shadow-md shadow-[#2C3E50]/10"
                      >
                        Join Waitlist
                      </button>
                    ) : isSoldOut ? (
                      <button
                        disabled
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                          added
                            ? "bg-green-600 text-white"
                            : "bg-[#F8C8D1] hover:bg-[#FDF1F3] text-[#2C3E50] shadow-md shadow-[#F8C8D1]/10 border border-[#F8C8D1]"
                        }`}
                      >
                        {added ? <Check size={13} /> : <ShoppingBag size={13} />}
                        {added ? "Added!" : "Add to cart"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
      
      <FlowGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </section>
  );
}
