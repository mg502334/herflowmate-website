import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Supabase handles the session via AdminAuthContext onAuthStateChange
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4">
      {/* Absolute back button */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </Link>
      </div>

      <div className="w-full max-w-md relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#38BDF8] blur-[100px] opacity-20 rounded-full"></div>

        <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-gray-800">
              <Lock className="w-8 h-8 text-[#38BDF8]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">HerFlowMate</h1>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="admin@herflowmate.com"
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="Enter password"
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] font-bold rounded-xl px-4 py-3 mt-4 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-[#38BDF8]/20 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Protected Area. Authorized personnel only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
