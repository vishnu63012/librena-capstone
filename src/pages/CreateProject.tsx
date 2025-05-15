import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProject } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner"; 
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CreateProject = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast("Project name is required");
      return;
    }

    if (!user?.uid) {
      toast("Login required", {
        description: "You must be logged in to create a project.",
      });
      navigate("/login");
      return;
    }

    try {
      const projectId = await createProject(user.uid, name);
      toast("Project created successfully");
      navigate("/add-libraries/" + projectId);
    } catch (error) {
      console.error(error);
      toast("Failed to create project", {
        description: "Something went wrong while creating your project.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl relative">
          <button
            className="absolute top-4 left-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-3xl font-bold text-center mb-8">Create New Project</h1>

          <div className="mb-6">
            <Label className="text-base font-medium">Project Name</Label>
            <Input
              placeholder="Enter a project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 py-3 px-4 text-lg border-gray-300 dark:border-gray-700"
            />
          </div>

          <Button
            className="w-full py-3 text-lg bg-[#3B82F6] text-white hover:bg-[#2563EB]"
            onClick={handleCreate}
          >
            Create Project
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateProject;
