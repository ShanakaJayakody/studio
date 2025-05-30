
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase'; // Import db
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile // To set display name
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'; // Firestore imports
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, pass: string, displayName?: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
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

// Helper function to create or update user document in Firestore
const createUserDocument = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) { // Only create if document doesn't exist
    const { email } = user;
    // Use displayName from auth profile if available, otherwise from additionalData, then fallback
    const displayName = user.displayName || additionalData.displayName || email?.split('@')[0] || 'User';
    const createdAt = serverTimestamp();
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName,
        createdAt,
        ...additionalData, 
      });
    } catch (error) {
      console.error("Error creating user document in Firestore:", error);
    }
  }
  // If you wanted to update the document on every login (e.g., lastLogin), you could do it here.
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Optionally create/update user document here too, if it might be missed by signup/loginWithGoogle logic
        // createUserDocument ensures it only creates if new.
        await createUserDocument(user); 
      }
      setLoading(false);
    });
    return unsubscribe; // Unsubscribe on cleanup
  }, []);

  const handleSignup = async (email: string, pass: string, displayNameInput?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    if (user && displayNameInput) {
      try {
        await updateProfile(user, { displayName: displayNameInput });
        // Refresh user to get updated profile, or pass displayNameInput to createUserDocument
      } catch (error) {
        console.error("Error updating profile display name:", error);
        // Continue even if profile update fails, Firestore doc creation is important
      }
    }
    
    // Create user document in Firestore
    if (user) {
      // Pass displayNameInput so it's available if user.displayName hasn't updated yet
      await createUserDocument(user, displayNameInput ? { displayName: displayNameInput } : {});
    }

    router.push('/dashboard/home');
    return userCredential;
  };

  const handleLogin = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    // Optionally update last login timestamp in Firestore here if needed
    if (userCredential.user) {
        await createUserDocument(userCredential.user); // Ensure user doc exists on login too
    }
    router.push('/dashboard/home');
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      if (user) {
        await createUserDocument(user);
      }
      
      router.push('/dashboard/home'); 
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error; 
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
    </AuthContext.Provider>
  );
};
