import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { supabase } from '../../../lib/supabase';
import { CalendarHeart, LayoutDashboard, LogOut, Package, User } from 'lucide-react';

export function AccountLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/account', icon: LayoutDashboard },
    { name: 'Account Details', path: '/account/details', icon: User },
    { name: 'Subscriptions', path: '/account/subscriptions', icon: Package },
    { name: 'Flow Companion', path: '/account/tracker', icon: CalendarHeart },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen mt-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-[#F8C8D1]/30 p-4 sticky top-28">
            <h2 className="text-lg font-bold text-[#2C3E50] mb-4 px-3">My Account</h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#FDF1F3] text-[#2C3E50] font-bold'
                        : 'text-[#2C3E50]/70 hover:bg-gray-50 hover:text-[#2C3E50]'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-[#F8C8D1]' : 'text-gray-400'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
