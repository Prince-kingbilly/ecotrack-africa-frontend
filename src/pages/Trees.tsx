import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Camera, 
  MapPin, 
  Upload, 
  TreePine, 
  Leaf, 
  TrendingUp, 
  Award,
  Sparkles,
  Send,
  X,
  Navigation,
  Calendar,
  Users,
  Trophy,
  Medal,
  Star,
  Heart,
  Cloud,
  Droplets,
  Thermometer,
  ChevronRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import StatCard from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";

interface TreeEntry {
  id: number;
  type: string;
  location: string;
  planter: string;
  date: string;
  image?: string;
  notes?: string;
}

const recentTrees: TreeEntry[] = [
  { id: 1, type: "Eucalyptus", location: "Kigali, Rwanda", planter: "Amani K.", date: "Mar 20, 2026", notes: "Planted near riverbank" },
  { id: 2, type: "Acacia", location: "Nairobi, Kenya", planter: "Grace M.", date: "Mar 19, 2026", notes: "School initiative" },
  { id: 3, type: "Mango", location: "Accra, Ghana", planter: "EcoClub HS", date: "Mar 18, 2026" },
  { id: 4, type: "Bamboo", location: "Lagos, Nigeria", planter: "GreenNGO", date: "Mar 17, 2026", notes: "Erosion control project" },
  { id: 5, type: "Baobab", location: "Dakar, Senegal", planter: "Community Group", date: "Mar 16, 2026" },
];

const treeSpecies = [
  { value: "eucalyptus", label: "Eucalyptus", carbonOffset: 25, growthRate: "Fast", waterNeeds: "Medium" },
  { value: "acacia", label: "Acacia", carbonOffset: 20, growthRate: "Medium", waterNeeds: "Low" },
  { value: "mango", label: "Mango", carbonOffset: 15, growthRate: "Medium", waterNeeds: "High" },
  { value: "bamboo", label: "Bamboo", carbonOffset: 30, growthRate: "Very Fast", waterNeeds: "Medium" },
  { value: "baobab", label: "Baobab", carbonOffset: 35, growthRate: "Slow", waterNeeds: "Low" },
  { value: "pine", label: "Pine", carbonOffset: 22, growthRate: "Medium", waterNeeds: "Medium" },
  { value: "neem", label: "Neem", carbonOffset: 18, growthRate: "Medium", waterNeeds: "Low" },
  { value: "other", label: "Other", carbonOffset: 15, growthRate: "Unknown", waterNeeds: "Unknown" },
];

