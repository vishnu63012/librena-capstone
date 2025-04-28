import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

const Legal = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'terms';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  const legalContent = {
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Terms of Service</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">1. Acceptance of Terms</h3>
            <p>
              By accessing or using Librena services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
            
            <h3 className="text-xl font-medium">2. Description of Service</h3>
            <p>
              Librena provides a platform for comparing software libraries and frameworks to help 
              developers make informed decisions about the technologies they use in their projects.
            </p>
            
            <h3 className="text-xl font-medium">3. User Accounts</h3>
            <p>
              You may be required to create an account to access certain features of our service. 
              You are responsible for maintaining the confidentiality of your account information 
              and for all activities that occur under your account.
            </p>
            
            <h3 className="text-xl font-medium">4. Intellectual Property</h3>
            <p>
              All content on Librena, including but not limited to text, graphics, logos, and software, 
              is the property of Librena or its content suppliers and is protected by United States and 
              international copyright laws.
            </p>
            
            <h3 className="text-xl font-medium">5. Limitation of Liability</h3>
            <p>
              Librena shall not be liable for any direct, indirect, incidental, special, consequential, 
              or exemplary damages resulting from your use or inability to use the service.
            </p>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Privacy Policy</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">1. Information Collection</h3>
            <p>
              We collect information that you provide directly to us when you create an account, 
              use our services, or communicate with us. This may include your name, email address, 
              and usage data.
            </p>
            
            <h3 className="text-xl font-medium">2. Use of Information</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              to communicate with you, and to personalize your experience.
            </p>
            
            <h3 className="text-xl font-medium">3. Information Sharing</h3>
            <p>
              We do not share your personal information with third parties except as described 
              in this privacy policy. We may share information with service providers who perform 
              services on our behalf.
            </p>
            
            <h3 className="text-xl font-medium">4. Data Security</h3>
            <p>
              We take reasonable measures to help protect your personal information from loss, 
              theft, misuse, and unauthorized access or disclosure.
            </p>
            
            <h3 className="text-xl font-medium">5. Your Rights</h3>
            <p>
              You have the right to access, correct, or delete your personal information. 
              You may also have the right to object to or restrict certain processing of your data.
            </p>
          </div>
        </div>
      ),
    },
    patents: {
      title: 'Patents & Certifications',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Patents & Certifications</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Patents</h3>
            <p>
              We are currently exploring options for obtaining patents for various innovative aspects 
              of the Librena application. Our team is in the process of evaluating the unique features 
              and methodologies we've developed to determine which elements qualify for patent protection.
            </p>
            <p>
              This patent exploration is part of our commitment to protecting our intellectual property 
              and ensuring that we can continue to provide innovative services to our users.
            </p>
            
            <h3 className="text-xl font-medium">Certifications</h3>
            <p>
              Librena is committed to adhering to industry standards and best practices in software 
              development and data security. We are in the process of obtaining relevant certifications 
              to demonstrate our commitment to quality and security.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-6">
              <p className="italic text-muted-foreground">
                Note: This page will be updated as our patent applications progress and as we obtain 
                additional certifications.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  };

  const currentContent = legalContent[section as keyof typeof legalContent] || legalContent.terms;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <nav className="flex mb-8 space-x-4">
              <a 
                href="/legal?section=terms" 
                className={`px-4 py-2 rounded-md transition-colors ${section === 'terms' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                Terms of Service
              </a>
              <a 
                href="/legal?section=privacy" 
                className={`px-4 py-2 rounded-md transition-colors ${section === 'privacy' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                Privacy Policy
              </a>
              <a 
                href="/legal?section=patents" 
                className={`px-4 py-2 rounded-md transition-colors ${section === 'patents' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                Patents & Certifications
              </a>
            </nav>
            
            <Separator className="mb-8" />
            
            <article className="prose prose-gray dark:prose-invert max-w-none">
              {currentContent.content}
            </article>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Legal;
