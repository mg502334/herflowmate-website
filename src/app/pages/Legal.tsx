import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export function Legal() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("privacy-policy");

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <main className="pt-24 pb-20 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 mt-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-32 flex flex-col gap-2">
              <h3 className="font-bold text-[#2C3E50] mb-4 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Legal Information
              </h3>
              {[
                { id: "privacy-policy", label: "Privacy Policy" },
                { id: "terms-of-service", label: "Terms of Service" },
                { id: "cookie-policy", label: "Cookie Policy" },
                { id: "brand-and-copyright", label: "Brand Trademarks & Copyrights" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${item.id}`);
                  }}
                  className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id 
                      ? "bg-[#F8C8D1]/20 text-[#2C3E50] font-semibold" 
                      : "text-gray-500 hover:text-[#2C3E50] hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-3xl prose prose-slate">
            {/* Privacy Policy */}
            <div id="privacy-policy" className={`scroll-mt-32 ${activeSection === "privacy-policy" ? "block" : "hidden"}`}>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</h1>
              <p className="text-gray-600 mb-8 font-medium">Last updated: June 2026</p>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  At HerFlowMate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or interact with our products and services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">1. Collection of Your Information</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                  <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                  <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
                </ul>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">2. Use of Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and manage your account.</li>
                  <li>Process and deliver your period care products and subscriptions.</li>
                  <li>Email you regarding your account or order.</li>
                  <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                  <li>Offer new products, services, and/or recommendations to you.</li>
                </ul>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">3. Disclosure of Your Information</h2>
                <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                  <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                </ul>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">4. Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">5. Contact Us</h2>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:legal@herflowmate.com" className="text-[#38BDF8] hover:underline">legal@herflowmate.com</a>
                </p>
              </div>
            </div>

            {/* Terms of Service */}
            <div id="terms-of-service" className={`scroll-mt-32 ${activeSection === "terms-of-service" ? "block" : "hidden"}`}>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Terms of Service</h1>
              <p className="text-gray-600 mb-8 font-medium">Last updated: June 2026</p>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  These Terms of Service ("Terms") govern your use of the HerFlowMate website, products, and services. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">1. Subscriptions and Purchasing</h2>
                <p>
                  HerFlowMate offers both one-time purchases and subscription services for period care products. By subscribing to HerFlowMate, you agree to pay the recurring subscription fees at the then-current rate. You may cancel your subscription at any time through your account settings, provided that cancellations must be made at least 48 hours before your next billing cycle to avoid being charged for the upcoming shipment.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">2. Product Descriptions and Quality</h2>
                <p>
                  We strive to describe and display our products as accurately as possible. However, we do not warrant that product descriptions, colors, or other content on the Site are completely accurate, reliable, current, or error-free. If a product offered by HerFlowMate is not as described, your sole remedy is to return it in unused condition in accordance with our Return Policy.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">3. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>
                
                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">4. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of HerFlowMate and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HerFlowMate.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">5. Limitation of Liability</h2>
                <p>
                  In no event shall HerFlowMate, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
                </p>
              </div>
            </div>

            {/* Cookie Policy */}
            <div id="cookie-policy" className={`scroll-mt-32 ${activeSection === "cookie-policy" ? "block" : "hidden"}`}>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Cookie Policy</h1>
              <p className="text-gray-600 mb-8 font-medium">Last updated: June 2026</p>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  This Cookie Policy explains how HerFlowMate ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">1. What Are Cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">2. Why Do We Use Cookies?</h2>
                <p>
                  We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">3. Types of Cookies We Use</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas (e.g., your account dashboard and checkout).</li>
                  <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your quiz results or cart contents) may become unavailable.</li>
                  <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
                  <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.</li>
                </ul>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">4. How Can You Control Cookies?</h2>
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in our cookie consent banner. You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>
              </div>
            </div>
            
            {/* Brand Trademarks & Copyrights */}
            <div id="brand-and-copyright" className={`scroll-mt-32 ${activeSection === "brand-and-copyright" ? "block" : "hidden"}`}>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Brand Trademarks & Copyrights</h1>
              <p className="text-gray-600 mb-8 font-medium">Last updated: June 2026</p>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  HerFlowMate is committed to protecting its intellectual property while respecting the intellectual property rights of others. This section outlines our policies regarding trademarks, copyrights, and the use of our brand assets.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">1. Copyrights</h2>
                <p>
                  All content included on the HerFlowMate website and mobile applications—such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software—is the property of HerFlowMate or its content suppliers and protected by United States and international copyright laws. The compilation of all content on this site is the exclusive property of HerFlowMate.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">2. Trademarks</h2>
                <p>
                  "HerFlowMate," the HerFlowMate crescent logo, "Harmony & Support for Her Cycle," and other related marks, graphics, logos, page headers, button icons, scripts, and service names are trademarks, registered trademarks, or trade dress of HerFlowMate in the U.S. and/or other countries. 
                </p>
                <p>
                  HerFlowMate's trademarks and trade dress may not be used in connection with any product or service that is not HerFlowMate's, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits HerFlowMate.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">3. Use of Brand Assets</h2>
                <p>
                  We are excited when our community wants to share our mission! If you are a member of the press, a partner, or an affiliate wishing to use our brand assets (such as our logo or color palette), please contact us for explicit written permission and to request our official Brand Guidelines package.
                </p>

                <h2 className="text-xl font-bold text-[#2C3E50] mt-8 mb-4">4. Copyright Infringement Claims (DMCA)</h2>
                <p>
                  If you believe that your work has been copied in a way that constitutes copyright infringement, please provide our copyright agent with the written information specified by the Digital Millennium Copyright Act (DMCA). For notices of claims of copyright infringement, please contact us at: <a href="mailto:legal@herflowmate.com" className="text-[#38BDF8] hover:underline">legal@herflowmate.com</a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
