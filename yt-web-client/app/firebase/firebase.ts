import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  UserCredential,
  Unsubscribe
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUSLc5U2Tav-mdkRE-k5qg3dD2-FalTmI",
  authDomain: "yt-clone-4249d.firebaseapp.com",
  projectId: "yt-clone-4249d",
  appId: "1:290092083760:web:129c850412a908d2b85bf5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export const signInWithGoogle = (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export const signOut = (): Promise<void> => {
  return auth.signOut();
}

/**
 * Trigger a callback when the user's auth state changes.
 * @returns A function to unsubscribe the callback.
 */
export const onAuthStateChangedHelper = (callback: (user: User | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
}