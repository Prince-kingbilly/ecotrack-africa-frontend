import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Leaf, 
  Globe, 
  Users, 
  BarChart3, 
  TreePine, 
  Droplets, 
  Trash2,
  Sparkles,
  Target,
  Lightbulb,
  Heart,
  Award,
  MapPin,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  Eye,
  Clock,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("mission");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const milestones = [
    { year: "2024", event: "Platform Launch", icon: Rocket, description: "Launched in 5 African countries" },
    { year: "2024", event: "10,000 Reports", icon: Target, description: "First major milestone achieved" },
    { year: "2025", event: "AI Integration", icon: Zap, description: "AI-powered waste classification" },
    { year: "2025", event: "85,000 Trees", icon: TreePine, description: "Trees planted across Africa" },
  ];

  const teamStats = [
    { label: "Active Users", value: "6,200+", icon: Users, color: "emerald" },
    { label: "Countries", value: "12", icon: Globe, color: "blue" },
    { label: "Reports Filed", value: "12,400+", icon: BarChart3, color: "amber" },
    { label: "Trees Planted", value: "85,000+", icon: TreePine, color: "green" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 mb-6">
              <Leaf className="w-4 h-4" />
              <span>Our Story</span>
              <Sparkles className="w-3 h-3" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-400 bg-clip-text text-transparent mb-6">
              Protecting Africa's Environment
              <br />
              Through Technology
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              EcoTrack Africa is a community-powered platform designed to monitor, report, 
              and solve environmental challenges across the continent using modern technology 
              and collective action.
            </p>
          </div>

          {/* Team Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {teamStats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 mb-3`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Problem Section */}
          <div className={`bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-12 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  The Challenge
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Across Africa, environmental issues like waste management, deforestation, and pollution 
                are growing concerns. Citizens lack simple tools to report problems, while governments 
                struggle with unified data across countries.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Trash2, text: "Citizens lack simple tools to report waste or pollution", color: "amber" },
                  { icon: BarChart3, text: "Governments lack unified cross-country environmental data", color: "blue" },
                  { icon: Globe, text: "No centralized platform for tracking activities across Africa", color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className="group flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300">
                    <div className="text-primary mt-0.5 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision Tabs */}
          <div className={`mb-12 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
              {[
                { id: "mission", label: "Our Mission", icon: Target },
                { id: "vision", label: "Our Vision", icon: Eye },
                { id: "values", label: "Our Values", icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-10">
              {activeTab === "mission" && (
                <div className="text-center">
                  <Target className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Our Mission
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    To empower African communities with technology that enables effective environmental 
                    monitoring, reporting, and action, creating a cleaner, greener, and more sustainable 
                    continent for future generations.
                  </p>
                </div>
              )}
              
              {activeTab === "vision" && (
                <div className="text-center">
                  <Eye className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    A future where every African citizen is an environmental steward, equipped with 
                    the tools and knowledge to protect their environment, and where data-driven 
                    decisions lead to sustainable development across the continent.
                  </p>
                </div>
              )}
              
              {activeTab === "values" && (
                <div>
                  <Heart className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
                    Our Values
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: Users, title: "Community First", desc: "Putting communities at the heart of environmental action" },
                      { icon: Shield, title: "Transparency", desc: "Open data and honest reporting for accountability" },
                      { icon: Zap, title: "Innovation", desc: "Leveraging technology for environmental solutions" },
                      { icon: Heart, title: "Sustainability", desc: "Long-term thinking for lasting impact" },
                    ].map((value, idx) => (
                      <div key={idx} className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <value.icon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{value.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{value.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Objectives */}
          <div className={`bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-12 transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  Our Objectives
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Integrate waste management, tree planting tracking, and pollution reporting in one platform",
                  "Enable active citizen participation in environmental protection",
                  "Support government decision-making through data-driven insights",
                  "Educate and raise environmental awareness among communities",
                  "Provide country-adapted services with multi-language support",
                ].map((obj, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{obj}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Innovation Section */}
          <div className={`bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="p-8 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-bold">What Makes Us Unique</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Globe, label: "All-in-one environmental platform" },
                  { icon: Zap, label: "AI + community validation for accuracy" },
                  { icon: Award, label: "Gamification & rewards to boost engagement" },
                  { icon: MapPin, label: "Multi-country adaptability across Africa" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className={`mb-12 transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Our Journey
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Key milestones in our mission to protect Africa's environment
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 text-center border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {milestone.year}
                  </div>
                  <div className="mt-4">
                    <milestone.icon className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
                      {milestone.event}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={`text-center transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Join Our Mission
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
                Be part of the movement to protect Africa's environment. Together, we can make a difference.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/report">
                  <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 gap-2">
                    Report an Issue <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="gap-2">
                    Join Community <Users className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Add missing icons
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const Rocket = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c0 0-1.05.17-2 0 0 0 1.03-1.94 3-3 0 0 2.14.03 4 .5"/><path d="M12 15v5s3.03-.55 4-2c0 0-.17 1.05 0 2 0 0 1.94-1.03 3-3"/></svg>;

export default About;