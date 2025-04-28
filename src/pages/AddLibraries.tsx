import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAllLibraries, addLibraryToProject } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ChevronUp, ArrowLeft } from "lucide-react";
import { LibraryCard } from "@/components/ui/LibraryCard";
import { Library } from "@/lib/type";

const AddLibraries = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [selected, setSelected] = useState<Library[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { user } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const libs = await fetchAllLibraries();
      setLibraries(libs);
      setFilteredLibraries(libs);

      const counts: { [key: string]: number } = {};
      for (const lib of libs) {
        if (!lib.category) continue;
        counts[lib.category] = (counts[lib.category] || 0) + 1;
      }
      setCategoryCounts(counts);
    };
    fetchData();
  }, []);

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
      const aDate = new Date(a.last_updated || "").getTime();
      const bDate = new Date(b.last_updated || "").getTime();
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

  const handleAddToProject = async () => {
    if (!user || !projectId || selected.length === 0) return;
    const promises = selected.map((lib) =>
      addLibraryToProject(user.uid, projectId, lib.id!)
    );
    await Promise.all(promises);
    toast({
      title: "✅ Libraries Added",
      description: `${selected.length} libraries added to the project.`,
    });
    setLibraries((prev) => prev.filter((lib) => !selected.find((s) => s.id === lib.id)));
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

        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Add Libraries to Project</h1>
          <div className="fixed top-24 right-6 z-50 flex gap-2">
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
              className="bg-black text-white"
            >
              Add {selected.length} to Project
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4 mb-6">
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
