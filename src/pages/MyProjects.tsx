import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  getProjects,
  fetchLibraryById,
  deleteProject,
  renameProject,
  deleteLibraryFromProject
} from '@/lib/firestore';
import { LibraryCard } from '@/components/ui/LibraryCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileDown, Trash2, Pencil } from 'lucide-react';
import jsPDF from 'jspdf';
import { Library } from '@/lib/type';

type UserProject = {
  id: string;
  name: string;
  libraries: string[];
  createdAt?: any;
};

const MyProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [librariesByProject, setLibrariesByProject] = useState<Record<string, Library[]>>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [selectedLibraries, setSelectedLibraries] = useState<Library[]>([]);

  useEffect(() => {
    const loadProjectsAndLibraries = async () => {
      if (!user || loading) return;

      const userProjects = await getProjects(user.uid);
      setProjects(userProjects);

      const libMap: Record<string, Library[]> = {};
      for (const proj of userProjects) {
        const libs: Library[] = [];
        for (const id of proj.libraries || []) {
          const lib = await fetchLibraryById(id);
          if (lib) libs.push(lib);
        }
        libMap[proj.id] = libs;
      }

      setLibrariesByProject(libMap);
    };

    loadProjectsAndLibraries();
  }, [user, loading]);

  const handleAddLibraries = (projectId: string) => {
    navigate(`/add-libraries/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!user) return;
    await deleteProject(user.uid, projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleExportPDF = (project: UserProject) => {
    const doc = new jsPDF();
    const libs = librariesByProject[project.id] || [];

    doc.setFontSize(16);
    doc.text(`Project: ${project.name}`, 10, 10);

    let y = 20;

    libs.forEach((lib, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.text(`Library ${index + 1}: ${lib.name}`, 10, y);
      y += 7;

      const desc = lib.description ? lib.description.slice(0, 300) : "No description";
      const lines = doc.splitTextToSize(`Description: ${desc}`, 180);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 4;
    });

    doc.save(`${project.name}-libraries.pdf`);
  };

  const handleRename = async () => {
    if (!user || !renamingProjectId || !newName.trim()) return;
    await renameProject(user.uid, renamingProjectId, newName);
    setProjects((prev) =>
      prev.map((p) => (p.id === renamingProjectId ? { ...p, name: newName } : p))
    );
    setRenamingProjectId(null);
    setNewName('');
  };

  const handleSelectLibrary = (lib: Library) => {
    const exists = selectedLibraries.find((l) => l.id === lib.id);
    if (exists) {
      setSelectedLibraries(selectedLibraries.filter((l) => l.id !== lib.id));
    } else {
      setSelectedLibraries([...selectedLibraries, lib]);
    }
  };

  const handleDeleteLibraries = async () => {
    if (!user || !selectedLibraries.length || !selectedProjectId) return;
    for (const lib of selectedLibraries) {
      await deleteLibraryFromProject(user.uid, selectedProjectId, lib.id!);
    }
    setLibrariesByProject((prev) => {
      const updated = prev[selectedProjectId]?.filter(
        (lib) => !selectedLibraries.find((sel) => sel.id === lib.id)
      );
      return { ...prev, [selectedProjectId]: updated || [] };
    });
    setSelectedLibraries([]);
  };

  const handleCompare = () => {
    if (selectedLibraries.length === 2) {
      sessionStorage.setItem("comparedLibraries", JSON.stringify(selectedLibraries));
      navigate("/comparison");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 pt-24">
        <h1 className="text-3xl font-bold mb-6">My Projects</h1>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">You haven’t created any projects yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="mb-8 border rounded-xl p-4">
              {renamingProjectId === project.id ? (
                <div className="flex items-center gap-2 mb-3">
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                  <Button size="sm" onClick={handleRename}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setRenamingProjectId(null)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-3 flex-wrap">
                  <h2 className="text-xl font-semibold">
                    {project.name}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({librariesByProject[project.id]?.length || 0} libraries)
                    </span>
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="ghost" onClick={() => {
                      setRenamingProjectId(project.id);
                      setNewName(project.name);
                    }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-white text-black border border-gray-300 hover:bg-gray-100" onClick={() => {
                      setSelectedProjectId(project.id);
                      setSelectedLibraries([]);
                    }}>
                      View
                    </Button>
                    <Button size="sm" className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={() => handleAddLibraries(project.id)}>
                      <Plus className="mr-2 h-4 w-4" /> Add More Libraries
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleExportPDF(project)}>
                      <FileDown className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedProjectId === project.id && (
                <>
                  <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => setSelectedProjectId(null)}
                  >
                    ← Back to All Projects
                  </Button>

                  <div className="flex justify-end gap-4 mb-4">
                    {selectedLibraries.length === 2 && (
                      <Button variant="outline" onClick={handleCompare}>
                        Compare
                      </Button>
                    )}
                    {selectedLibraries.length > 0 && (
                      <Button className="bg-[#3B82F6] text-white hover:bg-[#2563EB]" onClick={handleDeleteLibraries}>
                        Delete {selectedLibraries.length} Libraries
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {librariesByProject[project.id]?.map((lib) => (
                      <LibraryCard
                        key={lib.id}
                        library={lib}
                        isSelected={!!selectedLibraries.find((l) => l.id === lib.id)}
                        onSelect={handleSelectLibrary}
                        viewOnly={false}
                        context="view"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyProjects;
