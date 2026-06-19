import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { Save, User, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export function AccountDetails() {
  const { user } = useCustomerAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data && !error) {
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setPhone(data.phone || '');
      setStreet(data.shipping_street || '');
      setCity(data.shipping_city || '');
      setState(data.shipping_state || '');
      setZip(data.shipping_zip || '');
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage('');
    
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        shipping_street: street,
        shipping_city: city,
        shipping_state: state,
        shipping_zip: zip,
      })
      .eq('id', user.id);

    setSaving(false);
    
    if (error) {
      setMessage('Error saving profile. Please try again.');
      console.error(error);
    } else {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleStripeRedirect = () => {
    // In a real app, this would hit an API endpoint that generates a Stripe Customer Portal session URL and redirects to it.
    // Since we are mocking the frontend, we will just alert the user.
    alert("Redirecting to the secure Stripe Customer Portal... (Mock)");
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your profile...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2C3E50] font-serif mb-2">Account Details</h1>
        <p className="text-gray-500">Manage your personal information, shipping address, and secure billing settings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile & Shipping Forms */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            
            <div className="flex items-center gap-3 mb-6 text-[#2C3E50]">
              <User className="text-[#F8C8D1]" size={24} />
              <h2 className="text-xl font-bold font-serif">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-100 text-[#2C3E50]">
              <MapPin className="text-[#F8C8D1]" size={24} />
              <h2 className="text-xl font-bold font-serif">Shipping Address</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-600 mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">ZIP</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              {message && (
                <div className={`text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={saving}
                className="ml-auto flex items-center gap-2 bg-[#2C3E50] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a2530] transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Col: Stripe Billing Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-[#F8C8D1]/30 sticky top-28">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#F8C8D1] mb-6 shadow-sm border border-gray-100">
              <CreditCard size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-[#2C3E50] font-serif mb-2">Billing & Payment</h2>
            <p className="text-gray-500 text-sm mb-6">
              Manage your saved cards, update billing addresses, and view your subscription history securely via Stripe.
            </p>

            <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 flex items-start gap-3">
              <ShieldCheck className="text-green-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong className="text-[#2C3E50] block mb-1">Bank-Level Security</strong>
                For your ultimate privacy and protection, HerFlowMate never touches or stores your credit card data. All payments are securely vaulted directly by Stripe.
              </p>
            </div>

            <button 
              onClick={handleStripeRedirect}
              className="w-full py-4 bg-[#635BFF] hover:bg-[#524be3] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#635BFF]/20"
            >
              Manage in Stripe Portal
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
