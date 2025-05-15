import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchAllLibraries, getFavoriteLibraryIds, removeFavorite } from '@/lib/firestore';
import { Library } from '@/lib/type';
import { LibraryCard } from '@/components/ui/LibraryCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const Wishlist = () => {
  const { user, isAuthenticated, loading } = useAuth(); 

  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Library[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || loading) return; 


      const allLibraries = await fetchAllLibraries();
      const favIds = await getFavoriteLibraryIds(user.uid);
      const favLibraries = allLibraries.filter((lib) => favIds.includes(lib.id!));
      setFavorites(favLibraries);
    };

    loadFavorites();
  }, [user, loading]); 


  const handleRemoveFavorite = async (libraryId: string) => {
    if (!user) return;

    const libraryToRemove = favorites.find((lib) => lib.id === libraryId);

    await removeFavorite(user.uid, libraryId);
    setFavorites((prev) => prev.filter((lib) => lib.id !== libraryId));

    toast({
      title: '❌ Removed from Wishlist',
      description: `"${libraryToRemove?.name || 'Library'}" was removed.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h2>

          {!isAuthenticated ? (
            <p className="text-center text-lg text-muted-foreground">
              Please login to view your wishlist.
            </p>
          ) : favorites.length === 0 ? (
            <p className="text-center text-lg text-muted-foreground">
              You haven't added any favorites yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((library) => (
                <LibraryCard
                  key={library.id}
                  library={library}
                  isSelected={false}
                  isFavorite={true}
                  onSelect={() => {}}
                  onToggleFavorite={() => handleRemoveFavorite(library.id!)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
