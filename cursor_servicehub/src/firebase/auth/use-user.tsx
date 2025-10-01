
'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import type { User, Provider } from '@/types';

export function useUser() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [profile, loadingProfile, errorProfile] = useDocumentData(user ? doc(db, 'users', user.uid) : null);

  const [appUser, setAppUser] = useState<User | Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(loadingAuth || loadingProfile);

    if (!loadingAuth && !loadingProfile) {
      if (user) {
        if (profile) {
          setAppUser({ ...profile, uid: user.uid } as User | Provider);
        } else {
          // First login: create minimal profile with default role
          const minimalProfile: Omit<User, 'id'> = {
            uid: user.uid,
            name: user.displayName || user.email || 'User',
            email: user.email || '',
            role: 'customer',
            status: 'active',
            joinedOn: new Date().toISOString(),
          };
          setDoc(doc(db, 'users', user.uid), minimalProfile).catch(() => {
            // non-blocking; a global error listener will surface permission issues
          });
          setAppUser({ ...minimalProfile, id: user.uid } as User);
        }
      } else {
        setAppUser(null);
      }
    }
  }, [user, profile, loadingAuth, loadingProfile]);

  return { user: appUser, isUserLoading: isLoading, error: errorAuth || errorProfile };
}
