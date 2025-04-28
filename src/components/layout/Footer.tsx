import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  // Function to handle scrolling to top when clicking legal links
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-50 dark:bg-theme-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Librena</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your comprehensive platform for comparing software libraries. Find the perfect libraries for your next project with our detailed comparison tools.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="text-muted-foreground hover:text-primary transition-colors">
                  Compare Libraries
                </Link>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-medium pt-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/legal?section=terms" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={scrollToTop}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal?section=privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={scrollToTop}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal?section=patents" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={scrollToTop}
                >
                  Patents & Certifications
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Us</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div>
                <p className="font-semibold">Address</p>
                <div className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>28 Stonecroft Road, Baltimore, MD, 21229</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <div className="flex items-center">
                  <Phone size={18} className="mr-2 flex-shrink-0" />
                  <p>+1 (667) 369-9691</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <div className="flex items-center">
                  <Mail size={18} className="mr-2 flex-shrink-0" />
                  <p>vishnuvarma63012@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium">Subscribe</h3>
              <p className="text-sm text-muted-foreground py-2">
                Stay updated with our latest news and updates.
              </p>
              <form className="flex mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Librena. All rights reserved. UMBC Capstone Project.
          </p>
        </div>
      </div>
    </footer>
  );
};
