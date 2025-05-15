import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset link sent to ${email}`);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Librena logo in light blue like homepage */}
      <div className="p-6">
        <Link
          to="/"
          className="text-3xl font-extrabold text-[#3B82F6] tracking-tight"
        >
          Librena
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md border border-gray-200 rounded-lg p-8 shadow-md bg-white">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Reset Your Password
          </h2>

          {message && (
            <Alert variant="default" className="mb-4 border-green-500 text-green-700 bg-green-50">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border border-gray-300 rounded px-4 py-2 w-full"
            />

            <Button
              type="submit"
              className="w-full bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded px-4 py-2"
            >
              Send Reset Link
            </Button>

            <div className="text-center mt-2">
              <Link to="/login" className="text-sm text-blue-700 hover:text-blue-900">
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
