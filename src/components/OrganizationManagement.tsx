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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Users,
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  organization_type: "school" | "ngo" | "group" | "other";
  description?: string;
  location?: string;
  country?: string;
  contact_email?: string;
  contact_phone?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  members_count?: number;
}

interface PaginatedResponse {
  data: Organization[];
  total: number;
  page: number;
  totalPages: number;
}

interface EditingOrganization {
  id?: number;
  name: string;
  organization_type: "school" | "ngo" | "group" | "other";
  description: string;
  location: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  status: "active" | "inactive";
}

const OrganizationManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingOrg, setEditingOrg] = useState<EditingOrganization | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteOrgId, setDeleteOrgId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: orgsData, isLoading: orgsLoading } = useQuery<PaginatedResponse>({
    queryKey: ["admin-organizations", page, typeFilter, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "20",
      };
      const response = await api.get("/admin/organizations", { params });
      return response;
    },
    retry: 1,
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "school":
        return "bg-blue-100 text-blue-800";
      case "ngo":
        return "bg-green-100 text-green-800";
      case "group":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateOrganization = () => {
    setEditingOrg({
      name: "",
      organization_type: "school",
      description: "",
      location: "",
      country: "",
      contact_email: "",
      contact_phone: "",
      status: "active",
    });
    setShowCreateDialog(true);
  };

  const handleEditOrganization = (org: Organization) => {
    setEditingOrg({
      id: org.id,
      name: org.name,
      organization_type: org.organization_type,
      description: org.description || "",
      location: org.location || "",
      country: org.country || "",
      contact_email: org.contact_email || "",
      contact_phone: org.contact_phone || "",
      status: org.status,
    });
    setShowEditDialog(true);
  };

  const handleSaveOrganization = async () => {
    if (!editingOrg || !editingOrg.name) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      await api.patch(`/admin/organizations/${editingOrg.id}`, {
        name: editingOrg.name,
        organization_type: editingOrg.organization_type,
        description: editingOrg.description || null,
        location: editingOrg.location || null,
        country: editingOrg.country || null,
        contact_email: editingOrg.contact_email || null,
        contact_phone: editingOrg.contact_phone || null,
        status: editingOrg.status,
      });

      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      setShowEditDialog(false);
      setEditingOrg(null);
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateNew = async () => {
    if (!editingOrg || !editingOrg.name) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      await api.post(`/admin/organizations`, {
        name: editingOrg.name,
        organization_type: editingOrg.organization_type,
        description: editingOrg.description || null,
        location: editingOrg.location || null,
        country: editingOrg.country || null,
        contact_email: editingOrg.contact_email || null,
        contact_phone: editingOrg.contact_phone || null,
        status: editingOrg.status,
      });

      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      setShowCreateDialog(false);
      setEditingOrg(null);
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!deleteOrgId) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/organizations/${deleteOrgId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      setShowDeleteDialog(false);
      setDeleteOrgId(null);
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete organization",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <div>
              <CardTitle>Organizations</CardTitle>
              <CardDescription>
                Manage schools, NGOs, and groups
              </CardDescription>
            </div>
          </div>
          <Button onClick={handleCreateOrganization} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Organization
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
              <SelectItem value="group">Group</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Organizations Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Members
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : orgsData?.data?.length ? (
                orgsData.data.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(org.organization_type)}>
                        {org.organization_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {org.location && org.country
                        ? `${org.location}, ${org.country}`
                        : org.country || org.location || "—"}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {org.members_count || 0}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(org.status)}>
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOrganization(org)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setDeleteOrgId(org.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No organizations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {orgsData && orgsData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-600">
              Page {orgsData.page} of {orgsData.totalPages} ({orgsData.total}{" "}
              organizations total)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage(Math.min(orgsData.totalPages, page + 1))
                }
                disabled={page === orgsData.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog
        open={showEditDialog || showCreateDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowEditDialog(false);
            setShowCreateDialog(false);
            setEditingOrg(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingOrg?.id ? "Edit Organization" : "Create Organization"}
            </DialogTitle>
            <DialogDescription>
              {editingOrg?.id
                ? "Update organization details"
                : "Add a new organization"}
            </DialogDescription>
          </DialogHeader>
          {editingOrg && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={editingOrg.name}
                  onChange={(e) =>
                    setEditingOrg({ ...editingOrg, name: e.target.value })
                  }
                  placeholder="Organization name"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={editingOrg.organization_type}
                    onValueChange={(value: any) =>
                      setEditingOrg({
                        ...editingOrg,
                        organization_type: value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingOrg.status}
                    onValueChange={(value: any) =>
                      setEditingOrg({ ...editingOrg, status: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingOrg.description}
                  onChange={(e) =>
                    setEditingOrg({ ...editingOrg, description: e.target.value })
                  }
                  placeholder="Organization description"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editingOrg.location}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, location: e.target.value })
                    }
                    placeholder="City/Town"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={editingOrg.country}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, country: e.target.value })
                    }
                    placeholder="Country"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editingOrg.contact_email}
                    onChange={(e) =>
                      setEditingOrg({
                        ...editingOrg,
                        contact_email: e.target.value,
                      })
                    }
                    placeholder="contact@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editingOrg.contact_phone}
                    onChange={(e) =>
                      setEditingOrg({
                        ...editingOrg,
                        contact_phone: e.target.value,
                      })
                    }
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setShowCreateDialog(false);
                setEditingOrg(null);
              }}
              disabled={updating || creating}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingOrg?.id ? handleSaveOrganization : handleCreateNew
              }
              disabled={updating || creating}
            >
              {(updating || creating) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingOrg?.id ? "Save Changes" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this organization? This action
            cannot be undone. Please ensure no users are assigned to this
            organization.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrganization}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default OrganizationManagement;
