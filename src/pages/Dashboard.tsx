import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import WasteMap from "@/components/WasteMap";
import {
  MapPin,
  TreePine,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Leaf,
  Droplets,
  Factory,
  Award,
  Shield,
  Activity,
  RefreshCw,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
} from "lucide-react";

const recentReports = [
  { 
    id: 1, 
    type: "Waste", 
    location: "Kigali, Rwanda", 
    status: "Open", 
    time: "2 hours ago",
    icon: <Factory className="w-4 h-4" />,
    priority: "high",
  },
  { 
    id: 2, 
    type: "Pollution", 
    location: "Nairobi, Kenya", 
    status: "Investigating", 
    time: "5 hours ago",
    icon: <Droplets className="w-4 h-4" />,
    priority: "medium",
  },
  { 
    id: 3, 
    type: "Tree Planted", 
    location: "Accra, Ghana", 
    status: "Verified", 
    time: "1 day ago",
    icon: <Leaf className="w-4 h-4" />,
    priority: "low",
  },
  { 
    id: 4, 
    type: "Waste", 
    location: "Lagos, Nigeria", 
    status: "Resolved", 
    time: "1 day ago",
    icon: <Factory className="w-4 h-4" />,
    priority: "medium",
  },
  { 
    id: 5, 
    type: "Pollution", 
    location: "Dar es Salaam, Tanzania", 
    status: "Open", 
    time: "2 days ago",
    icon: <Droplets className="w-4 h-4" />,
    priority: "high",
  },
];

const statusStyles: Record<string, string> = {
  Open: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Investigating: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Verified: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Resolved: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  Open: <Clock className="w-3.5 h-3.5" />,
  Investigating: <TrendingUp className="w-3.5 h-3.5" />,
  Verified: <CheckCircle className="w-3.5 h-3.5" />,
  Resolved: <CheckCircle className="w-3.5 h-3.5" />,
};

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 border-red-500/20 text-red-600",
  medium: "bg-orange-500/10 border-orange-500/20 text-orange-600",
  low: "bg-green-500/10 border-green-500/20 text-green-600",
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Section with Animation */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Live Environmental Monitor</span>
                </div>
                <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Environmental Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                  Real-time insights and analytics for environmental conservation across Africa
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                >
                  <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Refresh</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full relative"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
            {["overview", "analytics", "reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats Grid with Hover Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <StatCard 
                icon={<MapPin className="w-6 h-6" />} 
                value="12,400+" 
                label="Total Reports" 
                color="green" 
                trend="+12%"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <StatCard 
                icon={<TreePine className="w-6 h-6" />} 
                value="85,000+" 
                label="Trees Planted" 
                color="amber" 
                trend="+8%"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <StatCard 
                icon={<Users className="w-6 h-6" />} 
                value="6,200+" 
                label="Active Users" 
                color="sky" 
                trend="+23%"
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <StatCard 
                icon={<AlertTriangle className="w-6 h-6" />} 
                value="340" 
                label="Open Issues" 
                color="earth" 
                trend="-5%"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Section with Enhanced Design */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-semibold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Environmental Map
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Real-time reports and monitoring across Africa
                      </p>
                    </div>
                    <button className="group text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-all duration-200 hover:gap-2">
                      View Full Map
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 relative">
                  <WasteMap />
                  {/* Overlay gradient for better text visibility */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs">
                    <span className="font-semibold">Active Reports:</span> 156
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reports with Enhanced Interactions */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-500">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-semibold text-slate-900 dark:text-white text-xl">
                        Recent Activity
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Latest environmental reports
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                  {recentReports.map((report, index) => (
                    <div 
                      key={report.id} 
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group relative"
                      onMouseEnter={() => setHoveredCard(report.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-xl transition-all duration-200 ${
                            report.type === "Waste" ? "bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50" :
                            report.type === "Pollution" ? "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50" :
                            "bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50"
                          }`}>
                            {report.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {report.type}
                              </div>
                              <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border transition-all duration-200 ${statusStyles[report.status]} ${hoveredCard === report.id ? 'scale-105' : ''}`}>
                                {statusIcons[report.status]}
                                {report.status}
                              </div>
                              <div className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium border ${priorityColors[report.priority]}`}>
                                {report.priority}
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {report.location}
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              {report.time}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-all duration-200 ${hoveredCard === report.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Country Rankings with Enhanced Visuals */}
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-semibold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-500" />
                      Country Environmental Rankings
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Based on environmental performance and sustainability metrics
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { country: "Rwanda", score: 92, trees: "24,500", reports: "3,200", change: "+5%", flag: "🇷🇼", trend: "up", description: "Leading in green initiatives" },
                    { country: "Kenya", score: 85, trees: "18,300", reports: "4,100", change: "+3%", flag: "🇰🇪", trend: "up", description: "Strong renewable energy push" },
                    { country: "Ghana", score: 78, trees: "12,000", reports: "2,800", change: "+8%", flag: "🇬🇭", trend: "up", description: "Fastest improving" },
                  ].map((c, i) => (
                    <div 
                      key={c.country} 
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 p-5 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-display font-bold text-2xl shadow-lg">
                            #{i + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{c.flag}</span>
                              <div className="font-bold text-slate-900 dark:text-white text-xl">
                                {c.country}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center transition-all group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trees Planted</div>
                            <div className="font-bold text-slate-900 dark:text-white text-lg">{c.trees}</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center transition-all group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reports</div>
                            <div className="font-bold text-slate-900 dark:text-white text-lg">{c.reports}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Environmental Score</div>
                          <div className="flex items-center gap-2">
                            <div className="font-display font-bold text-emerald-600 dark:text-emerald-400 text-3xl">
                              {c.score}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                              <TrendingUp className="w-3 h-3" />
                              {c.change}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                              style={{ width: `${c.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;