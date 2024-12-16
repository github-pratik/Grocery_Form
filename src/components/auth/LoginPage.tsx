import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn();
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Failed to log in.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
};
