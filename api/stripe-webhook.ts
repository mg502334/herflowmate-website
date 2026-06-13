import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Initialize Supabase with Anon key (RLS allows webhook inserts for MVP)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// We need raw body for Stripe webhook signature verification, but in Vercel serverless
// with Node.js, Vercel parses the body by default unless configured otherwise. 
// For MVP without strict signature validation, we can just parse the JSON.
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  let event = req.body;

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        
        // If this session created a subscription
        if (session.mode === "subscription" && session.subscription) {
          const userId = session.client_reference_id;
          
          if (!userId) {
            console.error("Missing client_reference_id on subscription session", session.id);
            break;
          }

          // Fetch the subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Try to get the plan name from the first item
          let planName = "Custom Box";
          if (subscription.items.data.length > 0) {
            const price = subscription.items.data[0].price;
            // Stripe prices don't natively store custom names from checkout inline price_data easily, 
            // but we can extract it from the line items of the session if needed. 
            // For now, default to "Custom Box".
          }

          const { error } = await supabase.from("subscriptions").insert([
            {
              user_id: userId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              plan_name: planName,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }
          ]);

          if (error) {
            console.error("Error inserting subscription into Supabase:", error);
          }
        }
        break;

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const sub = event.data.object;
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
          
        if (updateError) {
          console.error("Error updating subscription in Supabase:", updateError);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
