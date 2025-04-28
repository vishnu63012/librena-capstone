
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const { isAuthenticated } = useAuth();
  
  // If user is already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Create an Account</h1>
            <p className="text-muted-foreground">
              Join Librena to discover, compare, and choose the perfect software libraries for your projects.
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
