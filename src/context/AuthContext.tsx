import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { registerUser, getUserByUID } from "@/lib/firestore";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ExtendedUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  firebaseUser: User | null;
  user: ExtendedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  loginWithGoogle: async () => false,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserByUID(firebaseUser.uid);
        if (profile) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            isAdmin: profile.isAdmin || false,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserByUID(userCredential.user.uid);
      if (!profile) throw new Error("user-not-found");

      setFirebaseUser(userCredential.user);
      setUser({
        uid: userCredential.user.uid,
        email,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        isAdmin: profile.isAdmin || false,
      });

      return true;
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code === "auth/user-not-found") throw new Error("user-not-found");
      if (err.code === "auth/wrong-password") throw new Error("wrong-password");
      if (err.code === "auth/invalid-credential") throw new Error("invalid-credentials");
      if (error instanceof Error && error.message === "user-not-found") throw new Error("user-not-found");

      console.error("🔥 Login error:", err);
      throw new Error("login-failed");
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      setFirebaseUser(firebaseUser);

      let profile = await getUserByUID(firebaseUser.uid);
      if (!profile) {
        const [firstName = "", lastName = ""] = firebaseUser.displayName?.split(" ") || ["", ""];
        await registerUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName,
          lastName,
          isAdmin: false,
        });
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName,
          lastName,
          isAdmin: false,
        };
      }

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: profile.firstName,
        lastName: profile.lastName,
        isAdmin: profile.isAdmin || false,
      });

      return true;
    } catch (error) {
      console.error("🔥 Google Sign-in error:", error);
      return false;
    }
  };

  const logout = async () => {
    await auth.signOut();
    setFirebaseUser(null);
    setUser(null);
  };

  const register = async ({ firstName, lastName, email, password }: RegisterData): Promise<boolean> => {
    try {
      const normalizedEmail = email.toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      await registerUser({
        uid: userCredential.user.uid,
        email: normalizedEmail,
        firstName,
        lastName,
        isAdmin: false,
      });

      setFirebaseUser(userCredential.user);
      setUser({
        uid: userCredential.user.uid,
        email: normalizedEmail,
        firstName,
        lastName,
        isAdmin: false,
      });

      return true;
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code === "auth/email-already-in-use") {
        throw new Error("email-already-in-use");
      } else {
        console.error("🔥 Registration error:", err);
        throw err;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        login,
        logout,
        register,
        loginWithGoogle,
        isAuthenticated: !!firebaseUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
