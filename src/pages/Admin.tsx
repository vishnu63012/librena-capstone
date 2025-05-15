import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AdminPanel from "@/pages/AdminPanel"; 
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access the admin panel.",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading admin panel...
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null; 
  }

  return (
    <>
      <Navbar />
      <AdminPanel />
      <Footer />
    </>
  );
};

export default Admin;
