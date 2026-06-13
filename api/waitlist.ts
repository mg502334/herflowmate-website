import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

  const { email } = req.body || {};

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    
    // 1. Save to Supabase (if keys are provided)
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from("waitlist").insert([{ email }]);
      if (error) {
        // If it's a unique constraint violation, that's fine, they are already on the list
        if (error.code !== "23505") {
          console.error("Supabase Error:", error);
        }
      }
    } else {
      console.warn("Missing SUPABASE keys. Skipping database insertion.");
    }

    // 2. Send Email via Resend (if key is provided)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "HerFlowMate Support <support@herflowmate.com>",
        to: email,
        subject: "You're on the list! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAFAFA;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FAFAFA; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="background-color: #2C3E50; padding: 40px 0;">
                        <h1 style="color: #FFFFFF; font-size: 28px; margin: 0; font-family: Georgia, serif; font-weight: normal; letter-spacing: 1px;">HerFlowMate</h1>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding: 48px 40px;">
                        <h2 style="color: #2C3E50; font-size: 24px; margin-top: 0; margin-bottom: 24px; font-family: Georgia, serif;">You're officially on the list! 🎉</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                          Thank you so much for joining the HerFlowMate waitlist. We are thrilled to welcome you to our community.
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                          As an early supporter, you'll be the very first to know the moment we launch our curated premium care boxes. We are working hard behind the scenes to finalize our product lineup and pricing.
                        </p>
                        <div style="background-color: #FDF1F3; border-left: 4px solid #F8C8D1; padding: 24px; border-radius: 4px; margin-bottom: 32px;">
                          <p style="color: #2C3E50; font-size: 16px; line-height: 1.5; margin: 0; font-weight: bold;">
                            "We are building the foundation to become a for-profit social enterprise, and our ultimate goal is to scale our impact globally."
                          </p>
                        </div>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">
                          Keep an eye on your inbox for exclusive updates and sneak peeks as we get closer to launch!
                        </p>
                        <p style="color: #2C3E50; font-size: 16px; margin: 0; font-weight: bold;">
                          Stay radiant,<br/>
                          The HerFlowMate Team
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color: #F8C8D1; padding: 24px;">
                        <p style="color: #2C3E50; font-size: 12px; margin: 0;">
                          © 2026 HerFlowMate. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
    } else {
      console.warn("Missing RESEND_API_KEY. Skipping email sending.");
    }

    return res.status(200).json({ success: true, message: "Successfully joined waitlist" });
  } catch (error: any) {
    console.error("Waitlist Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
