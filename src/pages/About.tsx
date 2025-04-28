import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-6">About Librena</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Librena is a modern software library comparison platform built to help developers discover, explore, and compare the best libraries for their projects.
          </p>
          <p className="text-base text-muted-foreground mb-4">
            Our goal is to simplify the decision-making process by providing detailed information, ratings, usage statistics, and real-time filtering options for open-source and commercial libraries. Whether you're working on web development, data science, mobile apps, or backend systems, Librena makes it easy to find the most suitable libraries based on your needs.
          </p>
          <p className="text-base text-muted-foreground">
            Librena is continuously evolving with community-driven contributions and AI-powered search capabilities. We're committed to making software research transparent, fast, and developer-friendly.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
