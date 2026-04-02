import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import api from "@/lib/api";
import { 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Activity, 
  UserPlus,
  Truck,
  Gift,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react";
import WasteMap from "./WasteMap";

interface WasteReport {
  id: number;
  title: string;
  location?: string;
  country?: string;
  status: 'Open' | 'Investigating' | 'Verified' | 'Resolved';
  is_approved?: boolean;
  is_rejected?: boolean;
  assigned_to?: number;
  display_name?: string;
  created_at: string;
  description?: string;
  severity?: string;
}

interface CollectionActivity {
  id: number;
  report_id: number;
  authority_id: number;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  collection_date: string;
  authority_name?: string;
  report_title?: string;
}

interface Reward {
  id: number;
  user_id: number;
  points: number;
  reason?: string;
  created_at: string;
  user_name?: string;
}

interface PaginatedResponse {
  data: WasteReport[];
  total: number;
  page: number;
  totalPages: number;
}

const WasteManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mapMode, setMapMode] = useState(false);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [authorityId, setAuthorityId] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [collectionNotes, setCollectionNotes] = useState('');
  const [collectionStatus, setCollectionStatus] = useState<string>('scheduled');
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [rewardUserId, setRewardUserId] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [rewardReason, setRewardReason] = useState('');

  const queryClient = useQueryClient();

  // Fetch waste reports
  const { data, isLoading, refetch } = useQuery<PaginatedResponse>({
    queryKey: ['admin-waste', page, statusFilter],
    queryFn: async () => {
      const result = await api.get<PaginatedResponse>('/admin/waste', {
        params: { page, limit: 10, status: statusFilter },
      });
      return result;
    },
    staleTime: 20_000,
  });

  // Fetch collection activities
  const { data: collectionData, isLoading: collectionLoading } = useQuery<{ data: CollectionActivity[] }>({
    queryKey: ['admin-collection-activities'],
    queryFn: async () => {
      const result = await api.get<{ data: CollectionActivity[] }>('/admin/collection-activities');
      return result;
    },
    staleTime: 20_000,
  });

  // Fetch rewards
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery<{ data: Reward[] }>({
    queryKey: ['admin-rewards'],
    queryFn: async () => {
      const result = await api.get<{ data: Reward[] }>('/admin/rewards');
      return result;
    },
    staleTime: 20_000,
  });

  const onApprove = async (id: number) => {
    setActionInProgress(id);
    try {
      await api.post(`/admin/waste/${id}/approve`, {});
      toast({ title: 'Approved', description: 'Waste report approved.' });
      queryClient.invalidateQueries({ queryKey: ['admin-waste'] });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Unable to approve', variant: 'destructive' });
    } finally {
      setActionInProgress(null);
    }
  };

  const onReject = async (id: number) => {
    setActionInProgress(id);
    try {
      await api.post(`/admin/waste/${id}/reject`, {});
      toast({ title: 'Rejected', description: 'Waste report rejected.' });
      queryClient.invalidateQueries({ queryKey: ['admin-waste'] });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Unable to reject', variant: 'destructive' });
    } finally {
      setActionInProgress(null);
    }
  };

  const onAssign = async () => {
    if (!selectedReportId || !authorityId) return;
    setAssigning(selectedReportId);
    try {
      await api.post(`/admin/waste/${selectedReportId}/assign`, { authority_id: parseInt(authorityId) });
      toast({ title: 'Assigned', description: 'Report assigned to authority.' });
      queryClient.invalidateQueries({ queryKey: ['admin-waste'] });
      setShowAssignDialog(false);
      setAuthorityId('');
      setSelectedReportId(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Unable to assign', variant: 'destructive' });
    } finally {
      setAssigning(null);
    }
  };

  const onUpdateStatus = async () => {
    if (!selectedReportId || !selectedStatus) return;
    setActionInProgress(selectedReportId);
    try {
      await api.patch(`/admin/reports/${selectedReportId}`, { status: selectedStatus });
      toast({ title: 'Status Updated', description: `Report status changed to ${selectedStatus}.` });
      queryClient.invalidateQueries({ queryKey: ['admin-waste'] });
      setShowStatusDialog(false);
      setSelectedStatus('');
      setSelectedReportId(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Unable to update status', variant: 'destructive' });
    } finally {
      setActionInProgress(null);
    }
  };

  const onCreateCollectionActivity = async () => {
    if (!selectedReportId || !authorityId) return;
    try {
      await api.post('/admin/collection-activities', {
        report_id: selectedReportId,
        authority_id: parseInt(authorityId),
        notes: collectionNotes || undefined,
        status: collectionStatus,
      });
      toast({ title: 'Collection Activity Created', description: 'Garbage collection activity has been scheduled.' });
      queryClient.invalidateQueries({ queryKey: ['admin-collection-activities'] });
      setShowCollectionDialog(false);
      setCollectionNotes('');
      setCollectionStatus('scheduled');
      setAuthorityId('');
      setSelectedReportId(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Unable to create collection activity', variant: 'destructive' });
    }
  };

  const onCreateReward = async () => {
    if (!rewardUserId || !rewardPoints) return;
    try {
      await api.post('/admin/rewards', {
        user_id: parseInt(rewardUserId),
        points: parseInt(rewardPoints),
        reason: rewardReason || undefined,
      });
      toast({ title: 'Reward Created', description: 'User reward has been added.' });
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      setShowRewardDialog(false);
      setRewardUserId('');
      setRewardPoints('');
      setRewardReason('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Unable to create reward', variant: 'destructive' });
    }
  };

  const openAssignDialog = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowAssignDialog(true);
  };

  const openStatusDialog = (reportId: number, currentStatus: string) => {
    setSelectedReportId(reportId);
    setSelectedStatus(currentStatus);
    setShowStatusDialog(true);
  };

  const openCollectionDialog = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowCollectionDialog(true);
  };

  const statuses = ['all', 'Open', 'Investigating', 'Verified', 'Resolved'];
  const collectionStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-700';
      case 'Verified': return 'bg-blue-100 text-blue-700';
      case 'Investigating': return 'bg-yellow-100 text-yellow-700';
      case 'Open': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCollectionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <div>
              <CardTitle>Waste Management Control</CardTitle>
              <CardDescription>Manage waste reports, collections, and rewards</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setMapMode(!mapMode)} className="gap-2">
              <MapPin className="w-4 h-4" />
              {mapMode ? 'Hide Hotspots' : 'Show Hotspots'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports" className="gap-2">
              <Activity className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <Truck className="w-4 h-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="rewards" className="gap-2">
              <Gift className="w-4 h-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="w-4 h-4" />
              Map
            </TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-4">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status Filter:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">Total: {data?.total ?? 'Loading...'}</p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      </TableRow>
                    ))
                  ) : data?.data.length ? (
                    data.data.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono">#{report.id}</TableCell>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>{report.location || report.country || '—'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.severity || 'Medium'}</Badge>
                        </TableCell>
                        <TableCell>{report.display_name || 'Anonymous'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onApprove(report.id)} 
                              disabled={actionInProgress === report.id || report.status === 'Resolved'}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onReject(report.id)} 
                              disabled={actionInProgress === report.id}
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openAssignDialog(report.id)} 
                              disabled={assigning === report.id}
                            >
                              <UserPlus className="w-3 h-3 mr-1" /> Assign
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openStatusDialog(report.id, report.status)}
                            >
                              <Clock className="w-3 h-3 mr-1" /> Status
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openCollectionDialog(report.id)}
                            >
                              <Truck className="w-3 h-3 mr-1" /> Collect
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No waste reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">Page {data.page} of {data.totalPages}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}>Next</Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Collection Activities Tab */}
          <TabsContent value="collections" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Report</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : collectionData?.data?.length ? (
                    collectionData.data.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-mono">#{activity.id}</TableCell>
                        <TableCell>{activity.report_title || `Report #${activity.report_id}`}</TableCell>
                        <TableCell>{activity.authority_name || `User #${activity.authority_id}`}</TableCell>
                        <TableCell>
                          <Badge className={getCollectionStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{activity.notes || '—'}</TableCell>
                        <TableCell>{new Date(activity.collection_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No collection activities found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-4">
            <div className="mb-4">
              <Button onClick={() => setShowRewardDialog(true)} className="gap-2">
                <Gift className="w-4 h-4" />
                Add Reward
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewardsLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : rewardsData?.data?.length ? (
                    rewardsData.data.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell className="font-mono">#{reward.id}</TableCell>
                        <TableCell>{reward.user_name || `User #${reward.user_id}`}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            +{reward.points} pts
                          </Badge>
                        </TableCell>
                        <TableCell>{reward.reason || '—'}</TableCell>
                        <TableCell>{new Date(reward.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No rewards found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="mt-4">
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <WasteMap />
            </div>
          </TabsContent>
        </Tabs>

        {/* Assign Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign to Authority</DialogTitle>
              <DialogDescription>
                Enter the authority user ID to assign this report.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Authority User ID</label>
                <Input
                  type="number"
                  value={authorityId}
                  onChange={(e) => setAuthorityId(e.target.value)}
                  placeholder="Enter user ID"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={onAssign} disabled={!authorityId || assigning === selectedReportId}>
                {assigning === selectedReportId && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Assign
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Report Status</DialogTitle>
              <DialogDescription>
                Change the status of this waste report.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">New Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Investigating">Investigating</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={onUpdateStatus} disabled={!selectedStatus || actionInProgress === selectedReportId}>
                {actionInProgress === selectedReportId && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Collection Activity Dialog */}
        <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Collection</DialogTitle>
              <DialogDescription>
                Create a garbage collection activity for this report.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Authority User ID</label>
                <Input
                  type="number"
                  value={authorityId}
                  onChange={(e) => setAuthorityId(e.target.value)}
                  placeholder="Enter user ID"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionStatuses.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={collectionNotes}
                  onChange={(e) => setCollectionNotes(e.target.value)}
                  placeholder="Optional notes..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCollectionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={onCreateCollectionActivity} disabled={!authorityId}>
                Create Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reward Dialog */}
        <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User Reward</DialogTitle>
              <DialogDescription>
                Award points to a user for their contributions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <Input
                  type="number"
                  value={rewardUserId}
                  onChange={(e) => setRewardUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Points</label>
                <Input
                  type="number"
                  value={rewardPoints}
                  onChange={(e) => setRewardPoints(e.target.value)}
                  placeholder="Enter points"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  value={rewardReason}
                  onChange={(e) => setRewardReason(e.target.value)}
                  placeholder="Optional reason..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRewardDialog(false)}>
                Cancel
              </Button>
              <Button onClick={onCreateReward} disabled={!rewardUserId || !rewardPoints}>
                Add Reward
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default WasteManagement;
