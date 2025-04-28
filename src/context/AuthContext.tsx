import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/auth";
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
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
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
        try {
          const profile = await getUserByUID(firebaseUser.uid);
          if (profile && profile.firstName && profile.lastName) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName: profile.firstName,
              lastName: profile.lastName,
              isAdmin: profile.isAdmin || false,
            });
          } else {
            const [firstName = "", lastName = ""] = firebaseUser.displayName?.split(" ") || [];
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName,
              lastName,
              isAdmin: false,
            });
          }
        } catch (err) {
          console.error("🔥 Error fetching user profile:", err);
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

      setFirebaseUser(userCredential.user);

      if (profile && profile.firstName && profile.lastName) {
        setUser({
          uid: userCredential.user.uid,
          email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          isAdmin: profile.isAdmin || false,
        });
      } else {
        const [firstName = "", lastName = ""] = userCredential.user.displayName?.split(" ") || [];
        setUser({
          uid: userCredential.user.uid,
          email,
          firstName,
          lastName,
          isAdmin: false,
        });
      }

      return true;
    } catch (error: unknown) {
      console.error("❌ Firebase login error:", error);
      throw error; // ❗️This is the important part — so LoginForm gets the actual error.code
    }
  };

  const logout = async () => {
    await auth.signOut();
    setFirebaseUser(null);
    setUser(null);
  };

  const register = async ({ firstName, lastName, email, password }: RegisterData): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      await registerUser({
        uid: userCredential.user.uid,
        email: email.toLowerCase(),
        firstName,
        lastName,
        isAdmin: false,
      });

      setFirebaseUser(userCredential.user);
      setUser({
        uid: userCredential.user.uid,
        email: email.toLowerCase(),
        firstName,
        lastName,
        isAdmin: false,
      });

      return true;
    } catch (error: unknown) {
      console.error("❌ Registration error:", error);
      return false;
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
        isAuthenticated: !!firebaseUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
