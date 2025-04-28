import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProject } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const CreateProject = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "❌ Project name required", variant: "destructive" });
      return;
    }

    if (!user?.uid) {
      toast({ title: "❌ User not authenticated", variant: "destructive" });
      return;
    }

    try {
      const projectId = await createProject(user.uid, name);
      toast({ title: "✅ Project created" });
      navigate("/add-libraries/" + projectId);
    } catch (error) {
      console.error(error);
      toast({ title: "❌ Failed to create project", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl relative">
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-black"
          onClick={() => navigate("/")}  // ✅ Now goes to homepage
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
            className="mt-2 py-3 px-4 text-lg border-gray-300"
          />
        </div>

        <Button
          className="w-full py-3 text-lg bg-black text-white hover:bg-gray-800"
          onClick={handleCreate}
        >
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default CreateProject;
