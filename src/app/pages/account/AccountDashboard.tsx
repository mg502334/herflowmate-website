import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { Sparkles, CalendarHeart, Package } from 'lucide-react';
import { Link } from 'react-router';

export function AccountDashboard() {
  const { user } = useCustomerAuth();
  const [profile, setProfile] = useState<{ first_name?: string } | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

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
    </div>
  );
}
