import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../admin/AdminAuthContext';
import { useCustomerAuth } from '../components/CustomerAuthContext';

export type OrderStatus = "Awaiting Pick" | "Awaiting Inspection" | "Awaiting Shipping" | "Shipped" | "Delivered" | "Canceled";

export interface Order {
  id: string; // The UUID from DB
  display_id: string; // e.g. ORD-1045
  user_id: string | null;
  customer_name: string;
  created_at: string;
  shipped_date?: string | null;
  status: OrderStatus;
  method: string;
  items_count: number;
  total: number;
  tracking?: string | null;
  line_items: { name: string; qty: number; price: number }[];
  picked_by?: string | null;
  inspected_by?: string | null;
  shipped_by?: string | null;
}

export function useOrders(filterByUserId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterByUserId) {
        query = query.eq('user_id', filterByUserId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data as Order[]);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterByUserId]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, additionalData?: any) => {
    try {
      const updateData = { status: newStatus, ...additionalData };
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      // Simulated Automated Email Trigger
      if (newStatus === "Shipped") {
        const orderToUpdate = orders.find(o => o.id === orderId);
        if (orderToUpdate) {
          console.log(`[EMAIL TRIGGER] Sending 'Order Shipped' email to ${orderToUpdate.customer_name}...`);
          if (additionalData?.tracking) {
            console.log(`[EMAIL TRIGGER] Included Tracking Number: ${additionalData.tracking}`);
          }
          // Note: In production, this would call a Supabase Edge Function or Vercel API Route
          // fetch('/api/send-shipping-email', { method: 'POST', body: JSON.stringify(...) });
          alert(`Automated Shipping Email Sent to ${orderToUpdate.customer_name}!`);
        }
      }

      setOrders(current => 
        current.map(o => o.id === orderId ? { ...o, ...updateData } : o)
      );
    } catch (err: any) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  return { orders, loading, error, fetchOrders, updateOrderStatus };
}
