import React, { useEffect, useState } from "react";
import { useProducts } from "../data/useProducts";
import { useAdminAuth } from "./AdminAuthContext";
import { Check, X, ClipboardList, Edit2 } from "lucide-react";
import { EditPriceModal } from "./EditPriceModal";

export function PriceRequestsPage() {
  const { role } = useAdminAuth();
  const { fetchPriceRequests, approvePriceRequest, rejectPriceRequest } = useProducts();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReq, setEditingReq] = useState<any | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchPriceRequests();
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      loadRequests();
    }
  }, [role]);

  const handleApprove = async (req: any, customPrice?: number) => {
    try {
      const priceToSet = customPrice !== undefined ? customPrice : req.requested_price;
      await approvePriceRequest(req.id, req.products.id, priceToSet);
      loadRequests();
    } catch (err) {
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (req: any) => {
    try {
      await rejectPriceRequest(req.id);
      loadRequests();
    } catch (err) {
      alert("Failed to reject request.");
    }
  };

  if (role !== 'admin') {
    return <div className="p-10 text-center text-red-400">Access Denied. Admins only.</div>;
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading price requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <ClipboardList className="w-8 h-8 mr-3 text-[#38BDF8]" />
          Price Requests
        </h1>
      </div>

      <EditPriceModal 
        isOpen={!!editingReq} 
        onClose={() => setEditingReq(null)} 
        req={editingReq} 
        onSave={(req, newPrice) => handleApprove(req, newPrice)} 
      />

      <div className="bg-[#1E293B] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0F172A]/50 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold text-gray-400">Date</th>
                <th className="p-4 font-semibold text-gray-400">Requested By</th>
                <th className="p-4 font-semibold text-gray-400">Product</th>
                <th className="p-4 font-semibold text-gray-400">Current Price</th>
                <th className="p-4 font-semibold text-gray-400">Requested Price</th>
                <th className="p-4 font-semibold text-gray-400">Status</th>
                <th className="p-4 font-semibold text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-300 text-sm">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-300 text-sm">
                    {req.profiles?.email || 'Unknown User'}
                  </td>
                  <td className="p-4 font-medium">
                    {req.products?.name}
                    <div className="text-xs text-gray-500">{req.products?.sku}</div>
                  </td>
                  <td className="p-4 text-gray-400">
                    ${req.products?.price?.toFixed(2)}
                  </td>
                  <td className="p-4 text-[#38BDF8] font-bold">
                    ${req.requested_price?.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleReject(req)}
                          className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Reject (Keep Current Price)"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setEditingReq(req)}
                          className="p-1.5 rounded-md hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit (Approve with Custom Price)"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleApprove(req)}
                          className="p-1.5 rounded-md hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-colors"
                          title="Approve Suggested Price"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">-</div>
                    )}
                  </td>
                </tr>
              ))}
              
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No price requests found.
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
