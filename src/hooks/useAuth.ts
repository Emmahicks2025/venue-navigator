import { useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        checkAdminRole(firebaseUser.uid);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const roleDoc = await getDoc(doc(db, 'user_roles', userId));
      setIsAdmin(roleDoc.exists() && roleDoc.data()?.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Sign in failed' } };
    }
  };

  const signUp = async (email: string, password: string, profile?: { firstName: string; lastName: string }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Create profile document in Firestore
      if (profile) {
        await setDoc(doc(db, 'profiles', cred.user.uid), {
          user_id: cred.user.uid,
          email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Sign up failed' } };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdmin(false);
  };

  // Expose session-like object for compatibility (user?.id pattern)
  const session = user ? { user } : null;

  return { user, session, loading, isAdmin, signIn, signUp, signOut };
}
