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

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("Missing RESEND_API_KEY in environment variables.");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const resend = new Resend(resendKey);

  try {
    // Parse Resend webhook payload
    const payload = req.body;
    
    // Safety check for Resend payload structure
    const emailData = payload?.data || payload; 
    
    if (!emailData || !emailData.from || !emailData.to) {
      return res.status(400).json({ error: "Invalid webhook payload structure" });
    }

    const senderEmail = emailData.from;
    const recipientEmailArray = Array.isArray(emailData.to) ? emailData.to : [emailData.to];
    const subject = emailData.subject || "No Subject";
    const bodyText = emailData.text || emailData.html || "No body content";

    // Find which inbox was emailed
    const toAddress = recipientEmailArray.find((email: string) => 
      email.includes("support@herflowmate.com") || 
      email.includes("legal@herflowmate.com") || 
      email.includes("no-reply@herflowmate.com")
    ) || recipientEmailArray[0];

    const inboxType = toAddress.toLowerCase();
    let autoReplyMessage = "";
    let autoReplySubject = "";

    // 1. Determine Auto-Reply Content
    if (inboxType.includes("support@")) {
      autoReplySubject = "Re: " + subject;
      autoReplyMessage = "Thanks for reaching out to HerFlowMate! We've received your message and our support team will get back to you within 24-48 hours.";
    } else if (inboxType.includes("legal@")) {
      autoReplySubject = "Re: " + subject;
      autoReplyMessage = "Thank you for contacting HerFlowMate Legal. We have received your inquiry and forwarded it to our legal counsel for review.";
    } else if (inboxType.includes("no-reply@")) {
      autoReplySubject = "Please contact Support - Unmonitored Inbox";
      autoReplyMessage = "You have reached an unmonitored inbox. Please direct all questions to support@herflowmate.com so we can assist you!";
    } else {
      // Fallback if they emailed an unknown alias
      autoReplySubject = "Re: " + subject;
      autoReplyMessage = "Thanks for reaching out to HerFlowMate! We have received your message.";
    }

    // 2. Send the Auto-Reply back to the customer
    await resend.emails.send({
      from: \`HerFlowMate <\${inboxType}>\`, // Send from the exact address they emailed
      to: senderEmail,
      subject: autoReplySubject,
      html: \`
        <div style="font-family: Arial, sans-serif; color: #2C3E50; line-height: 1.6;">
          <p>\${autoReplyMessage}</p>
          <hr style="border: none; border-top: 1px solid #EEE; margin: 24px 0;" />
          <p style="font-size: 12px; color: #777;">
            On \${new Date().toLocaleString()}, \${senderEmail} wrote:<br/><br/>
            \${bodyText.replace(/\\n/g, '<br/>')}
          </p>
        </div>
      \`,
    });

    // 3. Forward the original message to herflowmate@gmail.com
    await resend.emails.send({
      from: "HerFlowMate System <no-reply@herflowmate.com>", // Send from internal system
      to: "herflowmate@gmail.com",
      subject: \`FWD [\${inboxType}]: \${subject}\`,
      html: \`
        <div style="font-family: Arial, sans-serif; color: #2C3E50;">
          <h3>New Inbound Email Received</h3>
          <p><strong>To:</strong> \${inboxType}</p>
          <p><strong>From:</strong> \${senderEmail}</p>
          <hr />
          <p>\${bodyText.replace(/\\n/g, '<br/>')}</p>
        </div>
      \`,
    });

    return res.status(200).json({ success: true, message: "Webhook processed successfully" });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: "Internal server error processing webhook" });
  }
}
