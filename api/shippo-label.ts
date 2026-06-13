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

  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) {
    console.error("Missing SHIPPO_API_KEY in environment variables.");
    return res.status(500).json({ error: "Server configuration error: Missing Shippo Key" });
  }

  try {
    const { orderId, customerName } = req.body;

    // 1. Create a Shipment using the Shippo REST API directly
    const shipmentResponse = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        "Authorization": `ShippoToken ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        async: false,
        address_from: {
          name: "HerFlowMate Fulfillment",
          street1: "123 Founder Lane",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
          country: "US",
          phone: "+1 555 341 9393",
          email: "support@herflowmate.com"
        },
        address_to: {
          name: customerName || "Valued Customer",
          street1: "456 Market St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "US",
          phone: "+1 555 123 4567"
        },
        parcels: [{
          length: "8",
          width: "6",
          height: "4",
          distance_unit: "in",
          weight: "1",
          mass_unit: "lb"
        }]
      })
    });

    const shipmentData = await shipmentResponse.json();

    if (!shipmentResponse.ok) {
      console.error("Shippo Shipment Error:", shipmentData);
      return res.status(400).json({ error: "Failed to generate Shippo rates", details: shipmentData });
    }

    // 2. Grab the cheapest/first rate available
    const rates = shipmentData.rates;
    if (!rates || rates.length === 0) {
      return res.status(400).json({ error: "No shipping rates available for this address" });
    }
    
    // Sort to get the cheapest rate
    const sortedRates = rates.sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount));
    const cheapestRateId = sortedRates[0].object_id;

    // 3. Purchase the Label (Create Transaction)
    const transactionResponse = await fetch("https://api.goshippo.com/transactions/", {
      method: "POST",
      headers: {
        "Authorization": `ShippoToken ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rate: cheapestRateId,
        label_file_type: "PDF",
        async: false
      })
    });

    const transactionData = await transactionResponse.json();

    if (!transactionResponse.ok) {
      console.error("Shippo Transaction Error:", transactionData);
      return res.status(400).json({ error: "Failed to purchase Shippo label", details: transactionData });
    }

    if (transactionData.status !== "SUCCESS") {
      return res.status(400).json({ 
        error: "Label purchase failed", 
        messages: transactionData.messages 
      });
    }

    // 4. Return the label URL and tracking number to the frontend
    return res.status(200).json({ 
      success: true, 
      tracking_number: transactionData.tracking_number,
      tracking_url: transactionData.tracking_url_provider,
      label_url: transactionData.label_url 
    });

  } catch (error: any) {
    console.error("Shippo Label Generation Error:", error);
    return res.status(500).json({ error: "Internal server error connecting to Shippo" });
  }
}
