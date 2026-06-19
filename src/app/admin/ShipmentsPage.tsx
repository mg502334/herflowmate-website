import { useState } from "react";
import { Search, MapPin, CheckCircle, Package, ExternalLink, Printer, ChevronDown, ChevronUp, ShoppingBag, User, Calendar as CalendarIcon, XCircle } from "lucide-react";
import React from "react";
import { useAdminAuth } from "./AdminAuthContext";
import { useStoreSettings } from "../data/useStoreSettings";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO, isSameDay } from 'date-fns';

import { useOrders, OrderStatus, Order } from "../data/useOrders";
import { useProducts } from "../data/useProducts";

// We keep ShipmentStatus as an alias for OrderStatus
type ShipmentStatus = OrderStatus;

interface Shipment {
  id: string;
  customer: string;
  date: string;
  shippedDate?: string;
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
    id: "ORD-1043", customer: "Jessica Martinez", date: "2026-06-08", shippedDate: "2026-06-09", status: "Shipped", method: "USPS First Class", items: 3, tracking: "9400100000000000000000",
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
  const { orders, loading, updateOrderStatus } = useOrders();
  const { products, updateStock } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { session } = useAdminAuth();
  const { settings } = useStoreSettings();
  // Autolog using the email prefix or a fallback name
  const currentUserName = session?.user?.email?.split('@')[0] || "Admin";

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.display_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedDate) {
      const orderDate = parseISO(o.created_at);
      const shippedDate = o.shipped_date ? parseISO(o.shipped_date) : null;
      const matchesDate = isSameDay(orderDate, selectedDate) || (shippedDate && isSameDay(shippedDate, selectedDate));
      return matchesSearch && matchesDate;
    }

    return matchesSearch;
  });

  const handleAction = async (id: string, actionType: "pick" | "inspect" | "ship" | "cancel") => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (actionType === "cancel") {
      const confirmCancel = window.confirm(`Are you sure you want to cancel order ${id}? This action cannot be undone.`);
      if (!confirmCancel) return;
      try {
        await updateOrderStatus(id, "Canceled");
      } catch (err: any) {
        alert("Failed to cancel order: " + err.message);
      }
      return;
    }
    if (actionType === "ship") {
      try {
        const confirmPrint = window.confirm(`Generate live USPS shipping label via Shippo for ${order.display_id}?`);
        if (!confirmPrint) return;

        const response = await fetch('/api/shippo-label', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: id,
            customerName: order?.customer_name,
            labelFormat: settings?.printer_label_format || 'PDF'
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

        // Update state in DB
        await updateOrderStatus(id, "Shipped", {
          shipped_by: currentUserName,
          shipped_date: new Date().toISOString().split('T')[0],
          tracking: data.tracking_number,
        });
      } catch (err) {
        alert("Network error connecting to Shippo API.");
        console.error(err);
      }
      return;
    }

    if (actionType === "pick") {
      const confirmPrint = window.confirm(`Print Pick List for ${order.display_id}?`);
      if (!confirmPrint) return;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
            <html>
              <head>
                <title>Pick List - ${order.display_id}</title>
                <style>
                  body { font-family: sans-serif; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                  th { background-color: #f2f2f2; color: #333; }
                  .checkbox { width: 20px; height: 20px; border: 1px solid #000; border-radius: 3px; }
                </style>
              </head>
              <body>
                <h2>Pick List: ${order.display_id}</h2>
                <p><strong>Customer:</strong> ${order.customer_name}</p>
                <p><strong>Order Date:</strong> ${order.created_at}</p>
                <table>
                  <tr><th style="width: 50px; text-align: center;">Picked</th><th>Item Name</th><th>Qty</th></tr>
                  ${order.line_items.map((item: any) => `<tr><td style="text-align: center;"><div class="checkbox" style="margin: 0 auto;"></div></td><td>${item.name}</td><td>${item.qty}</td></tr>`).join('')}
                </table>
                <script>window.onload = () => { window.print(); }</script>
              </body>
            </html>
          `);
        printWindow.document.close();
      }
      await updateOrderStatus(id, "Awaiting Inspection", { picked_by: currentUserName });

      // Adjust inventory count down by pulled quantity
      for (const item of order.line_items) {
        const product = products.find(p => p.name === item.name);
        if (product) {
          await updateStock(product.id, -item.qty);
        }
      }
    } else if (actionType === "inspect") {
      const confirmPrint = window.confirm(`Print Inspection Sheet for ${order.display_id}?`);
      if (!confirmPrint) return;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
            <html>
              <head>
                <title>Inspection Sheet - ${order.display_id}</title>
                <style>
                  body { font-family: sans-serif; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                  th { background-color: #f2f2f2; color: #333; }
                  .checkbox { width: 20px; height: 20px; border: 1px solid #000; border-radius: 3px; }
                </style>
              </head>
              <body>
                <h2>Inspection Sheet: ${order.display_id}</h2>
                <p><strong>Customer:</strong> ${order.customer_name}</p>
                <table>
                  <tr><th style="width: 50px; text-align: center;">Packed</th><th>Item Name</th><th>Qty</th></tr>
                  ${order.line_items.map((item: any) => `<tr><td style="text-align: center;"><div class="checkbox" style="margin: 0 auto;"></div></td><td>${item.name}</td><td>${item.qty}</td></tr>`).join('')}
                </table>
                <p style="margin-top: 40px; border-top: 1px solid #000; width: 300px; padding-top: 10px;"><strong>Inspector Signature</strong></p>
                <script>window.onload = () => { window.print(); }</script>
              </body>
            </html>
          `);
        printWindow.document.close();
      }
      await updateOrderStatus(id, "Awaiting Shipping", { inspected_by: currentUserName });
    }
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

  const orderDates = orders.map(o => parseISO(o.created_at));
  const shippedDates = orders.filter(o => o.shipped_date).map(o => parseISO(o.shipped_date!));

  const CustomDayContent = (props: any) => {
    const { date } = props;
    const isOrdered = orderDates.some(d => isSameDay(d, date));
    const isShipped = shippedDates.some(d => isSameDay(d, date));

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-start pt-1">
        <span>{date.getDate()}</span>
        <div className="flex flex-col gap-[2px] mt-1 w-[60%] px-1">
          {isOrdered && <div className="h-1 bg-[#38BDF8] rounded-sm w-full"></div>}
          {isShipped && <div className="h-1 bg-[#10B981] rounded-sm w-full"></div>}
        </div>
      </div>
    );
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
              placeholder="Search all orders..."
              className="bg-[#1E293B] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-xl border border-gray-800 p-6 shadow-xl flex flex-col md:flex-row items-center justify-between w-full space-y-6 md:space-y-0 md:space-x-12">
        <div className="flex-shrink-0">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-[#38BDF8]" />
            Filter by Date
          </h3>
          <style>{`
            .rdp { --rdp-cell-size: 44px; margin: 0; }
            .rdp-day_selected { background-color: rgba(56, 189, 248, 0.1); border: 1px solid #38BDF8; font-weight: bold; border-radius: 8px; }
            .rdp-day_selected:hover { background-color: rgba(56, 189, 248, 0.2); }
            .rdp-button:hover:not(.rdp-day_selected) { background-color: rgba(255, 255, 255, 0.05); }
          `}</style>
          <div className="bg-[#0F172A] rounded-lg p-3 border border-gray-800 inline-block">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              components={{
                DayContent: CustomDayContent
              }}
              className="text-gray-300"
            />
          </div>
          <div className="mt-4 flex space-x-4 text-xs text-gray-400 justify-center">
            <div className="flex items-center"><div className="w-3 h-1 bg-[#38BDF8] rounded mr-2"></div> Order Placed</div>
            <div className="flex items-center"><div className="w-3 h-1 bg-[#10B981] rounded mr-2"></div> Order Shipped</div>
          </div>
        </div>

        <div className="flex-1 bg-[#0F172A] rounded-lg border border-gray-800 p-6 flex flex-col justify-center min-h-[300px] w-full">
          {selectedDate ? (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</h3>
              <p className="text-gray-400 mb-6">
                Showing {filteredOrders.length} shipment(s) associated with this date.
              </p>
              <button
                onClick={() => setSelectedDate(undefined)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium border border-gray-700"
              >
                Clear Date Filter
              </button>
            </div>
          ) : (
            <div className="text-center">
              <CalendarIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Date Selected</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Select a date on the calendar to view orders placed or shipped on that specific day. Or use the global search to find any order.
              </p>
            </div>
          )}
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
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <td className="p-4 font-medium text-white flex items-center">
                      <button className="mr-2 text-gray-400 hover:text-white transition-colors">
                        {expandedOrderId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <div>
                        {order.display_id}
                        <div className="text-xs text-gray-500 mt-1">{order.line_items.reduce((acc, item) => acc + item.qty, 0)} items • ${order.total.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {order.customer_name}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {order.created_at.split('T')[0]}
                    </td>
                    <td className="p-4">
                      {renderStatusBadge(order.status as ShipmentStatus)}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {order.method}
                      {order.tracking && (
                        <div className="text-xs text-[#38BDF8] mt-1 flex items-center hover:underline cursor-pointer">
                          {order.tracking} <ExternalLink className="w-3 h-3 ml-1" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {order.status === "Awaiting Pick" && (
                          <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, "pick"); }} className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center">
                            <Printer className="w-3 h-3 mr-1.5" /> Print Pick List
                          </button>
                        )}
                        {order.status === "Awaiting Inspection" && (
                          <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, "inspect"); }} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-semibold px-3 py-1.5 rounded text-xs transition-colors flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1.5" /> Print Inspection
                          </button>
                        )}
                        {order.status === "Awaiting Shipping" && (
                          <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, "ship"); }} className="bg-[#38BDF8] text-[#0F172A] font-semibold px-3 py-1.5 rounded text-xs hover:bg-[#38BDF8]/90 transition-colors flex items-center">
                            <Printer className="w-3 h-3 mr-1.5" /> Print Label (Shippo)
                          </button>
                        )}
                        {(order.status === "Shipped" || order.status === "Delivered" || order.status === "Canceled") && (
                          <span className="text-gray-500 text-sm italic">{order.status === "Canceled" ? "Canceled" : "Completed"}</span>
                        )}
                        {(order.status === "Awaiting Pick" || order.status === "Awaiting Inspection" || order.status === "Awaiting Shipping") && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(order.id, "cancel"); }} 
                            className="text-rose-500/70 hover:text-rose-400 transition-colors p-1.5 rounded hover:bg-rose-500/10"
                            title="Cancel Order"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {expandedOrderId === order.id && (
                    <tr className="bg-[#0F172A]/30">
                      <td colSpan={6} className="p-4 px-8 border-t border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[#1E293B] border border-gray-800 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Order Contents
                            </h4>
                            <div className="space-y-2">
                              {order.line_items.map((item: any, idx: number) => (
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
                              <span className="text-white">${order.total.toFixed(2)}</span>
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
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${order.picked_by ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                <div>
                                  <div className="text-sm font-medium text-white">Picked</div>
                                  <div className="text-xs text-gray-400">{order.picked_by ? `by ${order.picked_by}` : 'Awaiting action'}</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${order.inspected_by ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                <div>
                                  <div className="text-sm font-medium text-white">Inspected & Packed</div>
                                  <div className="text-xs text-gray-400">{order.inspected_by ? `by ${order.inspected_by}` : 'Awaiting action'}</div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${order.shipped_by ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                <div>
                                  <div className="text-sm font-medium text-white">Labeled & Shipped</div>
                                  <div className="text-xs text-gray-400">{order.shipped_by ? `by ${order.shipped_by}` : 'Awaiting action'}</div>
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
              {filteredOrders.length === 0 && (
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
