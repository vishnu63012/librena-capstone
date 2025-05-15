import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLibraryById, addLibraryToProject } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Library } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from "firebase/firestore";
import {
  Star, Tag, Link, Code2, Globe, FileText, ClipboardCopy
} from "lucide-react";

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

const LibraryDetailsAdd = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [library, setLibrary] = useState<Library | null>(null);
  const projectId = new URLSearchParams(location.search).get("projectId");

  useEffect(() => {
    const load = async () => {
      if (!id || loading) return;
      const libData = await fetchLibraryById(id);
      setLibrary(libData);
    };
    load();
  }, [id, loading]);

  const handleAddToProject = async () => {
    if (!user || !library || !projectId) return;
    await addLibraryToProject(user.uid, projectId, library.id!);
    toast({ title: `${library.name} added to project.` });
  };

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(`npm install ${library?.name.toLowerCase()}`);
    toast({ title: "Copied to clipboard!" });
  };

  if (!library) {
    return <div className="p-10 text-center text-lg text-gray-500">Loading or library not found...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto mt-10 space-y-6">
        <div className="text-center space-y-2">
          {library.isFeatured && (
            <Badge variant="outline" className="bg-yellow-300 text-black font-semibold">
              Featured
            </Badge>
          )}
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
          <p><strong>Stars:</strong> {library.stars ?? 'N/A'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow space-y-2">
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
              ? library.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                  {tag}
                </Badge>
              ))
              : library.tags || 'N/A'}
          </div>
        </div>

        {library.officialUrl && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-5 w-5" /> Website
            </h2>
            <a
              href={library.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              {library.officialUrl}
            </a>
          </div>
        )}

        {library.source && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Link className="h-5 w-5" /> Source Code
            </h2>
            <a
              href={library.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              {library.source}
            </a>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Code2 className="h-5 w-5" /> Install Command
          </h2>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded">
            <code className="text-sm font-mono">npm install {library.name.toLowerCase()}</code>
            <button onClick={copyInstallCommand} className="ml-3 hover:scale-105 transition">
              <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
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
          {projectId && (
            <Button onClick={handleAddToProject}>➕ Add to Project</Button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LibraryDetailsAdd;
