import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Key,
  MailCheck
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isVisible, setIsVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthText = () => {
    if (password.length === 0) return "";
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (password.length === 0) return "bg-gray-200";
    if (passwordStrength === 0) return "bg-red-500";
    if (passwordStrength === 1) return "bg-orange-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-emerald-500";
    return "bg-green-600";
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    } else if (displayName.length > 50) {
      newErrors.displayName = "Display name must be less than 50 characters";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (passwordStrength < 2) {
      newErrors.password = "Password is too weak. Use a mix of letters, numbers, and symbols";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setLoading(true);

    try {
      const result = await api.post<{ token: string; user: { id: number; email: string; display_name: string; role: string } }>('/auth/signup', {
        email,
        password,
        display_name: displayName,
      });

      api.setToken(result.token);
      toast.success("Account created successfully! 🎉", {
        description: "Welcome to EcoTrack Africa! You're now logged in.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        duration: 4000,
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Signup failed", {
        description: "Please check your information and try again.",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Decorative Pattern */}
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
              Join the movement
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create your account to start protecting Africa's environment
            </p>
          </div>

          {/* Stats Badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Join 6,200+ environmental champions
            </span>
          </div>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 space-y-5"
          aria-label="Signup form"
        >
          {/* Display Name Field */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Name
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                id="displayName"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (errors.displayName) setErrors({ ...errors, displayName: undefined });
                }}
                className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.displayName ? 'border-red-500 focus:ring-red-500/20' : ''
                }`}
                required
              />
            </div>
            {errors.displayName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.displayName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                id="email"
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
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                id="password"
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
                minLength={6}
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Strength: <span className={`font-medium ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                    {getPasswordStrengthText()}
                  </span>
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="relative group">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: undefined });
                }}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                I agree to the{" "}
                <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.terms}
              </p>
            )}
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
                Creating account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign Up
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 transition-colors">
              Log in
            </Link>
          </div>
        </form>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: Shield, text: "Secure Account" },
            { icon: UserCheck, text: "Verified Users" },
            { icon: MailCheck, text: "Email Verified" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-lg p-2 text-center border border-gray-200 dark:border-slate-700">
              <feature.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          By signing up, you agree to receive occasional updates about environmental initiatives
        </div>
      </div>
    </div>
  );
};

export default Signup;