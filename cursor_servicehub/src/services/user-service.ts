
'use client';

import { doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import type { User } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Creates a new user profile document in Firestore.
 * This function is non-blocking and uses the global error emitter for permission errors.
 * @param firestore - The Firestore instance.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param userData - The user data to save.
 */
export function createUserProfile(firestore: Firestore, uid: string, userData: Omit<User, 'id'>) {
  const userRef = doc(firestore, 'users', uid);
  
  const dataToSave = {
    ...userData,
    hasPaymentMethod: false, // Default value
  };

  setDoc(userRef, dataToSave)
    .catch(error => {
      console.error("Error creating user profile: ", error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: dataToSave,
        })
      );
    });
}

/**
 * Fetches a user profile from Firestore.
 * @param firestore - The Firestore instance.
 * @param uid - The user's unique ID.
 * @returns The user profile data or null if not found.
 */
export async function getUserProfile(firestore: Firestore, uid: string): Promise<User | null> {
  const userRef = doc(firestore, 'users', uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    } else {
      console.log("No such user profile!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile: ", error);
    // Emitting a global error for permission issues can be done here as well if needed
    // but getDoc is often used for read checks where you might handle the error locally.
    return null;
  }
}
