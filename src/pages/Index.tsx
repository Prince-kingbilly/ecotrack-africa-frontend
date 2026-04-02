import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import StatCard from "@/components/StatCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-africa.jpg";
import {
  Trash2,
  TreePine,
  Droplets,
  Globe,
  MapPin,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Leaf,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Play,
  Award,
  Zap,
  Heart,
  Camera,
  Upload,
  ChevronRight,
  Cloud,
  Sun,
  Wind,
} from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Amina O.",
      role: "Community Leader, Kenya",
      content: "This platform has transformed how our community manages waste. We've seen a 40% reduction in illegal dumping sites!",
      avatar: "👩🏿‍🌾",
      rating: 5,
    },
    {
      name: "Kwame A.",
      role: "Environmental Activist, Ghana",
      content: "The tree planting tracker helped us organize and monitor our reforestation efforts. Over 5,000 trees planted and counting!",
      avatar: "🌳",
      rating: 5,
    },
    {
      name: "Grace M.",
      role: "Local Authority, Rwanda",
      content: "Real-time reporting has made our response time 3x faster. A game-changer for environmental management.",
      avatar: "⭐",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Hero Section with Enhanced Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="African landscape with lush green hills and a winding river"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container relative z-10 pt-20">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm text-white mb-8 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Sparkles className="w-4 h-4 animate-pulse" />
              {/* <span>Powered by AI & Community Action</span> */}
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span>Live in 12 Countries</span>
            </div>

            <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Smart, Community-Powered
              <span className="block bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                Environmental
              </span>
              Management
            </h1>

            <p className={`text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Monitor waste, track tree planting, report pollution, and drive change — all from one platform built for Africa, by Africa.
            </p>

            <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Link to="/report">
                <Button variant="hero" size="lg" className="gap-2 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Report an Issue <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="hero-outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  View Dashboard
                </Button>
              </Link>
              <button className="group flex items-center gap-2 text-white hover:text-emerald-400 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                  <Play className="w-4 h-4" />
                </div>
                <span className="text-sm">Watch Demo</span>
              </button>
            </div>

            {/* Stats Preview */}
            <div className={`grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20 transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

              
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <StatCard
                icon={<MapPin className="w-6 h-6" />}
                value="12,400+"
                label="Reports Filed"
                color="green"
                trend="+23%"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <StatCard
                icon={<TreePine className="w-6 h-6" />}
                value="85,000+"
                label="Trees Planted"
                color="amber"
                trend="+18%"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <StatCard
                icon={<Users className="w-6 h-6" />}
                value="6,200+"
                label="Active Citizens"
                color="sky"
                trend="+32%"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <StatCard
                icon={<Globe className="w-6 h-6" />}
                value="12"
                label="Countries Active"
                color="earth"
                trend="+2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-4 py-1.5 text-sm text-emerald-600 dark:text-emerald-400 mb-4">
              <Leaf className="w-4 h-4" />
              Our Approach
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Four Pillars of <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Environmental Action</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A comprehensive platform tackling waste, deforestation, pollution, and cross-border environmental challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <FeatureCard
                icon={<Trash2 className="w-7 h-7" />}
                title="Waste Management"
                description="Report waste with photos & GPS. Track collection, find bins, and earn rewards for keeping communities clean."
                delay={0}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <FeatureCard
                icon={<TreePine className="w-7 h-7" />}
                title="Tree Planting Tracker"
                description="Record planted trees, track their growth, calculate CO₂ impact, and compete on community leaderboards."
                delay={100}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <FeatureCard
                icon={<Droplets className="w-7 h-7" />}
                title="Pollution Reporting"
                description="Report air, water, and noise pollution. Real-time mapping with heatmaps and authority case management."
                delay={200}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <FeatureCard
                icon={<Globe className="w-7 h-7" />}
                title="Multi-Country Intelligence"
                description="Country-adapted services, multi-language support, and a global ranking system across African nations."
                delay={300}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Enhanced with Icons */}
      <section className="py-24 bg-gradient-to-b from-card to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-1.5 text-sm text-blue-600 dark:text-blue-400 mb-4">
              <Zap className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to make an environmental impact in your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Report", desc: "Snap a photo, drop a pin — report waste, pollution, or plant a tree.", icon: Camera, color: "emerald" },
              { step: "02", title: "Track", desc: "Monitor reports in real-time. Watch your impact grow on live dashboards.", icon: TrendingUp, color: "blue" },
              { step: "03", title: "Impact", desc: "Earn badges, climb leaderboards, and drive real change across Africa.", icon: Award, color: "amber" },
            ].map((item, idx) => (
              <div key={item.step} className="group relative text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-display text-2xl font-bold mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-sm font-bold text-emerald-600">
                    {item.step}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-emerald-500/50 to-emerald-500/0">
                    <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-System Features - Enhanced */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 text-sm text-purple-600 dark:text-purple-400 mb-4">
              <Sparkles className="w-4 h-4" />
              Advanced Capabilities
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Scale & Impact
            </h2>
            <p className="text-muted-foreground">
              Enterprise-grade features designed for environmental management at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Role-Based Access", desc: "Citizen, Admin, and Authority roles with tailored permissions.", color: "emerald" },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics Dashboard", desc: "Real-time charts, hotspot tracking, and performance reports.", color: "blue" },
              { icon: <MapPin className="w-6 h-6" />, title: "Smart Location", desc: "GPS auto-detection, heatmaps, and nearest bin finder.", color: "amber" },
              { icon: <Heart className="w-6 h-6" />, title: "Community Engagement", desc: "Likes, comments, reputation points, and eco-hero badges.", color: "rose" },
            ].map((item, i) => (
              <div key={i} className="group bg-card rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`text-${item.color}-500 mb-4 transform transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2 text-lg">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 rounded-full px-4 py-1.5 text-sm text-amber-600 dark:text-amber-400 mb-4">
              <Heart className="w-4 h-4" />
              Success Stories
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Communities Across Africa
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-500 ${activeTestimonial === idx ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-10 pointer-events-none'}`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{testimonial.avatar}</div>
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <CheckCircle2 key={i} className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                    <p className="text-lg text-foreground italic mb-6">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === idx ? 'w-6 bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Protect Africa's Environment?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Join thousands of citizens across Africa making a difference every day.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/report">
              <Button variant="hero" size="lg" className="gap-2 bg-white text-emerald-600 hover:bg-white/90">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="hero-outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;