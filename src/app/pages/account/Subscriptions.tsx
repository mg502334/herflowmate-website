import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

export function Subscriptions() {
  const { user } = useCustomerAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setSubscriptions(data);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-[#F8C8D1]/30 p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-[#FDF1F3] rounded-full flex items-center justify-center text-[#F8C8D1]">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">My Subscriptions</h1>
            <p className="text-[#2C3E50]/70 text-sm">Manage your active flow boxes</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading your subscriptions...</div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            You don't have any active subscriptions. <br />
            <Link to="/#products" className="text-[#F8C8D1] font-bold hover:underline mt-2 inline-block">
              Build your custom box →
            </Link>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-[#F8C8D1]/20 p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#2C3E50] text-lg">{sub.plan_name}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#2C3E50]/70">
                    Next billing date: <span className="font-bold">{new Date(sub.current_period_end).toLocaleDateString()}</span>
                  </p>
                </div>
                
                <a 
                  href="mailto:support@herflowmate.com?subject=Manage%20Subscription"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FDF1F3] text-[#2C3E50] text-sm font-bold rounded-full hover:bg-[#F8C8D1]/20 transition-colors"
                >
                  Manage Billing
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
