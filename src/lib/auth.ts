
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { registerUser } from "./firestore";

export const registerWithEmail = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  await registerUser({
    uid: user.uid,
    email,
    firstName,
    lastName,
    isAdmin: false,
    createdAt: new Date(),
  });

  return user;
};

export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export { auth };
