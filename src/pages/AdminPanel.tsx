import React, { useState, useEffect } from "react";
import {
  collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Library } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Home } from "lucide-react";

const CATEGORY_OPTIONS = [
  "Frontend", "Backend", "Database", "Analytics",
  "Authentication", "Testing", "Deployment", "DevOps",
  "AI/ML", "Utilities", "UI"
];

const AdminPanel = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [form, setForm] = useState<Partial<Library>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [view, setView] = useState<"add" | "manage" | "upload">("add");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Default");
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [uploadCount, setUploadCount] = useState(0);

  const fetchLibraries = async () => {
    const snap = await getDocs(collection(db, "libraries"));
    const data = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Library),
    }));
    setLibraries(data);
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.cost || !form.os) {
      alert("Fill required fields");
      return;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "libraries", editId), { ...form, updatedAt: serverTimestamp() });
        setEditId(null);
        alert("Library updated!");
      } else {
        await addDoc(collection(db, "libraries"), { ...form, createdAt: serverTimestamp() });
        alert("Library added!");
      }
      fetchLibraries();
      setForm({});
    } catch {
      alert("Error saving.");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "libraries", id));
    fetchLibraries();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map(id => deleteDoc(doc(db, "libraries", id))));
    setSelectedIds([]);
    fetchLibraries();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEdit = (lib: Library) => {
    setForm(lib);
    setEditId(lib.id!);
    setView("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJsonChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJsonFile(file);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const count = Array.isArray(parsed) ? parsed.length : 0;
      setUploadCount(count);
    } catch {
      setUploadCount(0);
      alert("Invalid JSON file format.");
    }
  };

  const handleJsonUpload = async () => {
    if (!jsonFile) return;
    const text = await jsonFile.text();
    try {
      const data: Library[] = JSON.parse(text);
      const valid = Array.isArray(data) ? data : [];
      await Promise.all(valid.map(lib => addDoc(collection(db, "libraries"), {
        ...lib,
        createdAt: serverTimestamp()
      })));
      setUploadCount(valid.length);
      setJsonFile(null);
      fetchLibraries();
      alert(`Successfully added ${valid.length} libraries`);
    } catch (e) {
      alert("Invalid JSON file format.");
    }
  };

  const handleClearUpload = () => {
    setJsonFile(null);
    setUploadCount(0);
    const input = document.getElementById("jsonFileInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const filtered = libraries
    .filter((lib) =>
      lib.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || lib.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOption === "Name") return a.name!.localeCompare(b.name!);
      return 0;
    });

  const categoryCounts: Record<string, number> = {};
  libraries.forEach(lib => {
    if (lib.category) {
      categoryCounts[lib.category] = (categoryCounts[lib.category] || 0) + 1;
    }
  });

  return (
    <div className="min-h-screen p-8 bg-white">
      <header className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <a href="/" className="flex items-center gap-1 text-blue-600 font-semibold">
          <Home size={18} /> Home
        </a>
      </header>

      <div className="flex justify-center gap-4 mb-6">
        <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={() => setView("add")}>Add New Library</Button>
        <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={() => setView("manage")}>Manage Libraries</Button>
        <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={() => setView("upload")}>Upload JSON File</Button>
      </div>

      {view === "add" && (
        <div className="flex justify-center">
          <div className="space-y-4 max-w-xl w-full">
            <Label>Name *</Label>
            <Input name="name" value={form.name || ""} onChange={handleFormChange} />
            <Label>Category *</Label>
            <Select onValueChange={(val) => setForm((prev) => ({ ...prev, category: val }))}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Version</Label>
            <Input name="version" value={form.version || ""} onChange={handleFormChange} />
            <Label>Cost *</Label>
            <Select onValueChange={(val) => setForm((prev) => ({ ...prev, cost: val }))}>
              <SelectTrigger><SelectValue placeholder="Select cost" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Label>OS *</Label>
            <Select onValueChange={(val) => setForm((prev) => ({ ...prev, os: val }))}>
              <SelectTrigger><SelectValue placeholder="Select OS" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mac">Mac</SelectItem>
                <SelectItem value="Windows">Windows</SelectItem>
                <SelectItem value="Linux">Linux</SelectItem>
              </SelectContent>
            </Select>
            <Label>Tags</Label>
            <Input name="tags" value={(form.tags || []).join(", ")} onChange={(e) =>
              setForm({ ...form, tags: e.target.value.split(",").map(tag => tag.trim()) })
            } />
            <Label>Size</Label>
            <Input name="size" value={form.size || ""} onChange={handleFormChange} />
            <Label>Description</Label>
            <Input name="description" value={form.description || ""} onChange={handleFormChange} />
            <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={handleSave}>
              {editId ? "Update Library" : "Save Library"}
            </Button>
          </div>
        </div>
      )}

      {view === "manage" && (
        <>
          <div className="flex gap-4 mb-4 items-center">
            <Input placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-1/3" />
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-1/4">
                <SelectValue placeholder={`All Categories (${libraries.length})`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories ({libraries.length})</SelectItem>
                {Object.entries(categoryCounts)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([cat, count]) => (
                    <SelectItem key={cat} value={cat}>
                      {cat} ({count})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSortOption}>
              <SelectTrigger className="w-1/4"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="Name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleBulkDelete}
              className={`px-4 py-2 rounded ${selectedIds.length > 0 ? "bg-[#3B82F6] text-white hover:bg-[#2563EB]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={selectedIds.length === 0}
            >
              Delete {selectedIds.length}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lib) => (
              <div key={lib.id} className="border p-4 rounded-lg shadow relative">
                <div className="absolute top-2 right-2">
                  <Checkbox checked={selectedIds.includes(lib.id!)} onCheckedChange={() => toggleSelect(lib.id!)} />
                </div>
                <div className="text-lg font-bold text-blue-900 mb-1">{lib.name}</div>
                <div className="text-sm text-gray-600">Category: {lib.category}</div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(lib)}>Edit</Button>
                  <Button size="sm" className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={() => handleDelete(lib.id!)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "upload" && (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold mb-4">Upload JSON Library Data</h2>
          <input
            id="jsonFileInput"
            type="file"
            accept=".json"
            onChange={handleJsonChange}
            className="mb-4"
          />
          <div className="flex justify-center gap-4">
            <Button
              className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
              onClick={handleJsonUpload}
              disabled={!jsonFile}
            >
              Add {uploadCount} Libraries
            </Button>
            <Button variant="secondary" onClick={handleClearUpload}>Clear</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
