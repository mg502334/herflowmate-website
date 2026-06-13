import { useState } from "react";
import { Search, MapPin, CheckCircle, Package, ExternalLink, Printer, ChevronDown, ChevronUp, ShoppingBag, User } from "lucide-react";
import React from "react";
import { useAdminAuth } from "./AdminAuthContext";

type ShipmentStatus = "Awaiting Pick" | "Awaiting Inspection" | "Awaiting Shipping" | "Shipped" | "Delivered";

interface Shipment {
  id: string;
  customer: string;
  date: string;
  status: ShipmentStatus;
  method: string;
  items: number;
  total: number;
  tracking?: string;
  lineItems: { name: string; qty: number; price: number }[];
  pickedBy?: string;
  inspectedBy?: string;
  shippedBy?: string;
}

// Mock data for shipments
const MOCK_SHIPMENTS: Shipment[] = [
  { 
    id: "ORD-1045", customer: "Sarah Jenkins", date: "2026-06-10", status: "Awaiting Pick", method: "USPS Priority", items: 2,
    lineItems: [
      { name: "The Harmony Kit", qty: 1, price: 45.00 },
      { name: "Overnight Pads", qty: 1, price: 12.00 }
    ],
    total: 57.00
  },
  { 
    id: "ORD-1044", customer: "Emily Chen", date: "2026-06-09", status: "Awaiting Shipping", method: "UPS Ground", items: 1,
    lineItems: [
      { name: "Everyday Liners", qty: 1, price: 8.00 }
    ],
    total: 8.00,
    pickedBy: "Alex",
    inspectedBy: "Sam"
  },
  { 
    id: "ORD-1043", customer: "Jessica Martinez", date: "2026-06-08", status: "Shipped", method: "USPS First Class", items: 3, tracking: "9400100000000000000000",
    lineItems: [
      { name: "Super Tampons", qty: 2, price: 9.00 },
      { name: "Regular Pads", qty: 1, price: 10.00 }
    ],
    total: 28.00,
    pickedBy: "Taylor",
    inspectedBy: "Alex",
    shippedBy: "Sam"
  },
];

