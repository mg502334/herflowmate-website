import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { Sparkles, CalendarHeart, Package, Truck, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useOrders, OrderStatus } from '../../data/useOrders';

export function AccountDashboard() {
  const { user } = useCustomerAuth();
  const [profile, setProfile] = useState<{ first_name?: string } | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders(user?.id);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
        
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .then(({ data }) => {
          if (data) setSubscriptions(data);
        });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#F8C8D1]/30 p-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2 flex items-center gap-3">
          Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''} <Sparkles className="text-[#F8C8D1]" />
        </h1>
        <p className="text-[#2C3E50]/70">
          Manage your flow, subscriptions, and account details here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#FDF1F3] to-[#F8C8D1]/20 rounded-2xl p-6 border border-[#F8C8D1]/30">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 text-[#F8C8D1] shadow-sm">
            <CalendarHeart size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#2C3E50] mb-2">The Flow Companion</h3>
          <p className="text-[#2C3E50]/70 mb-4 text-sm">Log your flow and predict your next cycle with ease.</p>
          <Link to="/account/tracker" className="text-[#2C3E50] font-bold text-sm hover:underline flex items-center gap-1">
            Open Tracker →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-[#2C3E50] shadow-sm">
            <Package size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#2C3E50] mb-2">My Subscriptions</h3>
          {subscriptions.length > 0 ? (
            <div className="flex flex-col gap-3 mb-4">
              {subscriptions.map(sub => (
                <div key={sub.id} className="p-3 bg-[#FDF1F3] rounded-xl border border-[#F8C8D1]/30 text-sm">
                  <div className="font-bold text-[#2C3E50]">{sub.plan_name}</div>
                  <div className="text-xs text-[#2C3E50]/70 mt-0.5">Renews: {new Date(sub.current_period_end).toLocaleDateString()}</div>
                </div>
              ))}
              <a href="mailto:support@herflowmate.com?subject=Manage%20Subscription" className="text-[#2C3E50] font-bold text-xs hover:underline mt-2">
                Manage / Cancel Subscription →
              </a>
            </div>
          ) : (
            <p className="text-[#2C3E50]/70 mb-4 text-sm">You have no active subscriptions right now.</p>
          )}
          <Link to="/#products" className="text-[#2C3E50] font-bold text-sm hover:underline flex items-center gap-1">
            Build a Custom Box →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-[#2C3E50] shadow-sm">
          <Truck size={24} />
        </div>
        <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Recent Orders</h3>
        {ordersLoading ? (
          <p className="text-[#2C3E50]/70 text-sm">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-[#2C3E50]">{order.display_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-[#2C3E50]/70">Ordered: {new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="text-sm font-medium text-[#2C3E50] mt-2">${order.total.toFixed(2)} • {order.items_count} items</div>
                </div>
                
                <div className="flex items-center">
                  {(order.status === 'Awaiting Pick' || order.status === 'Awaiting Inspection' || order.status === 'Awaiting Shipping') && (
                    <button 
                      onClick={async () => {
                        const confirm = window.confirm('Are you sure you want to cancel this order?');
                        if (confirm) {
                          try {
                            await updateOrderStatus(order.id, 'Canceled');
                            alert('Order canceled successfully.');
                          } catch (err: any) {
                            alert('Failed to cancel: ' + err.message);
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  )}
                  {order.tracking && (
                    <div className="text-sm text-gray-500">
                      Tracking: <span className="font-mono text-[#2C3E50]">{order.tracking}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#2C3E50]/70 text-sm mb-4">You have no recent orders.</p>
        )}
      </div>
    </div>
  );
}
