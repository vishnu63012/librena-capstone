import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchLibrariesNotInProject,
  addLibraryToProject,
  addFavorite,
  removeFavorite,
  getFavoriteLibraryIds,
} from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ChevronUp, ArrowLeft, AlertCircle } from "lucide-react";
import { LibraryCard } from "@/components/ui/LibraryCard";
import { Library } from "@/lib/type";
import { Timestamp } from "firebase/firestore";

const AddLibraries = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [selected, setSelected] = useState<Library[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { user, loading } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const getTime = (value: string | Timestamp | undefined): number => {
    if (!value) return 0;
    if (typeof value === "string") return new Date(value).getTime();
    if ("toDate" in value) return value.toDate().getTime();
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !projectId || loading) return;
      const libs = await fetchLibrariesNotInProject(user.uid, projectId);
      setLibraries(libs);
      setFilteredLibraries(libs);

      const counts: { [key: string]: number } = {};
      for (const lib of libs) {
        if (!lib.category) continue;
        counts[lib.category] = (counts[lib.category] || 0) + 1;
      }
      setCategoryCounts(counts);
    };

    const fetchWishlist = async () => {
      if (user) {
        const favIds = await getFavoriteLibraryIds(user.uid);
        setWishlist(favIds);
      }
    };

    fetchData();
    fetchWishlist();
  }, [user, projectId, loading]);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let results = [...libraries];

    results = results.filter((lib) => {
      const name = (lib.name ?? "").toLowerCase();
      const matchesQuery = q === "" || name.startsWith(q);
      const matchesCategory = category === "" || lib.category === category;
      return matchesQuery && matchesCategory;
    });

    results.sort((a, b) => {
      const aDate = getTime(a.last_updated);
      const bDate = getTime(b.last_updated);
      const aStars = parseInt(a.stars || "0");
      const bStars = parseInt(b.stars || "0");
      const aSize = parseFloat(a.size || "0");
      const bSize = parseFloat(b.size || "0");

      if (sort === "recent") return bDate - aDate;
      if (sort === "stars") return bStars - aStars;
      if (sort === "sizeAsc") return aSize - bSize;
      if (sort === "sizeDesc") return bSize - aSize;
      if (sort === "nameAsc") return (a.name ?? "").localeCompare(b.name ?? "");
      if (sort === "nameDesc") return (b.name ?? "").localeCompare(a.name ?? "");
      return 0;
    });

    setFilteredLibraries(results);
  }, [search, category, sort, libraries]);

  const toggleSelect = (lib: Library) => {
    setSelected((prev) => {
      const exists = prev.find((l) => l.id === lib.id);
      return exists ? prev.filter((l) => l.id !== lib.id) : [...prev, lib].slice(0, 10);
    });
  };

  const toggleWishlist = async (libId: string) => {
    if (!user) return;
    const isFav = wishlist.includes(libId);
    if (isFav) {
      await removeFavorite(user.uid, libId);
      setWishlist(wishlist.filter((id) => id !== libId));
    } else {
      await addFavorite(user.uid, libId);
      setWishlist([...wishlist, libId]);
    }
  };

  const handleAddToProject = async () => {
    if (!user || !projectId || selected.length === 0) return;
    const promises = selected.map((lib) =>
      addLibraryToProject(user.uid, projectId, lib.id!)
    );
    await Promise.all(promises);

    toast(`${selected.length} libraries added to the project successfully.`);
    setSelected([]);
    navigate("/projects");
  };

  const handleCompare = () => {
    if (selected.length !== 2) return;
    sessionStorage.setItem("comparedLibraries", JSON.stringify(selected));
    navigate("/comparison");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Projects
        </Button>

        <h1 className="text-3xl font-bold mb-6">Add Libraries to Project</h1>

        <div className="flex flex-wrap items-end gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search libraries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2"
          />
          <div className="flex flex-col items-start">
            <label className="text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="">All Categories ({libraries.length})</option>
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label className="text-sm font-medium mb-1">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="">All</option>
              <option value="recent">Recently Updated</option>
              <option value="stars">Top Rated</option>
              <option value="sizeAsc">Size: Smallest First</option>
              <option value="sizeDesc">Size: Largest First</option>
              <option value="nameAsc">A-Z (Name)</option>
              <option value="nameDesc">Z-A (Name)</option>
            </select>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            {selected.length === 1 && (
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground w-full sm:w-auto">
                <AlertCircle className="h-5 w-5" />
                Select one more library to enable comparison.
              </div>
            )}

            <div className="flex gap-3 ml-auto">
              {selected.length === 2 && (
                <Button
                  variant="outline"
                  onClick={handleCompare}
                  className="border border-black text-black"
                >
                  Compare
                </Button>
              )}
              <Button
                disabled={selected.length === 0}
                onClick={handleAddToProject}
                className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
              >
                Add {selected.length} to Project
              </Button>
              <Button variant="ghost" onClick={() => setSelected([])}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {filteredLibraries.length === 0 ? (
          <p className="text-muted-foreground">No libraries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibraries.map((lib) => (
              <LibraryCard
                key={lib.id}
                library={lib}
                isSelected={!!selected.find((l) => l.id === lib.id)}
                onSelect={toggleSelect}
                context="add"
                viewOnly={false}
                isFavorite={wishlist.includes(lib.id)}
                onToggleFavorite={() => toggleWishlist(lib.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-black text-white rounded-full shadow-lg transition-all hover:scale-110"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default AddLibraries;