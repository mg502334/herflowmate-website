import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  isSubscription?: boolean;
  frequency?: string; // '4 weeks' | '6 weeks' | '8 weeks'
}

interface CartContextType {
  cart: CartItem[];
  cartOpen: boolean;
  quizOpen: boolean;
  quizResult: string | null;
  claimedFreeBag: boolean;
  waitlistEmail: string | null;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string | number, variant: string) => void;
  updateQuantity: (id: string | number, variant: string, amount: number) => void;
  setCartOpen: (open: boolean) => void;
  setQuizOpen: (open: boolean) => void;
  setQuizResult: (result: string | null) => void;
  claimFreeBag: () => void;
  unclaimFreeBag: () => void;
  submitWaitlist: (email: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [claimedFreeBag, setClaimedFreeBag] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("herflowmate_cart");
    const savedClaimedBag = localStorage.getItem("herflowmate_claimed_bag");
    const savedWaitlist = localStorage.getItem("herflowmate_waitlist_email");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedClaimedBag) {
      setClaimedFreeBag(savedClaimedBag === "true");
    }
    if (savedWaitlist) {
      setWaitlistEmail(savedWaitlist);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("herflowmate_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.variant === newItem.variant && !!item.isSubscription === !!newItem.isSubscription
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prevCart, { ...newItem, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string | number, variant: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.variant === variant)));
  };

  const updateQuantity = (id: string | number, variant: string, amount: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && item.variant === variant) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const claimFreeBag = () => {
    if (claimedFreeBag) return;
    setClaimedFreeBag(true);
    localStorage.setItem("herflowmate_claimed_bag", "true");
    
    // Add the free bag to the cart as a $0 item
    addToCart({
      id: "free-bag",
      name: "Custom Discreet Brand Bag",
      variant: "Exclusive Gift",
      price: 0,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=300&fit=crop&auto=format",
      isSubscription: false
    });
  };

  const unclaimFreeBag = () => {
    setClaimedFreeBag(false);
    localStorage.setItem("herflowmate_claimed_bag", "false");
    removeFromCart("free-bag", "Exclusive Gift");
  };

  const submitWaitlist = (email: string) => {
    setWaitlistEmail(email);
    localStorage.setItem("herflowmate_waitlist_email", email);
  };

  const clearCart = () => {
    setCart([]);
    setClaimedFreeBag(false);
    localStorage.removeItem("herflowmate_claimed_bag");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        quizOpen,
        quizResult,
        claimedFreeBag,
        waitlistEmail,
        addToCart,
        removeFromCart,
        updateQuantity,
        setCartOpen,
        setQuizOpen,
        setQuizResult,
        claimFreeBag,
        unclaimFreeBag,
        submitWaitlist,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
