import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { 
  TreePine, 
  Activity, 
  Trophy, 
  Users, 
  Globe, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin
} from "lucide-react";

// Types (extend from backend)
interface PendingTree {
  id: number;
  species: string;
  location: string;
  user_name: string;
  org_name?: string;
  status: string;
  created_at: string;
}

interface TreeGrowthData {
  tree_id: number;
  latest_height: number;
  latest_health: string;
  measurements: number;
}

interface Competition {
  id: number;
  name: string;
  entry_count: number;
  status: string;
}

interface TreeGroup {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

interface ImpactStats {
  total_trees: number;
  total_co2: number;
  avg_growth_rate: number;
}

const TreeManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("verify");
  const [page, setPage] = useState(1);

  // Verify Trees
  const { data: pendingTrees = [], isLoading: loadingTrees } = useQuery({
    queryKey: ['admin-pending-trees', page],
    queryFn: async () => {
      const res = await api.get('/admin/trees', { params: { status: 'pending', page, limit: 10 } });
      return res.data;
    }
  });

  // Growth Monitoring
  const { data: growthData = [] } = useQuery({
    queryKey: ['admin-tree-growth'],
    queryFn: async () => {
      const res = await api.get('/admin/tree-growth');
      return res.data;
    }
  });

  // Competitions
  const { data: competitions = [] } = useQuery({
    queryKey: ['admin-competitions'],
    queryFn: async () => {
      const res = await api.get('/admin/competitions');
      return res.data;
    }
  });

  // Groups
  const { data: groups = [] } = useQuery({
    queryKey: ['admin-tree-groups'],
    queryFn: async () => {
      const res = await api.get('/admin/tree-groups');
      return res.data;
    }
  });

  // Impacts
  const { data: impactStats } = useQuery({
    queryKey: ['admin-impact-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/tree-stats');
      return res.data;
    }
  });

  const verifyTreeMutation = useMutation({
    mutationFn: ({ treeId, action }: { treeId: number; action: 'verify' | 'reject' }) => 
      api.post(`/admin/trees/${treeId}/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-trees'] });
      toast({
        title: "Tree Updated",
        description: "Tree verification status updated successfully."
      });
    }
  });

  const approveGroupMutation = useMutation({
    mutationFn: ({ groupId }: { groupId: number }) => 
      api.post(`/admin/tree-groups/${groupId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tree-groups'] });
      toast({
        title: "Group Approved",
        description: "Group participation approved."
      });
    }
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    verified: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300"
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats?.pending_trees || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">Verified Trees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats?.verified_trees || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">Total CO₂ Offset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats?.total_co2?.toLocaleString() || 0} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">Active Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitions.filter(c => c.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">Pending Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.filter(g => g.status === 'pending').length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="verify">
            <TreePine className="w-4 h-4 mr-2" />
            Verify Trees
          </TabsTrigger>
          <TabsTrigger value="growth">
            <GrowthChart className="w-4 h-4 mr-2" />
            Monitor Growth
          </TabsTrigger>
          <TabsTrigger value="competitions">
            <Trophy className="w-4 h-4 mr-2" />
            Competitions
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="w-4 h-4 mr-2" />
            Group Approval
          </TabsTrigger>
          <TabsTrigger value="impact">
            <Globe className="w-4 h-4 mr-2" />
            Impact Tracker
          </TabsTrigger>
        </TabsList>

        {/* Verify Trees */}
        <TabsContent value="verify" className="p-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Pending Tree Verifications</CardTitle>
                  <CardDescription>Review and verify newly planted trees</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTrees ? (
                <div className="space-y-4">
                  {Array.from({length: 5}).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Species</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Planter</TableHead>
                        <TableHead>Planted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingTrees.map((tree: PendingTree) => (
                        <TableRow key={tree.id}>
                          <TableCell className="font-medium">{tree.species}</TableCell>
                          <TableCell><MapPin className="w-4 h-4 inline mr-1" /> {tree.location}</TableCell>
                          <TableCell>{tree.user_name} {tree.org_name && `(${tree.org_name})`}</TableCell>
                          <TableCell>{new Date(tree.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => verifyTreeMutation.mutate({ treeId: tree.id, action: 'verify' })}
                              disabled={verifyTreeMutation.isPending}
                            >
                              {verifyTreeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => verifyTreeMutation.mutate({ treeId: tree.id, action: 'reject' })}
                              disabled={verifyTreeMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitor Growth */}
        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Growth Monitoring</CardTitle>
              <CardDescription>Track tree health and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {growthData.slice(0,6).map((growth: TreeGrowthData, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-8 rounded-full bg-gradient-to-b from-green-400 to-emerald-600" />
                        <span className="font-medium">Tree #{growth.tree_id}</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{growth.latest_height || 0}cm</div>
                      <div className="text-sm text-muted-foreground mb-1">Height</div>
                      <Badge variant={growth.latest_health === 'healthy' ? "default" : "secondary"}>
                        {growth.latest_health}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-2">{growth.measurements} measurements</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitions */}
        <TabsContent value="competitions">
          <Card>
            <CardHeader>
              <CardTitle>Tree Planting Competitions</CardTitle>
              <CardDescription>Manage leaderboards and competitions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitions.map((comp: Competition) => (
                    <TableRow key={comp.id}>
                      <TableCell className="font-medium">{comp.name}</TableCell>
                      <TableCell>{comp.entry_count}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{comp.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View Leaderboard</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Group Participation</CardTitle>
              <CardDescription>Approve groups for tree planting activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group: TreeGroup) => (
                    <TableRow key={group.id}>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>
                        <Badge className={group.status === 'pending' ? 'bg-yellow-100' : group.status === 'approved' ? 'bg-green-100' : 'bg-red-100'}>
                          {group.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {group.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => approveGroupMutation.mutate({ groupId: group.id })}
                          >
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact */}
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Tracker</CardTitle>
              <CardDescription>Overall impact from verified trees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-green-600">{impactStats?.total_trees?.toLocaleString()}</div>
                  <div className="text-2xl font-bold text-muted-foreground">Verified Trees</div>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-emerald-600">{impactStats?.total_co2?.toLocaleString()}</div>
                  <div className="text-2xl font-bold text-muted-foreground">kg CO₂ Offset</div>
                </div>
              </div>
              {/* Charts placeholder */}
              <div className="mt-8 p-6 border-2 border-dashed rounded-lg border-gray-200 text-center text-muted-foreground">
                📊
                <div className="mt-2 font-medium">Impact Charts Coming Soon</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreeManagement;

