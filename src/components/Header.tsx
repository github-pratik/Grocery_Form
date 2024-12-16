import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Header: React.FC = () => {
  const authContext = useAuth(); // Assuming signIn and signOut are in AuthContext
  const currentUser = authContext?.currentUser;
  const signOut = authContext?.signOut;
  const signIn = authContext?.signIn;
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (signIn) {
        await signIn(); // Call Google login or any login method
      } else {
        toast.error("Sign-in method is not available.");
      }
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Login failed.");
    }
  };

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
      } else {
        toast.error("Sign-out method is not available.");
      }
      toast.success("Logged out successfully!");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  return (
    <header className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Grocery List
      </h1>
      <div>
        {currentUser ? (
          <>
            <span className="mr-4 text-gray-600">
              Hello, {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
