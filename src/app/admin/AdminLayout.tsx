import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Package, DollarSign, LogOut, ArrowLeft, ClipboardList, Truck, Inbox, Target, Settings, TrendingUp } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { useStoreSettings } from "../data/useStoreSettings";
import logoWhite from "../../assets/herflowmate-logo-white.png";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useAdminAuth();
  const { settings } = useStoreSettings();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Purchasing", path: "/admin/purchases", icon: Truck },
    { name: "Shipments", path: "/admin/shipments", icon: Package },
    { name: "Inventory", path: "/admin/inventory", icon: ClipboardList },
    { name: "Inbox", path: "/admin/inbox", icon: Inbox },
    { name: "Analytics", path: "/admin/analytics", icon: TrendingUp },
  ];

  if (role === 'admin') {
    navItems.push({ name: "Price Breakdown", path: "/admin/prices", icon: DollarSign });
    navItems.push({ name: "Price Requests", path: "/admin/price-requests", icon: ClipboardList });
    navItems.push({ name: "Pricing Strategy", path: "/admin/pricing-strategy", icon: Target });
    navItems.push({ name: "Settings", path: "/admin/settings", icon: Settings });
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E293B] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Link>
          <div className="flex flex-col items-start gap-3">
            <img 
              src={settings?.business_logo_url || logoWhite} 
              alt="HerFlowMate" 
              className="w-48 h-auto object-contain" 
            />
            <span className="text-xl font-bold tracking-tight text-[#38BDF8]">Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#38BDF8] text-[#0F172A] font-semibold shadow-lg shadow-[#38BDF8]/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-[#0F172A]" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
