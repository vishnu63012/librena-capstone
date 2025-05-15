import React, { useState, useRef } from "react";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Library } from "@/lib/type";
import { useNavigate } from "react-router-dom";

const AdminUploadJson = () => {
  const [jsonFileName, setJsonFileName] = useState<string>("");
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [previewCount, setPreviewCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetState = () => {
    setLibraries([]);
    setPreviewCount(0);
    setJsonFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) throw new Error("JSON must be an array of libraries");

        // Filter out invalid libraries
        const validLibs = json.filter(
          (lib: Library) =>
            typeof lib.id === "string" &&
            lib.id.trim() !== "" &&
            typeof lib.name === "string" &&
            lib.name.trim() !== ""
        );

        const skipped = json.length - validLibs.length;
        if (skipped > 0) {
          toast({
            title: "⚠️ Some entries skipped",
            description: `${skipped} entries were missing 'id' or 'name'.`,
          });
        }

        setLibraries(validLibs);
        setPreviewCount(validLibs.length);
        setJsonFileName(file.name);
      } catch (error: unknown) {
        const err = error as Error;
        toast({
          title: "❌ Failed to read file",
          description: err.message || "Invalid JSON structure",
        });
        resetState();
      }
    };
    reader.readAsText(file);
  };

  const handleUploadToFirestore = async () => {
    if (!libraries.length) return;

    try {
      const uploadPromises = libraries.map((lib) =>
        setDoc(doc(db, "libraries", lib.id), {
          ...lib,
          source: lib.source || "",
          last_updated: lib.last_updated || "",
          createdAt: serverTimestamp(),
        })
      );

      await Promise.all(uploadPromises);
      toast({
        title: "✅ Libraries uploaded",
        description: `${libraries.length} libraries added to Firestore.`,
      });
      resetState();
    } catch (err) {
      toast({
        title: "❌ Upload failed",
        description: "Check console for errors.",
      });
      console.error("Upload error:", err);
    }
  };

  const handleClear = () => {
    resetState();
    toast({
      title: "🧹 Cleared",
      description: "Upload state has been reset.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upload JSON Library Data</h1>
        <Button className="bg-gray-700 text-white" onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </Button>
      </div>

      <input
        type="file"
        accept="application/json"
        onChange={handleJsonUpload}
        className="mb-4"
        ref={fileInputRef}
      />

      {jsonFileName && previewCount > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          Selected file: <strong>{jsonFileName}</strong>
        </p>
      )}

      <div className="flex gap-4">
        <Button
          className="bg-blue-600 text-white"
          onClick={handleUploadToFirestore}
          disabled={previewCount === 0}
        >
          Add {previewCount} Libraries
        </Button>
        <Button className="bg-gray-500 text-white" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default AdminUploadJson;