const Trees = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState("");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        toast.success("Location detected!", {
          description: "Your coordinates have been added to the tree record.",
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Failed to get location", {
          description: "Please enable location access or enter manually.",
        });
        setIsLocating(false);
      }
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      toast.success("Photo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const calculateCO2Offset = () => {
    const species = treeSpecies.find(s => s.value === selectedSpecies);
    return species ? species.carbonOffset : 15;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSpecies) {
      toast.error("Please select a tree species");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Tree record added! 🌳", {
        description: `You've just contributed to offsetting ${calculateCO2Offset()}kg of CO₂. Thank you, Eco Hero!`,
        duration: 5000,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
      
      // Reset form
      setSelectedSpecies("");
      setLocation("");
      setOrganization("");
      setNotes("");
      setImagePreview(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const selectedSpeciesData = treeSpecies.find(s => s.value === selectedSpecies);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className={`mb-8 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 mb-4">
              <Leaf className="w-4 h-4" />
              <span>Reforest Africa</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent mb-3">
              Tree Planting Tracker
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Record, track, and celebrate tree planting across Africa. Every tree counts in our mission to restore the continent's green cover.
            </p>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <StatCard 
              icon={<TreePine className="w-6 h-6" />} 
              value="85,000+" 
              label="Trees Planted" 
              color="green" 
              trend="+12%"
            />
            <StatCard 
              icon={<Leaf className="w-6 h-6" />} 
              value="42 tons" 
              label="CO₂ Offset" 
              color="amber" 
              trend="+8%"
            />
            <StatCard 
              icon={<TrendingUp className="w-6 h-6" />} 
              value="1,200" 
              label="This Month" 
              color="sky" 
              trend="+23%"
            />
            <StatCard 
              icon={<Award className="w-6 h-6" />} 
              value="350" 
              label="Eco Heroes" 
              color="earth" 
              trend="+5%"
            />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Form Section */}
            <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-white dark:from-slate-800 dark:to-slate-800">
                  <h2 className="font-display font-semibold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-emerald-500" />
                    Log a Planted Tree
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Share your tree planting activity with the community
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Tree Species */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Tree Species *
                    </Label>
                    <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        {treeSpecies.map((species) => (
                          <SelectItem key={species.value} value={species.value}>
                            🌳 {species.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Species Info */}
                    {selectedSpeciesData && (
                      <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">CO₂ Offset</p>
                            <p className="font-semibold text-emerald-600">{selectedSpeciesData.carbonOffset} kg/year</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Growth Rate</p>
                            <p className="font-semibold">{selectedSpeciesData.growthRate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Water Needs</p>
                            <p className="font-semibold">{selectedSpeciesData.waterNeeds}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Location *
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Where was it planted?" 
                        className="flex-1 h-11"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="shrink-0 h-11 w-11"
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Organization (optional)
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="School, NGO, or group name" 
                        className="pl-10 h-11"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Notes (optional)
                    </Label>
                    <Textarea 
                      placeholder="Any additional details about the planting..." 
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Photo
                    </Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    
                    {!imagePreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-emerald-500 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera className="w-6 h-6 text-emerald-600" />
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Upload a photo of your planted tree
                          </p>
                          <Button type="button" variant="outline" size="sm" className="mt-2 gap-2">
                            <Upload className="w-3.5 h-3.5" /> Choose File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                          src={imagePreview}
                          alt="Planted tree"
                          className="w-full max-h-48 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                          onClick={() => {
                            setImagePreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Logging Tree...
                      </>
                    ) : (
                      <>
                        <TreePine className="w-4 h-4" />
                        Log Tree
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Recent Trees */}
              <div className={`bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-semibold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        Recently Planted
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Latest contributions from the community
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[400px] overflow-y-auto">
                  {recentTrees.map((tree, index) => (
                    <div 
                      key={tree.id} 
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TreePine className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {tree.type}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              by {tree.planter}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {tree.location}
                          </div>
                          {tree.notes && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                              "{tree.notes}"
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {tree.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className={`bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-white dark:from-slate-800 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-semibold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Leaderboard
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Top tree planters making a difference
                      </p>
                    </div>
                    <Medal className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {[
                      { name: "GreenRwanda NGO", trees: 4200, badge: "Eco Hero", icon: Trophy, color: "text-amber-500" },
                      { name: "Nairobi Eco Club", trees: 3100, badge: "Tree Champion", icon: Star, color: "text-blue-500" },
                      { name: "AccraGreen Schools", trees: 2400, badge: "Rising Star", icon: Medal, color: "text-emerald-500" },
                      { name: "Dakar Reforestation", trees: 1800, badge: "Green Warrior", icon: Heart, color: "text-rose-500" },
                      { name: "Kampala Green", trees: 1200, badge: "Eco Fighter", icon: Leaf, color: "text-emerald-400" },
                    ].map((entry, i) => (
                      <div key={entry.name} className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-display font-bold text-base shadow-lg">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {entry.name}
                            </div>
                            <entry.icon className={`w-4 h-4 ${entry.color}`} />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              {entry.trees.toLocaleString()} trees
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {entry.badge}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            #{i + 1}
                          </div>
                          <div className="text-xs text-slate-400">rank</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress to Next Milestone */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Community Goal</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">85,000 / 100,000 trees</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                      Only 15,000 more trees to reach our 100,000 goal! 🌍
                    </p>
                  </div>
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

export default Trees;