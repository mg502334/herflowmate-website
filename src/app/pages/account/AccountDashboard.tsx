import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { Sparkles, CalendarHeart, Package } from 'lucide-react';
import { Link } from 'react-router';

export function AccountDashboard() {
  const { user } = useCustomerAuth();
  const [profile, setProfile] = useState<{ first_name?: string } | null>(null);

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
          <p className="text-[#2C3E50]/70 mb-4 text-sm">You have no active subscriptions right now.</p>
          <Link to="/shop" className="text-[#2C3E50] font-bold text-sm hover:underline flex items-center gap-1">
            Browse Shop →
          </Link>
        </div>
      </div>
    </div>
  );
}
