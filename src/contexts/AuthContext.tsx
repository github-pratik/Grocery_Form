import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Define the AuthContext type
interface AuthContextType {
  currentUser: User | null;
  signIn: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed - User:", user); // Debug here
      setCurrentUser(user);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);
  

  // Google Sign-In Function
  const signIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign-Out Function
  const signOutUser = () => signOut(auth);

  // Provide the authentication state and functions
  const value = {
    currentUser,
    signIn,
    signOut: signOutUser,
  };

  // Render children only after loading completes
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
