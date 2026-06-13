export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  badge?: string;
  variants: string[];
  features: string[];
  isWaitlist?: boolean;
  // Admin Fields
  sku: string;
  stock: number;
  manufacturingCost: number;
  shippingCost: number;
  packagingCost: number;
  isStandalone?: boolean;
  isCustomBox?: boolean;
};

export const products: Product[] = [
  {
    id: 3,
    slug: "diva-cup",
    name: "Diva Cup",
    tagline: "12-hour protection, reusable",
    description: "The Diva Cup provides up to 12 hours of reliable, leak-free protection. Made from 100% medical-grade silicone, it's reusable, eco-friendly, and perfect for your active lifestyle.",
    price: 35,
    originalPrice: null,
    image: "/images/diva-cup.png", // Please move the generated image here
    badge: "Eco Pick",
    variants: ["Model 0", "Model 1", "Model 2"],
    features: ["Medical-grade silicone", "Lasts up to 10 years", "Saves $1,200+"],
    sku: "HFM-DIVA-01",
    stock: 145,
    manufacturingCost: 8.50,
    shippingCost: 3.00,
    packagingCost: 1.50,
  },
  {
    id: 4,
    slug: "first-period-kit",
    name: "First Period Kit",
    tagline: "Everything you need, beautifully packaged",
    description: "Our First Period Kit is carefully curated to provide comfort and confidence during your first cycle. Includes premium pads, pantyliners, a discreet carry pouch, and a helpful guide.",
    price: 45,
    originalPrice: null,
    image: "/images/first-period-kit.png", // Please move the generated image here
    badge: "Coming Soon",
    variants: [],
    features: ["Curated premium essentials", "Step-by-step guide", "Discreet carry pouch"],
    isWaitlist: true,
    sku: "HFM-KIT-01",
    stock: 0,
    manufacturingCost: 15.00,
    shippingCost: 5.00,
    packagingCost: 4.50,
  },
];
