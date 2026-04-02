import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Leaf, Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    
    setEmailError("");
    setLoading(true);

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (supabaseError) throw supabaseError;
      
      setSent(true);
      toast.success("Reset link sent! Check your email inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="relative">
                <Leaf className="h-8 w-8 text-primary transition-transform group-hover:scale-110 duration-300" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                EcoTrack Africa
              </span>
            </Link>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl font-bold text-foreground"
          >
            Reset password
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-2"
          >
            We'll send you a secure link to reset it
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl shadow-lg border border-border/50 p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-500" />
              </motion.div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Check your email
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setSent(false)}
                >
                  Try another email
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleReset}
              className="bg-card rounded-xl shadow-lg border border-border/50 p-6 space-y-5"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`pl-10 transition-all duration-200 ${
                      emailError 
                        ? "border-red-500 focus-visible:ring-red-500" 
                        : "focus-visible:ring-primary"
                    }`}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-500 mt-1"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full group relative overflow-hidden"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </span>
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Link to="/login">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full group"
                  disabled={loading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to login
                </Button>
              </Link>

              {/* Help Text */}
              <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Additional Help */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Having trouble?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;