import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MyAccount = () => {
  const { user, firebaseUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    const loadActivityLogs = async () => {
      if (!user?.uid) return;
      const snapshot = await getDocs(collection(db, `users/${user.uid}/activityLogs`));
      const logs = snapshot.docs.map((doc) => doc.data());
      setActivityLogs(
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );
    };

    loadActivityLogs();
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePasswordChange = async () => {
    if (!firebaseUser || !firebaseUser.email) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "New passwords do not match", variant: "destructive" });
      return;
    }

    try {
      const cred = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, cred);
      await updatePassword(firebaseUser, newPassword);
      toast({ title: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password update error", error);
      toast({ title: "Failed to update password", variant: "destructive" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-center">My Account</h1>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <Button
                onClick={handleLogout}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                onClick={handlePasswordChange}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Last login: {firebaseUser?.metadata?.lastSignInTime
                  ? new Date(firebaseUser.metadata.lastSignInTime).toLocaleString()
                  : "N/A"}
              </p>
              {activityLogs.map((log, i) => (
                <p key={i} className="text-muted-foreground">
                  • {log.message} <span className="text-xs text-gray-400 ml-2">
                    ({new Date(log.timestamp).toLocaleString()})
                  </span>
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAccount;
