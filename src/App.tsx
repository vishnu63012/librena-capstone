import { Toaster } from "sonner"; 
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

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
import ProfilePage from "@/pages/MyAccount.tsx";
import Wishlist from "@/pages/Wishlist";
import CreateProject from "@/pages/CreateProject";
import MyProjects from "@/pages/MyProjects";
import AddLibraries from "@/pages/AddLibraries";
import AdminUploadJson from "@/pages/AdminUploadJson";

// Library Details Split View
import LibraryDetailsHome from "@/pages/LibraryDetailsHome";
import LibraryDetailsAdd from "@/pages/LibraryDetailsAdd";
import LibraryDetailsView from "@/pages/LibraryDetailsView";

// Forgot Password Page
import ForgotPassword from "@/components/auth/ForgotPassword";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-muted-foreground">
        Initializing...
      </div>
    );
  }

  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/comparison" element={<Comparison />} />
      <Route path="/compare-list" element={<CompareList />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/upload-json" element={<AdminUploadJson />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Project Routes */}
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/projects" element={<MyProjects />} />
      <Route path="/add-libraries/:projectId" element={<AddLibraries />} />

      {/* Library Details Split View */}
      <Route path="/library/home/:id" element={<LibraryDetailsHome />} />
      <Route path="/library/add/:id" element={<LibraryDetailsAdd />} />
      <Route path="/library/view/:id" element={<LibraryDetailsView />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen">
              <AppRoutes />
            </div>
            {/* ✅ Moved outside so it always renders */}
            <Toaster richColors position="bottom-right" />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
