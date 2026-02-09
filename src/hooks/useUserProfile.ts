import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const docSnap = await getDoc(doc(db, 'profiles', user.uid));
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    },
    enabled: !!user,
  });
}
