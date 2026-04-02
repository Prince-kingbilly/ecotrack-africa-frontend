import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import UserManagement from "@/components/UserManagement";
import OrganizationManagement from "@/components/OrganizationManagement";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Shield,
  BarChart3,
  RefreshCw,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Activity,
  CheckCircle2,
  XCircle,
  UserPlus,
  Bell,
  Calendar,
  Building2,
  FileText
} from "lucide-react";

// Types
interface Report {
  id: number;
  title: string;
  type: string;
  status: 'Open' | 'Investigating' | 'Verified' | 'Resolved';
  user_id: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  created_at: string;
  location?: string;
  description?: string;
}

interface AdminStats {
  total_reports: number;
  open_reports: number;
  users_count: number;
  avg_response_time: string;
  resolved_today?: number;
  active_users?: number;
}

interface PaginatedResponse {
  data: Report[];
  total: number;
  page: number;
  totalPages: number;
}

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  // Fetch stats
  const { 
    data: stats, 
    isLoading: statsLoading,
    error: statsError 
  } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response;
    },
    retry: 1,
    staleTime: 30000,
  });

  // Fetch reports with pagination
  const { 
    data: reportsData, 
    isLoading: reportsLoading, 
    refetch,
    error: reportsError
  } = useQuery<PaginatedResponse>({
    queryKey: ['admin-reports', statusFilter, page],
    queryFn: async () => {
      const response = await api.get('/admin/reports', {
        params: {
          page, 
          limit: 10,
          status: statusFilter !== 'all' ? statusFilter : undefined 
        }
      });
      return response.data;
    },
    retry: 1,
    staleTime: 30000,
  });

  const reports = reportsData?.data || [];
  const totalPages = reportsData?.totalPages || 1;
  const totalReports = reportsData?.total || 0;

  // Status color mapping with enhanced styling
  const statusColors: Record<string, string> = {
    Open: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-l-4 border-amber-500",
    Investigating: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-l-4 border-blue-500",
    Verified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-l-4 border-emerald-500",
    Resolved: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-l-4 border-green-500",
  };

  // Severity color mapping with enhanced styling
  const severityColors: Record<string, string> = {
    Low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
    Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
    High: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800",
    Critical: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800",
  };

  // Update report status
  const updateStatus = async (reportId: number, newStatus: string) => {
    try {
      setUpdatingStatus(reportId);
      await api.patch(`/admin/reports/${reportId}`, { status: newStatus });
      
      await queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      
      toast({
        title: "Status Updated ✓",
        description: `Report #${reportId} status changed to ${newStatus}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to update status', error);
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    toast({
      title: "Dashboard Refreshed",
      description: "Latest data has been loaded successfully.",
      duration: 2000,
    });
  };

  // Handle export
  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get('/admin/reports/export', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reports_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Export failed', error);
      toast({
        title: "Export Failed",
        description: "Failed to export reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Format date with relative time
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  // Stats cards data with icons and gradients
  const statsCards = [
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      value: stats?.total_reports?.toLocaleString() || '0',
      label: "Total Reports",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      trend: "+12% this month",
      trendUp: true,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: stats?.open_reports?.toLocaleString() || '0',
      label: "Open Issues",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
      trend: "5% decrease",
      trendUp: false,
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: stats?.users_count?.toLocaleString() || '0',
      label: "Total Users",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      trend: "+23% growth",
      trendUp: true,
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: stats?.avg_response_time || 'N/A',
      label: "Avg Response",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      trend: stats?.resolved_today ? `${stats.resolved_today} resolved today` : undefined,
      trendUp: true,
    }
  ];

  // Error handling
  if (statsError || reportsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Card className="p-12 text-center border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl mb-3 text-red-700 dark:text-red-400">Error Loading Dashboard</CardTitle>
              <CardDescription className="text-base mb-6">
                Unable to fetch dashboard data. Please check your connection and try again.
              </CardDescription>
              <Button onClick={handleRefresh} className="gap-2 bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <Toaster />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Section with Animation */}
          <div className="mb-8 animate-in slide-in-from-top duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Welcome back, Administrator
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="gap-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                  disabled={statsLoading || reportsLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${(statsLoading || reportsLoading) ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid with Enhanced Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))
            ) : (
              statsCards.map((stat, index) => (
                <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <CardContent className="p-6">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {stat.label}
                      </p>
                      {stat.trend && (
                        <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 transform rotate-180" />}
                          <span>{stat.trend}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Main Content with Tabs */}
          <div className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-t-lg bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <TabsTrigger value="reports" className="gap-2 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="organizations" className="gap-2 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Organizations</span>
                </TabsTrigger>
              </TabsList>

              {/* Reports Tab */}
              <TabsContent value="reports" className="p-0 m-0">
                <Card className="shadow-none border-0 bg-transparent">
                  <CardHeader className="bg-transparent border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-display flex items-center gap-2">
                          <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          Recent Reports
                        </CardTitle>
                        <CardDescription>Monitor and manage incoming reports</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-600">
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Investigating">Investigating</SelectItem>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b-2 border-gray-200 dark:border-gray-700">
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">ID</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Title</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Type</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Severity</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Created</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportsLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
                              </TableRow>
                            ))
                          ) : reports.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                  <MapPin className="w-16 h-16 text-gray-400" />
                                  <p className="text-gray-500 dark:text-gray-400 text-lg">No reports found</p>
                                  <p className="text-sm text-gray-400">Try adjusting your filters</p>
                                  {statusFilter !== "all" && (
                                    <Button variant="outline" onClick={() => setStatusFilter("all")} className="mt-2">
                                      Clear filters
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            reports.map((report) => (
                              <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-150 group">
                                <TableCell className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">#{report.id}</TableCell>
                                <TableCell className="font-medium max-w-[200px] truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {report.title}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    {report.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`${severityColors[report.severity]} font-medium`}>
                                    {report.severity}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`${statusColors[report.status]} font-medium pl-3`}>
                                    {report.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(report.created_at)}
                                </TableCell>
                                <TableCell>
                                  <Select 
                                    value={report.status}
                                    onValueChange={(value) => updateStatus(report.id, value)}
                                    disabled={updatingStatus === report.id}
                                  >
                                    <SelectTrigger className="w-32 h-8 text-sm border-gray-300 dark:border-gray-600">
                                      {updatingStatus === report.id ? (
                                        <div className="flex items-center gap-1">
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                          <span>Updating...</span>
                                        </div>
                                      ) : (
                                        <SelectValue />
                                      )}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Open">Open</SelectItem>
                                      <SelectItem value="Investigating">Investigating</SelectItem>
                                      <SelectItem value="Verified">Verified</SelectItem>
                                      <SelectItem value="Resolved">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Enhanced Pagination */}
                    {!reportsLoading && reports.length > 0 && totalPages > 1 && (
                      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                        <div className="text-sm text-muted-foreground">
                          Showing page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.max(p - 1, 1))} 
                            disabled={page === 1}
                            className="gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="p-6 m-0">
                <UserManagement />
              </TabsContent>

              {/* Organizations Tab */}
              <TabsContent value="organizations" className="p-6 m-0">
                <OrganizationManagement />
              </TabsContent>
            </Tabs>
          </div>

          {/* Additional Insights Grid */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "New report submitted - Critical severity", time: "2 minutes ago", type: "critical", user: "John Doe" },
                    { action: "User registered as authority", time: "15 minutes ago", type: "authority", user: "Sarah Smith" },
                    { action: "Report #1245 resolved", time: "1 hour ago", type: "resolved", user: "Admin" },
                    { action: "New authority account created", time: "3 hours ago", type: "authority", user: "Mike Johnson" },
                    { action: "System update completed", time: "5 hours ago", type: "system", user: "System" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'critical' ? 'bg-red-500 animate-pulse' :
                        activity.type === 'authority' ? 'bg-blue-500' :
                        activity.type === 'resolved' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {activity.action}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-gray-300 dark:border-gray-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group">
                  <AlertTriangle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Review Critical Reports</span>
                  <Badge className="ml-auto bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">3 urgent</Badge>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 group">
                  <UserPlus className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Invite New Authority</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200 group">
                  <BarChart3 className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Generate Analytics Report</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 border-gray-300 dark:border-gray-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 group">
                  <Download className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Export System Logs</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;