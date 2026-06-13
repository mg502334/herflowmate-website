import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart, total } = req.body || {};

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  try {
    // Check if the cart has a subscription item to apply the global 15% discount
    const hasSubscription = cart.some((i: any) => i.isSubscription);

    // Map cart items to Stripe line items
    const lineItems = cart.map((item: any) => {
      let itemName = item.name;
      if (item.variant) itemName += ` - ${item.variant}`;
      
      // Calculate unit amount in cents
      let amount = item.price * 100;
      
      // Apply 15% discount if subscription is present (excluding free bag)
      if (hasSubscription && item.price > 0) {
         amount = Math.round(amount * 0.85);
         itemName += " (15% Subs Discount)";
      }

      // Handle Free Gift
      if (item.id === "free-bag") {
        itemName = "FREE: Custom Premium Brand Bag";
        amount = 0;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: itemName,
            images: [item.image].filter(Boolean),
          },
          unit_amount: amount,
        },
        quantity: item.quantity || 1,
      };
    });

    // Add shipping if applicable
    const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const shipping = subtotal === 0 ? 0 : 599; // Standard flat shipping fee based on dropship estimates

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Standard Shipping",
          },
          unit_amount: shipping,
        },
        quantity: 1,
      });
    }

    // Determine the origin URL for redirects
    const origin = req.headers.origin || "https://herflowmate.com";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment", // Use 'payment' for one-time, or 'subscription' if setting up actual recurring billing. For MVP, 'payment' is often sufficient to capture the initial order.
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