export function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  const { session } = useAdminAuth();
  // Autolog using the email prefix or a fallback name
  const currentUserName = session?.user?.email?.split('@')[0] || "Admin";

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const filteredShipments = shipments.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async (id: string, actionType: "pick" | "inspect" | "ship") => {
    if (actionType === "ship") {
      try {
        const shipment = shipments.find(s => s.id === id);
        
        // Since we don't have a loading state for the button built in, we can use a simple alert
        // to let the user know we are contacting Shippo. In production, we'd use a loading spinner.
        const confirmPrint = window.confirm(`Generate live USPS shipping label via Shippo for ${id}?`);
        if (!confirmPrint) return;

        const response = await fetch('/api/shippo-label', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: id,
            customerName: shipment?.customer
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          alert("Error generating label: " + (data.error || "Unknown error"));
          console.error(data);
          return;
        }
        
        // Success! Open PDF in new tab
        if (data.label_url) {
          window.open(data.label_url, '_blank');
        }

        // Update state
        setShipments(prev => prev.map(s => {
          if (s.id !== id) return s;
          return {
            ...s,
            status: "Shipped",
            shippedBy: currentUserName,
            tracking: data.tracking_number,
          };
        }));
      } catch (err) {
        alert("Network error connecting to Shippo API.");
        console.error(err);
      }
      return;
    }

    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      const updated = { ...s };
      if (actionType === "pick") {
        alert(`Printing Pick List for ${id}...`);
        updated.status = "Awaiting Inspection";
        updated.pickedBy = currentUserName;
      } else if (actionType === "inspect") {
        alert(`Printing Order Inspection Checklist for ${id}...`);
        updated.status = "Awaiting Shipping";
        updated.inspectedBy = currentUserName;
      }
      return updated;
    }));
  };

  const renderStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case "Delivered":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Delivered</span>;
      case "Shipped":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"><Package className="w-3 h-3 mr-1" /> Shipped</span>;
      case "Awaiting Pick":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Awaiting Pick</span>;
      case "Awaiting Inspection":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Awaiting Inspection</span>;
      case "Awaiting Shipping":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Awaiting Shipping</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <MapPin className="w-8 h-8 mr-3 text-[#38BDF8]" />
          Fulfillment & Shipments
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search orders..."
              className="bg-[#1E293B] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0F172A]/50 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold text-gray-400">Order ID</th>
                <th className="p-4 font-semibold text-gray-400">Customer</th>
                <th className="p-4 font-semibold text-gray-400">Date</th>
                <th className="p-4 font-semibold text-gray-400">Status</th>
                <th className="p-4 font-semibold text-gray-400">Method</th>
                <th className="p-4 font-semibold text-gray-400 text-center">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredShipments.map((shipment) => (
                <React.Fragment key={shipment.id}>
                  <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleExpand(shipment.id)}>
                    <td className="p-4 font-medium text-white flex items-center">
                      <button className="mr-2 text-gray-400 hover:text-white transition-colors">
                        {expandedOrderId === shipment.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <div>
                        {shipment.id}
                        <div className="text-xs text-gray-500 mt-1">{shipment.items} items • ${shipment.total.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {shipment.customer}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {shipment.date}
                    </td>
                    <td className="p-4">
                      {renderStatusBadge(shipment.status)}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {shipment.method}
                      {shipment.tracking && (
                        <div className="text-xs text-[#38BDF8] mt-1 flex items-center hover:underline cursor-pointer">
                          {shipment.tracking} <ExternalLink className="w-3 h-3 ml-1" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {shipment.status === "Awaiting Pick" && (
                        <button onClick={(e) => { e.stopPropagation(); handleAction(shipment.id, "pick"); }} className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center mx-auto">
                          <Printer className="w-3 h-3 mr-1.5" /> Print Pick List
                        </button>
                      )}
                      {shipment.status === "Awaiting Inspection" && (
                        <button onClick={(e) => { e.stopPropagation(); handleAction(shipment.id, "inspect"); }} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center mx-auto">
                          <CheckCircle className="w-3 h-3 mr-1.5" /> Print Inspection
                        </button>
                      )}
                      {shipment.status === "Awaiting Shipping" && (
                        <button onClick={(e) => { e.stopPropagation(); handleAction(shipment.id, "ship"); }} className="bg-[#38BDF8] text-[#0F172A] font-semibold px-3 py-1.5 rounded text-xs hover:bg-[#38BDF8]/90 transition-colors flex items-center mx-auto">
                          <Printer className="w-3 h-3 mr-1.5" /> Print Label (Shippo)
                        </button>
                      )}
                      {(shipment.status === "Shipped" || shipment.status === "Delivered") && (
                        <span className="text-gray-500 text-sm italic">Completed</span>
                      )}
                    </td>
                  </tr>
                  
                  {expandedOrderId === shipment.id && (
                    <tr className="bg-[#0F172A]/30">
                      <td colSpan={6} className="p-4 px-8 border-t border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left: Order Contents */}
                          <div className="bg-[#1E293B] border border-gray-800 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Order Contents
                            </h4>
                            <div className="space-y-2">
                              {shipment.lineItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <div className="text-gray-400">
                                    <span className="text-white font-medium">{item.qty}x</span> {item.name}
                                  </div>
                                  <div className="text-gray-300">${(item.price * item.qty).toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center text-sm font-semibold">
                              <span className="text-gray-400">Total</span>
                              <span className="text-white">${shipment.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Right: Chain of Custody */}
                          <div className="bg-[#1E293B] border border-gray-800 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              Chain of Custody
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${shipment.pickedBy ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                <div>
                                  <div className="text-sm font-medium text-white">Picked</div>
                                  <div className="text-xs text-gray-400">{shipment.pickedBy ? `by ${shipment.pickedBy}` : 'Awaiting action'}</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${shipment.inspectedBy ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                <div>
                                  <div className="text-sm font-medium text-white">Inspected & Packed</div>
                                  <div className="text-xs text-gray-400">{shipment.inspectedBy ? `by ${shipment.inspectedBy}` : 'Awaiting action'}</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${shipment.shippedBy ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                <div>
                                  <div className="text-sm font-medium text-white">Labeled & Shipped</div>
                                  <div className="text-xs text-gray-400">{shipment.shippedBy ? `by ${shipment.shippedBy}` : 'Awaiting action'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No shipments found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
