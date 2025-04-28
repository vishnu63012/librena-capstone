import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library } from '@/lib/type';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const CompareList = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('comparedLibraries');
    if (data) {
      try {
        const parsed = JSON.parse(data) as Library[];
        setLibraries(parsed.slice(0, 2));
      } catch (error) {
        console.error('Error parsing compare data:', error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Compare Libraries</h2>

          {libraries.length < 2 ? (
            <div className="py-16">
              <p className="text-lg text-muted-foreground mb-4">
                You need to select two libraries for comparison.
              </p>
              <Button onClick={() => navigate('/')}>➕ Add Another Library</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {libraries.map((lib) => (
                <div key={lib.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{lib.name}</h3>
                  <p><strong>Version:</strong> {lib.version}</p>
                  <p><strong>Category:</strong> {lib.category || 'N/A'}</p>
                  <p><strong>License:</strong> {lib.license || 'N/A'}</p>
                  <p><strong>Size:</strong> {lib.size || 'N/A'}</p>
                  <p><strong>Description:</strong> {lib.description || 'N/A'}</p>
                  <p><strong>Tags:</strong> {Array.isArray(lib.tags) ? lib.tags.join(', ') : lib.tags || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompareList;
