import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Chrome } from 'lucide-react'; // Changed from LogoGoogle to Chrome as a substitute for Google icon

interface Props {
  onSignIn: () => Promise<void>;
  isLoading: boolean;
}

export const GoogleSignInButton: React.FC<Props> = ({ onSignIn, isLoading }) => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await onSignIn();
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Chrome size={20} />
      <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
    </button>
  );
};