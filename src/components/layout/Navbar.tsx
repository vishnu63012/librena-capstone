import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Home,
  Shield,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-theme-dark/80 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* App Name */}
          <Link
            to="/"
            className="flex items-center font-extrabold text-3xl tracking-tight text-blue-700 dark:text-blue-300"
          >
            Librena
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center bg-transparent hover:bg-transparent"
              onClick={() => navigate("/")}
            >
              <Home size={16} className="mr-2" />
              Home
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  onClick={() => navigate("/wishlist")}
                  variant="ghost"
                  className="flex items-center"
                >
                  <Heart size={16} className="mr-2" />
                  Wishlist
                </Button>

                <Button
                  onClick={() => navigate("/projects")}
                  variant="ghost"
                  className="flex items-center"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  My Projects
                </Button>
              </>
            )}

            {user?.isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="flex items-center"
              >
                <Shield size={16} className="mr-2" />
                Admin Dashboard
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9">
                    <User size={16} className="mr-2" />
                    {user?.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus size={16} className="mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-theme-dark shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/")}
            >
              <Home size={16} className="mr-2" />
              Home
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  onClick={() => navigate("/wishlist")}
                  className="w-full flex items-center"
                >
                  <Heart size={16} className="mr-2" />
                  Wishlist
                </Button>

                <Button
                  onClick={() => navigate("/projects")}
                  className="w-full flex items-center"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  My Projects
                </Button>
              </>
            )}

            {user?.isAdmin && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/admin")}
              >
                <Shield size={16} className="mr-2" />
                Admin Dashboard
              </Button>
            )}

            <div className="pt-2 border-t">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={logout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn size={16} className="mr-2" />
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/register")}
                  >
                    <UserPlus size={16} className="mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
