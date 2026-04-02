import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Send, 
  ScanSearch, 
  Loader2, 
  Recycle, 
  Trash2, 
  AlertTriangle,
  Leaf,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Image,
  X,
  Globe,
  ChevronRight,
  Info,
  Phone,
  Navigation,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WasteClassification {
  category: string;
  confidence: number;
  description: string;
  recyclable: boolean;
  disposal_tip: string;
  impact_score?: number;
}

const categoryIcons: Record<string, string> = {
  plastic: "♻️",
  organic: "🍂",
  metal: "🔩",
  glass: "🪟",
  paper: "📄",
  electronic: "💻",
  textile: "👕",
  hazardous: "☢️",
  mixed: "🗑️",
  not_waste: "✅",
};

const categoryColors: Record<string, string> = {
  plastic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  organic: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  metal: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  glass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  paper: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  electronic: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  textile: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  hazardous: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  mixed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  not_waste: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

const Report = () => {
  const [reportType, setReportType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [severity, setSeverity] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [classification, setClassification] = useState<WasteClassification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      setImageBase64(base64);
      setClassification(null);
      toast.success("Image uploaded successfully!", {
        description: "You can now classify it with AI for better insights.",
      });
    };
    reader.readAsDataURL(file);
  };

  const classifyWaste = async () => {
    if (!imageBase64) {
      toast.error("Please upload an image first.");
      return;
    }

    setClassifying(true);
    setClassification(null);

    try {
      const { data, error } = await supabase.functions.invoke("classify-waste", {
        body: { imageBase64 },
      });

      if (error) throw error;

      setClassification(data as WasteClassification);
      toast.success("Image classified successfully!", {
        description: `Detected: ${data.category} with ${Math.round(data.confidence * 100)}% confidence`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
    } catch (err: any) {
      console.error("Classification error:", err);
      toast.error("Failed to classify image", {
        description: err?.message || "Please try again or continue without AI classification.",
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setClassifying(false);
    }
  };

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
          description: "Your coordinates have been added to the report.",
          icon: <MapPin className="w-5 h-5 text-emerald-500" />,
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

  const validateForm = () => {
    if (!reportType) {
      toast.error("Please select a report type");
      return false;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return false;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return false;
    }
    if (!location.trim()) {
      toast.error("Please enter a location");
      return false;
    }
    if (!country) {
      toast.error("Please select a country");
      return false;
    }
    if (!severity) {
      toast.error("Please select severity level");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Report submitted successfully! 🎉", {
        description: "Thank you for helping protect the environment. Your report has been sent to local authorities.",
        duration: 5000,
      });
      setIsSubmitting(false);
      
      // Reset form
      setReportType("");
      setTitle("");
      setDescription("");
      setLocation("");
      setCountry("");
      setSeverity("");
      setImagePreview(null);
      setImageBase64(null);
      setClassification(null);
      
    }, 1500);
  };

  const severityOptions = [
    { value: "low", label: "Low", color: "bg-green-500", icon: "🟢" },
    { value: "medium", label: "Medium", color: "bg-yellow-500", icon: "🟡" },
    { value: "high", label: "High", color: "bg-orange-500", icon: "🟠" },
    { value: "critical", label: "Critical", color: "bg-red-500", icon: "🔴" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className={`mb-8 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 mb-4">
              <Leaf className="w-4 h-4" />
              <span>Make a Difference</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-3">
              Report an Environmental Issue
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Help your community by reporting waste, pollution, or other environmental concerns.
              Your report helps authorities take action.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Form Card */}
            <div className={`bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="p-6 md:p-8 space-y-6">
                {/* Report Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Report Type *
                  </Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waste">🗑️ Waste / Illegal Dumping</SelectItem>
                      <SelectItem value="air">💨 Air Pollution</SelectItem>
                      <SelectItem value="water">💧 Water Pollution</SelectItem>
                      <SelectItem value="noise">🔊 Noise Pollution</SelectItem>
                      <SelectItem value="deforestation">🌳 Deforestation</SelectItem>
                      <SelectItem value="other">📋 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the environmental issue you've observed..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none"
                  />
                </div>

                {/* Location and Country Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Location *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter location or use GPS"
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Click the pin to auto-detect your location via GPS
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Country *
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rw">🇷🇼 Rwanda</SelectItem>
                        <SelectItem value="ke">🇰🇪 Kenya</SelectItem>
                        <SelectItem value="gh">🇬🇭 Ghana</SelectItem>
                        <SelectItem value="ng">🇳🇬 Nigeria</SelectItem>
                        <SelectItem value="tz">🇹🇿 Tanzania</SelectItem>
                        <SelectItem value="za">🇿🇦 South Africa</SelectItem>
                        <SelectItem value="et">🇪🇹 Ethiopia</SelectItem>
                        <SelectItem value="ug">🇺🇬 Uganda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Photo Upload with AI */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Photo Evidence & AI Detection
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageSelect}
                  />

                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Camera className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Upload a photo
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Take a photo or upload an image — AI will classify the waste type
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2 gap-2">
                          <Upload className="w-3.5 h-3.5" /> Choose File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Image Preview */}
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={imagePreview}
                          alt="Uploaded waste"
                          className="w-full max-h-80 object-contain"
                        />
                        <button
                          type="button"
                          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors backdrop-blur-sm"
                          onClick={() => {
                            setImagePreview(null);
                            setImageBase64(null);
                            setClassification(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* AI Classify Button */}
                      {!classification && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2 h-11 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          onClick={classifyWaste}
                          disabled={classifying}
                        >
                          {classifying ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Analyzing waste with AI...
                            </>
                          ) : (
                            <>
                              <ScanSearch className="w-4 h-4" />
                              Classify with AI
                            </>
                          )}
                        </Button>
                      )}

                      {/* Classification Results */}
                      {classification && (
                        <div className={`rounded-xl border p-5 space-y-3 ${categoryColors[classification.category] || 'bg-primary/5 border-primary/20'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                AI Classification Result
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Powered by advanced computer vision
                              </p>
                            </div>
                            <Badge className={`capitalize text-sm ${categoryColors[classification.category]}`}>
                              {categoryIcons[classification.category] || "🗑️"} {classification.category}
                            </Badge>
                          </div>

                          <p className="text-sm text-foreground/80">{classification.description}</p>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Confidence Score</span>
                              <span className="font-medium text-foreground">
                                {Math.round(classification.confidence * 100)}%
                              </span>
                            </div>
                            <Progress value={classification.confidence * 100} className="h-2" />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {classification.recyclable ? (
                              <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300 dark:border-emerald-700">
                                <Recycle className="w-3 h-3" /> Recyclable
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-red-600 border-red-300 dark:border-red-700">
                                <AlertTriangle className="w-3 h-3" /> Not Recyclable
                              </Badge>
                            )}
                            {classification.impact_score && (
                              <Badge variant="outline" className="gap-1">
                                🌍 Impact Score: {classification.impact_score}/10
                              </Badge>
                            )}
                          </div>

                          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                            <p className="text-xs flex items-start gap-2">
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span><strong>Disposal Tip:</strong> {classification.disposal_tip}</span>
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={classifyWaste}
                          >
                            Re-analyze with AI
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Severity Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Severity Level *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {severityOptions.map((s) => (
                      <Button
                        key={s.value}
                        type="button"
                        variant={severity === s.value ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 gap-2 h-11 ${severity === s.value ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : ''}`}
                        onClick={() => setSeverity(s.value)}
                      >
                        <span>{s.icon}</span>
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Help Text */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              <p>All reports are reviewed by local authorities. Your information helps create a cleaner, greener Africa.</p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Report;