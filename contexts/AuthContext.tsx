import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize a secondary Firebase app for signup operations
const secondaryApp = initializeApp(firebaseConfig, 'SignupApp');
const secondaryAuth = getAuth(secondaryApp);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid, firebaseUser.email || '');
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({
          id: userId,
          email: data.email || email,
          name: data.name || email.split('@')[0],
          role: data.role || 'STAFF',
          dob: data.dob || ''
        });
      } else {
        // If profile doesn't exist, create a default one
        const fallbackName = email.split('@')[0];
        const newProfile = {
          id: userId,
          email: email,
          name: fallbackName,
          role: 'STAFF',
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
        setUser(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback
      setUser({
        id: userId,
        email: email,
        name: email.split('@')[0],
        role: 'STAFF'
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<{success: boolean, message?: string}> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message || 'Invalid login credentials' };
    }
  };

  const signup = async (email: string, pass: string, metadata?: any): Promise<{success: boolean, message?: string}> => {
    try {
      // Use secondary auth to prevent auto-login
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
      
      // Create profile
      const fallbackName = metadata?.first_name 
        ? `${metadata.first_name} ${metadata.last_name || ''}`.trim() 
        : email.split('@')[0];
        
      await setDoc(doc(db, 'profiles', userCredential.user.uid), {
        id: userCredential.user.uid,
        email: email,
        name: fallbackName,
        role: metadata?.role || 'STAFF',
        createdAt: new Date().toISOString()
      });

      // Sign out the secondary auth just to be clean
      await signOut(secondaryAuth);

      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const resetPassword = async (email: string): Promise<{success: boolean, message?: string}> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await signOut(auth);
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, resetPassword, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};