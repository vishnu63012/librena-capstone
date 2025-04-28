import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="max-w-xl mx-auto p-6 border rounded shadow mt-10 bg-white">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
         
          <Button onClick={logout} className="mt-6 bg-red-500 text-white">
            Logout
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
