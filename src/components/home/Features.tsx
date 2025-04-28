
import React, { useEffect, useRef } from 'react';
import { 
  Search, 
  BarChart4, 
  Layers, 
  Code2, 
  Lightbulb, 
  History
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Search by name, category, or operating system with our powerful partial and fuzzy search capabilities.'
  },
  {
    icon: BarChart4,
    title: 'Visual Comparisons',
    description: 'Compare libraries side-by-side with intuitive charts and graphs that highlight key differences.'
  },
  {
    icon: Layers,
    title: 'Comprehensive Data',
    description: 'Access detailed information about versions, cost, dependencies, and more for thousands of libraries.'
  },
  {
    icon: Code2,
    title: 'Code Snippets',
    description: 'See example code snippets for each library to quickly understand implementation details.'
  },
  {
    icon: Lightbulb,
    title: 'Personalized Recommendations',
    description: 'Get intelligent library recommendations based on your specific project requirements.'
  },
  {
    icon: History,
    title: 'Historical Trends',
    description: 'Track library popularity and version history to make future-proof technology choices.'
  }
];

export const Features = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('opacity-100', 'translate-y-0');
              entry.target.classList.remove('opacity-0', 'translate-y-10');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section id="features" className="py-24 px-6 bg-white dark:bg-theme-dark">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-100 rounded-full">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything You Need to Make Informed Decisions
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform offers a comprehensive suite of tools to help you find, compare, and choose the perfect libraries for your projects.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
            >
              <Card className="h-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
