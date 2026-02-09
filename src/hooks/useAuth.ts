import { useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  PhoneAuthProvider,
  RecaptchaVerifier,
  linkWithCredential,
  PhoneMultiFactorGenerator,
  multiFactor,
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

  const signUp = async (email: string, password: string, profile?: { firstName: string; lastName: string; phone?: string }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (profile) {
        await setDoc(doc(db, 'profiles', cred.user.uid), {
          user_id: cred.user.uid,
          email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone || null,
          phone_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return { error: null, user: cred.user };
    } catch (err: any) {
      return { error: { message: err.message || 'Sign up failed' }, user: null };
    }
  };

  // Store recaptcha verifier to avoid duplicate rendering
  let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

  const sendPhoneVerification = async (phoneNumber: string, recaptchaContainerId: string) => {
    try {
      // Clear previous reCAPTCHA if exists
      if (recaptchaVerifierInstance) {
        recaptchaVerifierInstance.clear();
        recaptchaVerifierInstance = null;
      }
      // Clear the container element
      const container = document.getElementById(recaptchaContainerId);
      if (container) container.innerHTML = '';

      recaptchaVerifierInstance = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: 'invisible',
      });
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifierInstance);
      return { verificationId, error: null };
    } catch (err: any) {
      // Clean up on error too
      if (recaptchaVerifierInstance) {
        try { recaptchaVerifierInstance.clear(); } catch {}
        recaptchaVerifierInstance = null;
      }
      return { verificationId: null, error: { message: err.message || 'Failed to send verification code' } };
    }
  };

  const verifyPhoneCode = async (verificationId: string, code: string, userId: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      // Link phone credential to the current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        await linkWithCredential(currentUser, credential);
      }
      // Update profile as verified
      await setDoc(doc(db, 'profiles', userId), { phone_verified: true, updated_at: new Date().toISOString() }, { merge: true });
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'Invalid verification code' } };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdmin(false);
  };

  const session = user ? { user } : null;

  return { user, session, loading, isAdmin, signIn, signUp, signOut, sendPhoneVerification, verifyPhoneCode };
}
