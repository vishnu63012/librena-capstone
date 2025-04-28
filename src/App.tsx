import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "@/pages/Index";
import Comparison from "@/pages/Comparison";
import CompareList from "@/pages/CompareList";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import Wishlist from "@/pages/Wishlist";
import CreateProject from "@/pages/CreateProject";
import MyProjects from "@/pages/MyProjects";
import AddLibraries from "@/pages/AddLibraries";
import AdminUploadJson from "@/pages/AdminUploadJson"; // ✅ NEW

// Split Library Details
import LibraryDetailsHome from "@/pages/LibraryDetailsHome";
import LibraryDetailsAdd from "@/pages/LibraryDetailsAdd";
import LibraryDetailsView from "@/pages/LibraryDetailsView";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen">
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<Index />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="/compare-list" element={<CompareList />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/upload-json" element={<AdminUploadJson />} /> {/* ✅ NEW */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Projects */}
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/projects" element={<MyProjects />} />
                <Route path="/add-libraries/:projectId" element={<AddLibraries />} />

                {/* Split Library Details Routes */}
                <Route path="/library/home/:id" element={<LibraryDetailsHome />} />
                <Route path="/library/add/:id" element={<LibraryDetailsAdd />} />
                <Route path="/library/view/:id" element={<LibraryDetailsView />} />

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Toast Providers */}
              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
