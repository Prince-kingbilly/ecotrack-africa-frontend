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
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Ban,
} from "lucide-react";

interface User {
  id: number;
  email: string;
  display_name: string;
  role: "user" | "admin" | "authority";
  status: "active" | "suspended" | "banned";
  organization_id?: number;
  organization_name?: string;
  country?: string;
  created_at: string;
  updated_at?: string;
}

interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

interface EditingUser {
  id: number;
  role: "user" | "admin" | "authority";
  status: "active" | "suspended" | "banned";
  display_name: string;
}

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: usersData, isLoading: usersLoading } = useQuery<PaginatedResponse>({
    queryKey: ["admin-users", page, roleFilter, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "20",
      };
      if (roleFilter && roleFilter !== "all") {
        params.role = roleFilter;
      }
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }
      const response = await api.get("/admin/users", { params });
      return response;
    },
    retry: 1,
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "authority":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4" />;
      case "suspended":
        return <AlertTriangle className="w-4 h-4" />;
      case "banned":
        return <Ban className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser({
      id: user.id,
      role: user.role,
      status: user.status,
      display_name: user.display_name,
    });
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setUpdating(true);
    try {
      await api.patch(`/admin/users/${editingUser.id}`, {
        role: editingUser.role,
        status: editingUser.status,
        display_name: editingUser.display_name,
      });

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setShowEditDialog(false);
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setShowDeleteDialog(false);
      setDeleteUserId(null);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user accounts, roles, and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="authority">Authority</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : usersData?.data?.length ? (
                usersData.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.display_name}
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(user.status)}
                        variant="outline"
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(user.status)}
                          {user.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.organization_name || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setDeleteUserId(user.id);
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
                  <TableCell colSpan={7} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {usersData && usersData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-600">
              Page {usersData.page} of {usersData.totalPages} ({usersData.total}{" "}
              users total)
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
                  setPage(Math.min(usersData.totalPages, page + 1))
                }
                disabled={page === usersData.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role, status, and display name
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  value={editingUser.display_name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      display_name: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: any) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="authority">Authority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value: any) =>
                    setEditingUser({ ...editingUser, status: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={updating}>
              {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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

export default UserManagement;
