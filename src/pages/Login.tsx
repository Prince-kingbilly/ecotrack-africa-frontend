import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Leaf, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  Shield,
  Globe,
  TreePine,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Load saved email if remember me was checked
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      toast.success("Welcome back! 🎉", {
        description: "You've successfully logged in to EcoTrack Africa",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid credentials", {
        description: "Please check your email and password and try again.",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset link sent!", {
      description: "If an account exists with this email, you'll receive reset instructions.",
    });
  };

  const demoCredentials = () => {
    setEmail("demo@ecotrack.com");
    setPassword("demo123");
    toast.info("Demo credentials loaded", {
      description: "Click login to explore the platform",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Decorative Pattern - Simplified without SVG data URL */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent dark:from-emerald-900/10"></div>

      <div className={`w-full max-w-md relative z-10 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              EcoTrack Africa
            </span>
          </Link>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Log in to continue tracking environmental impact across Africa
            </p>
          </div>

          {/* Stats Badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Join 6,200+ active environmental champions
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
          aria-label="Login form"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.email ? 'border-red-500 focus:ring-red-500/20' : ''
                }`}
                required
                autoComplete="email"
                aria-required
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.password ? 'border-red-500 focus:ring-red-500/20' : ''
                }`}
                required
                autoComplete="current-password"
                aria-required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                Remember me
              </span>
            </label>
            
            <button
              type="button"
              onClick={demoCredentials}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium transition-colors"
            >
              Use demo credentials
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Log In
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 transition-colors">
              Sign up for free
            </Link>
          </div>
        </form>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: Shield, text: "Secure Access" },
            { icon: Globe, text: "12 Countries" },
            { icon: TreePine, text: "85K+ Trees" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-lg p-2 text-center border border-gray-200 dark:border-slate-700">
              <feature.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Terms Link */}
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          By continuing you agree to our{" "}
          <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;