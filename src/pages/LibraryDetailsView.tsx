import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLibraryById, addFavorite } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Library } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

const LibraryDetailsView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [library, setLibrary] = useState<Library | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const libData = await fetchLibraryById(id);
      setLibrary(libData);
    };
    load();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!user || !library) return;
    await addFavorite(user.uid, library.id!);
    toast({ title: `${library.name} added to wishlist.` });
  };

  if (!library) {
    return <div className="p-10 text-center text-lg text-gray-500">Loading or library not found...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto mt-10 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-6">{library.name}</h1>

        <div className="grid grid-cols-2 gap-4 text-sm bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <p><strong>Version:</strong> {library.version}</p>
          <p><strong>Category:</strong> {library.category || 'N/A'}</p>
          <p><strong>License:</strong> {library.license || 'N/A'}</p>
          <p><strong>Size:</strong> {library.size || 'N/A'}</p>
          <p><strong>Cost:</strong> {library.cost || 'Free'}</p>
          <p><strong>Stars:</strong> {library.stars ?? 'N/A'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{library.description || 'No description available.'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(library.tags)
              ? library.tags.map(tag => <Badge key={tag}>{tag}</Badge>)
              : library.tags || 'N/A'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Install Command</h2>
          <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded">
            npm install {library.name.toLowerCase()}
          </code>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Example Code</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
            <code>{`import { ${library.name} } from '${library.name.toLowerCase()}';

const app = new ${library.name}();
app.init();
app.render();`}</code>
          </pre>
        </div>

        <div className="text-center">
          <Button onClick={handleAddToWishlist}>❤️ Add to Wishlist</Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LibraryDetailsView;
