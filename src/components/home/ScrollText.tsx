
import React from 'react';

const scrollTexts = [
  "Software libraries are essential building blocks for modern development",
  "Libraries save time by providing pre-written, tested code",
  "Choosing the right library can significantly improve your application's performance",
  "Libraries reduce development time and maintenance costs",
  "Understanding library compatibility is crucial for successful integration",
  "Popular libraries often have strong community support and documentation",
  "Comparing libraries helps you make better architectural decisions"
];

export const ScrollText = () => {
  return (
    <div className="relative py-8 overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-theme-dark dark:to-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="animate-marquee whitespace-nowrap flex">
        {scrollTexts.concat(scrollTexts).map((text, index) => (
          <div 
            key={index} 
            className="mx-8 text-lg font-medium text-gray-600 dark:text-gray-300"
          >
            <span className="text-primary dark:text-theme-highlight">•</span> {text}
          </div>
        ))}
      </div>
    </div>
  );
};
