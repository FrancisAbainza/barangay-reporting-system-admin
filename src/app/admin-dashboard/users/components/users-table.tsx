"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Ban, Users, AlertTriangle, CheckCircle, Search } from "lucide-react";
import type { UserType } from "@/types/user";
import { formatDate } from "@/lib/date-formatter";

interface UsersTableProps {
  users: UserType[];
  onBanUser: (userId: string, reason?: string) => void;
  onUnbanUser: (userId: string) => void;
}

export default function UsersTable({ users, onBanUser, onUnbanUser }: UsersTableProps) {
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [banReason, setBanReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchId, setSearchId] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchId.trim()) return users;
    return users.filter((user) =>
      user.id.toLowerCase().includes(searchId.toLowerCase())
    );
  }, [users, searchId]);

  const handleBanClick = (user: UserType) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  };

  const handleUnbanClick = (user: UserType) => {
    setSelectedUser(user);
    setUnbanDialogOpen(true);
  };

  const handleConfirmBan = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      await onBanUser(selectedUser.id, banReason);
      setBanDialogOpen(false);
      setSelectedUser(null);
      setBanReason("");
      // TODO: Show success notification
    } catch (error) {
      console.error("Failed to ban user:", error);
      // TODO: Show error notification
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmUnban = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      await onUnbanUser(selectedUser.id);
      setUnbanDialogOpen(false);
      setSelectedUser(null);
      // TODO: Show success notification
    } catch (error) {
      console.error("Failed to unban user:", error);
      // TODO: Show error notification
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Regular Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Complaints</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <div className="py-8 text-muted-foreground">
                        {searchId.trim() ? "No users match your search" : "No users found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "banned"
                                ? "destructive"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.complaintsCount || 0}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        {user.lastLoginAt
                          ? formatDate(user.lastLoginAt)
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.status === "banned" ? (
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-600"
                                onClick={() => handleUnbanClick(user)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleBanClick(user)}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Ban User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.name}? This will
              prevent them from accessing the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="banReason">Reason (Optional)</Label>
              <Textarea
                id="banReason"
                placeholder="Enter the reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBanDialogOpen(false);
                setBanReason("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBan}
              disabled={isProcessing}
            >
              {isProcessing ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban User Dialog */}
      <Dialog open={unbanDialogOpen} onOpenChange={setUnbanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Unban User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to unban {selectedUser?.name}? This will
              restore their access to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnbanDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmUnban} disabled={isProcessing}>
              {isProcessing ? "Unbanning..." : "Unban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
