
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, pass: string) => Promise<any>; // Return type of createUserWithEmailAndPassword
  login: (email: string, pass: string) => Promise<any>; // Return type of signInWithEmailAndPassword
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>; // Return type of sendPasswordResetEmail
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; // Unsubscribe on cleanup
  }, []);

  const handleSignup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    router.push('/dashboard/home');
    return userCredential;
  };

  const handleLogin = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    router.push('/dashboard/home');
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // User will be set by onAuthStateChanged, redirect from there or RootPage
      router.push('/dashboard/home'); 
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Handle error (e.g., show a toast message)
      throw error; // Re-throw to be caught by calling form
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const handleSendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }

  const value = {
    currentUser,
    loading,
    signup: handleSignup,
    login: handleLogin,
    loginWithGoogle,
    logout,
    sendPasswordReset: handleSendPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children} 
      {/* No !loading check here, loading state should be handled by consumer pages */}
    </AuthContext.Provider>
  );
};
