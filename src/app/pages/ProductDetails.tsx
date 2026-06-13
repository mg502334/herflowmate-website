import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Check, ShoppingBag, ArrowLeft, Shield } from "lucide-react";
import { useCart } from "../components/CartContext";
import { useProducts } from "../data/useProducts";

export function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  
  const product = products.find((p) => p.slug === slug);
  
  const [selectedVariant, setSelectedVariant] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="text-gray-400">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center bg-[#FAFAFA]">
        <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">Product not found</h1>
        <Link to="/shop" className="text-[#F8C8D1] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({
      id: `single-${product.id}`,
      name: product.name,
      variant: selectedVariant || "Standard",
      price: product.price,
      image: product.image,
      isSubscription: false,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isSoldOut = product.stock <= 0 && !product.isWaitlist;

  return (
    <main className="pt-24 pb-24 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F8C8D1] mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image Gallery */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 aspect-square md:aspect-[4/5] flex items-center justify-center p-8 group">
            <div className="absolute top-0 left-0 w-full h-full bg-[#FDF1F3]/30 pointer-events-none" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-700" 
            />
            {product.badge && (
              <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-bold bg-[#F8C8D1] text-[#2C3E50] uppercase tracking-widest shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  color: "#2C3E50",
                  lineHeight: 1.1,
                }}
              >
                {product.name}
              </h1>
              <p className="text-[#F8C8D1] font-semibold tracking-wide text-sm uppercase mt-2">
                {product.tagline}
              </p>
            </div>

            <div className="flex items-baseline gap-3 pb-6 border-b border-gray-200">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#2C3E50" }}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-lg line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>

            {product.variants.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-[#2C3E50] mb-3">Select Model/Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border cursor-pointer ${
                        selectedVariant === v
                          ? "bg-[#F8C8D1] text-[#2C3E50] border-[#F8C8D1] shadow-inner"
                          : "border-gray-200 hover:border-[#F8C8D1] text-gray-600 hover:bg-[#FDF1F3]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              {product.isWaitlist ? (
                <button
                  onClick={() => {
                    const el = document.getElementById("waitlist");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else window.location.href = "/#waitlist";
                  }}
                  className="w-full py-4 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer bg-[#2C3E50] hover:bg-[#1a2632] text-white shadow-xl shadow-[#2C3E50]/20 flex items-center justify-center gap-2"
                >
                  Join Waitlist
                </button>
              ) : isSoldOut ? (
                <button
                  disabled
                  className="w-full py-4 rounded-full text-sm font-bold transition-all duration-300 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200 flex items-center justify-center gap-2"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className={`w-full py-4 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                    added
                      ? "bg-green-600 text-white shadow-xl shadow-green-600/20"
                      : "bg-[#F8C8D1] hover:bg-[#FDF1F3] text-[#2C3E50] shadow-xl shadow-[#F8C8D1]/20 border border-[#F8C8D1]"
                  }`}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 mt-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Highlights</h4>
              <ul className="flex flex-col gap-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FDF1F3] mt-0.5">
                      <Check size={12} color="#F8C8D1" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 justify-center">
              <Shield size={14} />
              <span>Secure Checkout. Ships within 24 hours.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
