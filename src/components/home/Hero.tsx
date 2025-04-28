import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const handleSearchLibrariesClick = () => {
    navigate('/', { replace: false });
    setTimeout(() => {
      const el = document.getElementById('libraries');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCreateProjectClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to create a project.",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      navigate("/create-project");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-theme-dark dark:to-theme-dark z-0 overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div
        ref={heroRef}
        className="container mx-auto px-6 py-16 relative z-10 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-100 rounded-full">
            Compare. Choose. Create.
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-balance">
            Find the Perfect <span className="text-gradient">Software Libraries</span> for Your Next Project
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Compare features, performance, compatibility, and more across thousands of libraries. Make informed decisions with our comprehensive comparison tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleSearchLibrariesClick}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
            >
              Search Libraries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleCreateProjectClick}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold"
            >
              Create a Project
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">10,000+</span>
              <span className="text-sm text-muted-foreground">Libraries</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">50+</span>
              <span className="text-sm text-muted-foreground">Categories</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">1M+</span>
              <span className="text-sm text-muted-foreground">Developers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">100%</span>
              <span className="text-sm text-muted-foreground">Free Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
