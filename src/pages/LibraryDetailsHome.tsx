import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchLibraryById,
  getProjects,
  addLibraryToProject,
} from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Library } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Star,
  Tag,
  FileText,
  Code2,
  Globe,
  Link,
  ClipboardCopy,
} from "lucide-react";
import { Timestamp } from "firebase/firestore";

function formatDate(date: string | Timestamp | Date | undefined): string {
  try {
    if (!date) return "N/A";
    if (typeof date === "string") return new Date(date).toLocaleDateString();
    if (date instanceof Date) return date.toLocaleDateString();
    if ("toDate" in date) return date.toDate().toLocaleDateString();
    return "N/A";
  } catch {
    return "N/A";
  }
}

const LibraryDetailsHome = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();

  const [library, setLibrary] = useState<Library | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showProjectSelect, setShowProjectSelect] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id || !user || loading) return;
      const libData = await fetchLibraryById(id);
      const projData = await getProjects(user.uid);
      setLibrary(libData);
      setProjects(projData);
    };
    load();
  }, [id, user, loading]);

  const handleAddToProject = async () => {
    if (!user || !library || !selectedProjectId) return;
    await addLibraryToProject(user.uid, selectedProjectId, library.id!);
    const projectName = projects.find(p => p.id === selectedProjectId)?.name;
    toast(`${library.name} was successfully added to project ${projectName}.`);
    setSelectedProjectId(null);
    setShowProjectSelect(false);
  };

  const copyInstallCommand = () => {
    if (library) {
      navigator.clipboard.writeText(`npm install ${library.name.toLowerCase()}`);
      toast("Copied to Clipboard");
    }
  };

  if (!library) {
    return (
      <div className="p-10 text-center text-lg text-gray-500">
        Loading or library not found...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto mt-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            {library.name}
          </h1>
          <p className="text-sm text-muted-foreground">Version {library.version}</p>
          <p className="text-xs text-muted-foreground">Added on {formatDate(library.createdAt)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
          <p><strong>Category:</strong> {library.category || 'N/A'}</p>
          <p><strong>License:</strong> {library.license || 'N/A'}</p>
          <p><strong>Size:</strong> {library.size || 'N/A'}</p>
          <p><strong>Cost:</strong> {library.cost || 'Free'}</p>
          <p><strong><Star className="inline h-4 w-4 mr-1 text-yellow-500" /> Stars:</strong> {library.stars ?? 'N/A'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" /> Description
          </h2>
          <p className="text-muted-foreground">{library.description || 'No description available.'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Tag className="h-5 w-5" /> Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(library.tags)
              ? library.tags.map(tag => <Badge key={tag}>{tag}</Badge>)
              : library.tags || 'N/A'}
          </div>
        </div>

        {library.officialUrl && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-5 w-5" /> Website
            </h2>
            <a href={library.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
              {library.officialUrl}
            </a>
          </div>
        )}

        {library.source && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Link className="h-5 w-5" /> Source Code
            </h2>
            <a href={library.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
              {library.source}
            </a>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Code2 className="h-5 w-5" /> Install Command
          </h2>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-2 rounded">
            <code className="text-sm font-mono">npm install {library.name.toLowerCase()}</code>
            <button onClick={copyInstallCommand} className="ml-3 hover:scale-105 transition">
              <ClipboardCopy className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5" /> Example Code
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
            <code>{`import { ${library.name} } from '${library.name.toLowerCase()}';

const app = new ${library.name}();
app.init();
app.render();`}</code>
          </pre>
        </div>

        <div className="text-center flex flex-col items-center gap-4 mt-8">
          {!showProjectSelect && (
            <Button
              onClick={() => {
                if (projects.length === 0) {
                  toast("You have no projects created.");
                } else {
                  setShowProjectSelect(true);
                }
              }}
              className="bg-[#2563EB] text-white hover:bg-[#1E40AF]"
            >
              Add to Project
            </Button>
          )}

          {showProjectSelect && projects.length > 0 && (
            <div className="w-full max-w-xs space-y-4">
              <Select onValueChange={(val) => setSelectedProjectId(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddToProject}
                disabled={!selectedProjectId}
                className="w-full bg-[#2563EB] text-white hover:bg-[#1E40AF]"
              >
                Confirm Add to Project
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LibraryDetailsHome;
