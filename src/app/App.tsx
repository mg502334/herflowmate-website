import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./components/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import { QuizModal } from "./components/QuizModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Routes, Route, useLocation } from "react-router";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Mission } from "./pages/Mission";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Legal } from "./pages/Legal";

import { useEffect } from "react";

import { AdminLayout } from "./admin/AdminLayout";
import { InventoryPage } from "./admin/InventoryPage";
import { PriceAnalysisPage } from "./admin/PriceAnalysisPage";
import { PurchasesPage } from "./admin/PurchasesPage";
import { ShipmentsPage } from "./admin/ShipmentsPage";
import { PriceRequestsPage } from "./admin/PriceRequestsPage";
import { PricingStrategyPage } from "./admin/PricingStrategyPage";
import { InboxPage } from "./admin/InboxPage";
import { LoginPage } from "./admin/LoginPage";
import { AdminAuthProvider } from "./admin/AdminAuthContext";
import { AuthGuard } from "./admin/AuthGuard";

import { CustomerAuthProvider } from "./components/CustomerAuthContext";
import { CustomerProtectedRoute } from "./components/CustomerProtectedRoute";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { AccountLayout } from "./pages/account/AccountLayout";
import { AccountDashboard } from "./pages/account/AccountDashboard";
import { PeriodTracker } from "./pages/account/PeriodTracker";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");


  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("Order Confirmed! Thank you for choosing HerFlowMate. Your flow is fully covered!");
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (query.get("canceled")) {
      alert("Order canceled. Your cart is still waiting for you when you're ready.");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [location.pathname]);

  return (
    <CartProvider>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <div className={`min-h-screen ${isAdminRoute ? 'bg-[#0F172A]' : 'bg-[#FAFAFA]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {!isAdminRoute && <Navbar />}
          
          <Routes>
            {/* Main Store Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/legal" element={<Legal />} />

            {/* Customer Auth & Account Routes */}
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            
            <Route path="/account" element={<CustomerProtectedRoute />}>
              <Route element={<AccountLayout />}>
                <Route index element={<AccountDashboard />} />
                <Route path="tracker" element={<PeriodTracker />} />
              </Route>
            </Route>

            {/* Admin Login Route (Unprotected) */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AuthGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<div className="text-white text-center py-20"><h2 className="text-4xl font-bold mb-4">Welcome to HerFlowMate Admin</h2><p className="text-gray-400">Select an option from the sidebar to manage your store.</p></div>} />
                <Route path="purchases" element={<PurchasesPage />} />
                <Route path="shipments" element={<ShipmentsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="prices" element={<PriceAnalysisPage />} />
                <Route path="price-requests" element={<PriceRequestsPage />} />
                <Route path="pricing-strategy" element={<PricingStrategyPage />} />
              </Route>
            </Route>
          </Routes>

          {!isAdminRoute && <Footer />}
          
          {/* Modals & Slide-overs */}
          {!isAdminRoute && <CartDrawer />}
          {!isAdminRoute && <QuizModal />}
        </div>
        <Analytics />
        <SpeedInsights />
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </CartProvider>
  );
}
