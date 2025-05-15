import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { ScrollText } from '@/components/home/ScrollText';
import { Features } from '@/components/home/Features';
import { LibraryCard } from '@/components/ui/LibraryCard';
import { Button } from '@/components/ui/button';
import { ChevronUp, AlertCircle } from 'lucide-react';
import { Library } from '@/lib/type';
import {
  fetchAllLibraries,
  addFavorite,
  removeFavorite,
  getFavoriteLibraryIds,
  getProjects,
  addLibraryToProject
} from '@/lib/firestore';

const Index = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedLibraries, setSelectedLibraries] = useState<Library[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});

  const { isAuthenticated, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const libs = await fetchAllLibraries();
      setLibraries(libs);
      setFilteredLibraries(libs);
      const counts: { [key: string]: number } = {};
      for (const lib of libs) {
        if (!lib.category) continue;
        counts[lib.category] = (counts[lib.category] || 0) + 1;
      }
      setCategoryCounts(counts);
      if (user && !loading) {
        const favIds = await getFavoriteLibraryIds(user.uid);
        setFavoriteIds(favIds);
        const projs = await getProjects(user.uid);
        setProjects(projs);
      }
    };
    if (!loading) loadData();
  }, [user, loading]);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    filterLibraries(searchQuery, categoryFilter);
  }, [searchQuery, categoryFilter, sortBy, libraries]);

  const getDateValue = (
    input: string | number | Date | { toDate: () => Date } | null | undefined
  ): number => {
    if (!input) return 0;
    if (input instanceof Date) return input.getTime();
    if (typeof input === 'object' && typeof input.toDate === 'function') {
      return input.toDate().getTime();
    }
    if (typeof input === 'string' || typeof input === 'number') {
      return new Date(input).getTime();
    }
    return 0;
  };

  const filterLibraries = (query: string, cat: string) => {
    setIsSearching(true);
    setTimeout(() => {
      let results = [...libraries];
      const q = query.toLowerCase();
      results = results.filter((lib) => {
        const name = (lib.name ?? '').toLowerCase();
        const matchesQuery = q === '' || name.startsWith(q);
        const matchesCategory = !cat || lib.category === cat;
        return matchesQuery && matchesCategory;
      });
      results.sort((a, b) => {
        const aDate = getDateValue(a.last_updated);
        const bDate = getDateValue(b.last_updated);
        const aStars = parseInt(a.stars || '0');
        const bStars = parseInt(b.stars || '0');
        const aSize = parseFloat(a.size || '0');
        const bSize = parseFloat(b.size || '0');
        if (sortBy === 'recent') return bDate - aDate;
        if (sortBy === 'stars') return bStars - aStars;
        if (sortBy === 'sizeAsc') return aSize - bSize;
        if (sortBy === 'sizeDesc') return bSize - aSize;
        if (sortBy === 'nameAsc') return (a.name ?? '').localeCompare(b.name ?? '');
        if (sortBy === 'nameDesc') return (b.name ?? '').localeCompare(a.name ?? '');
        return 0;
      });
      setFilteredLibraries(results);
      setIsSearching(false);
    }, 200);
  };

  const handleSelectLibrary = (library: Library) => {
    const exists = selectedLibraries.find((lib) => lib.id === library.id);
    const updated = exists
      ? selectedLibraries.filter((lib) => lib.id !== library.id)
      : [...selectedLibraries, library].slice(0, 10);
    setSelectedLibraries(updated);
  };

  const handleAddToProject = async (projectId: string) => {
    if (!user) return;
    for (const lib of selectedLibraries) {
      await addLibraryToProject(user.uid, projectId, lib.id!);
    }
    toast({ title: `Added ${selectedLibraries.length} to project successfully.` });
    setSelectedLibraries([]);
    setShowProjectPicker(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ScrollText />
        <Features />
        <section id="libraries" className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Software Libraries</h2>
              <p className="text-lg text-muted-foreground">Browse through admin-added software libraries.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <input type="text" placeholder="Search libraries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md w-full md:w-1/2" />
              <div className="flex gap-4 flex-wrap md:flex-nowrap items-end">
                <div className="flex flex-col items-start">
                  <label className="text-sm font-medium mb-1">Filter: Category</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md">
                    <option value="">All Categories ({libraries.length})</option>
                    {Object.entries(categoryCounts).map(([cat, count]) => (
                      <option key={cat} value={cat}>{cat} ({count})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-sm font-medium mb-1">Sort:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md">
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
            </div>

            {isAuthenticated && selectedLibraries.length > 0 && (
              <div id="action-bar" className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                {selectedLibraries.length === 1 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-base">Select one more library to enable comparison.</span>
                  </div>
                )}
                <div className="flex gap-3 ml-auto">
                  {selectedLibraries.length === 2 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        sessionStorage.setItem("comparedLibraries", JSON.stringify(selectedLibraries));
                        navigate("/comparison");
                      }}
                      className="border border-black text-black"
                    >
                      Compare
                    </Button>
                  )}
                  <Button onClick={() => setShowProjectPicker(true)} className="bg-[#3B82F6] text-white hover:bg-[#2563EB]">
                    Add {selectedLibraries.length} {selectedLibraries.length === 1 ? 'Library' : 'Libraries'} to Project
                  </Button>
                  <Button variant="ghost" onClick={() => { setSelectedLibraries([]); setShowProjectPicker(false); }}>
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {isAuthenticated && showProjectPicker && (
              <div className="mb-8 max-w-md mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
                <h3 className="text-lg font-semibold mb-2">Select a project</h3>
                <div className="flex flex-col gap-2">
                  {projects.map((p) => (
                    <Button key={p.id} variant="outline" onClick={() => handleAddToProject(p.id)}>
                      ➕ {p.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isSearching ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLibraries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No libraries found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibraries.map((library) => (
                  <LibraryCard
                    key={library.id}
                    library={library}
                    isSelected={!!selectedLibraries.find((lib) => lib.id === library.id)}
                    onSelect={handleSelectLibrary}
                    context="home"
                    isFavorite={favoriteIds.includes(library.id!)}
                    onToggleFavorite={async (lib) => {
                      if (!user) return;
                      const isFav = favoriteIds.includes(lib.id!);
                      if (isFav) {
                        await removeFavorite(user.uid, lib.id!);
                        setFavoriteIds(favoriteIds.filter((id) => id !== lib.id));
                        toast({ title: `${lib.name} removed from wishlist.` });
                      } else {
                        await addFavorite(user.uid, lib.id!);
                        setFavoriteIds([...favoriteIds, lib.id!]);
                        toast({ title: `${lib.name} added to wishlist.` });
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-all hover:scale-110"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Index;