import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, User, Lock, LogIn } from "lucide-react";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, user, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  useEffect(() => {
    if (user && isAdmin()) {
      navigate("/admin/dashboard");
    }
  }, [user, isAdmin, navigate]);

  // Create admin user if it doesn't exist (for development)
  const createAdminUserIfNeeded = async (authUser: any) => {
    try {
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Admin user doesn't exist, create one
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            role: 'admin'
          });

        if (insertError) {
          console.error('Error creating admin user:', insertError);
        }
      }
    } catch (error) {
      console.error('Error checking/creating admin user:', error);
    }
  };
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        toast.error(authError.message || "Login failed");
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Create admin user record if it doesn't exist
        await createAdminUserIfNeeded(authData.user);
        
        // Small delay to ensure admin user is created
        setTimeout(() => {
          toast.success("Login successful!");
          navigate("/admin/dashboard");
        }, 500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback method using the existing auth context
  const handleFallbackSubmit = async () => {
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6"
          >
            <Shield className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Secure access to Saffari admin dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link
            to="/admin/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot your password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
