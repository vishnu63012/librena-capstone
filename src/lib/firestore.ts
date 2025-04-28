import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { Library, FirestoreUser } from "./type";

// ✅ Save to global /libraries collection
export const saveLibrary = async (library: Library): Promise<string> => {
  const docRef = await addDoc(collection(db, "libraries"), {
    ...library,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const saveMultipleLibraries = async (libraries: Library[]): Promise<void> => {
  const promises = libraries.map((lib) =>
    setDoc(doc(db, "libraries", lib.id!), {
      ...lib,
      createdAt: serverTimestamp(),
    })
  );
  await Promise.all(promises);
};

export const fetchAllLibraries = async (): Promise<Library[]> => {
  const snapshot = await getDocs(collection(db, "libraries"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Library[];
};

export const fetchLibraryById = async (id: string): Promise<Library | null> => {
  const docRef = doc(db, "libraries", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Library) : null;
};

export const deleteLibraryById = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "libraries", id));
};

export const updateLibrary = async (id: string, library: Library): Promise<void> => {
  const { id: _, ...rest } = library;
  await updateDoc(doc(db, "libraries", id), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
};

// ✅ Users
export const registerUser = async (user: FirestoreUser): Promise<string> => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin || false,
    createdAt: new Date(),
  });
  return user.uid;
};

export const getUserByUID = async (uid: string): Promise<FirestoreUser | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as FirestoreUser) : null;
};

// ✅ FAVORITES (Wishlist)
export const addFavorite = async (userId: string, libId: string): Promise<void> => {
  await setDoc(doc(db, "users", userId, "favorites", libId), {
    addedAt: serverTimestamp(),
  });
};

export const removeFavorite = async (userId: string, libraryId: string): Promise<void> => {
  await deleteDoc(doc(db, "users", userId, "favorites", libraryId));
};

export const getFavoriteLibraryIds = async (userId: string): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));
  return snapshot.docs.map(doc => doc.id);
};

export const getAllFavorites = async (userId: string): Promise<Library[]> => {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Library[];
};

// ✅ COMPARE LIST
export const addToCompareList = async (userId: string, libId: string): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    compareList: arrayUnion(libId),
  });
};

export const removeFromCompareList = async (userId: string, libId: string): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    compareList: arrayRemove(libId),
  });
};

export const getCompareListLibraries = async (userId: string): Promise<Library[]> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (!userData || !userData.compareList || !Array.isArray(userData.compareList)) return [];

  const ids: string[] = userData.compareList;

  const promises = ids.map(async (id) => {
    const snap = await getDoc(doc(db, "libraries", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Library) : null;
  });

  const results = await Promise.all(promises);
  return results.filter((lib): lib is Library => lib !== null);
};

// ✅ PROJECT BUILDER
export const createProject = async (userId: string, projectName: string): Promise<string> => {
  const docRef = await addDoc(collection(db, "users", userId, "projects"), {
    name: projectName,
    createdAt: serverTimestamp(),
    libraries: [],
  });
  return docRef.id;
};

export const saveProject = async (uid: string, projectData: { name: string; category: string; libraries: string[] }) => {
  const docRef = await addDoc(collection(db, `users/${uid}/projects`), {
    ...projectData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const addLibraryToProject = async (userId: string, projectId: string, libId: string): Promise<void> => {
  const projectRef = doc(db, "users", userId, "projects", projectId);
  await updateDoc(projectRef, {
    libraries: arrayUnion(libId),
  });
};

// ✅ Delete library from project
export const deleteLibraryFromProject = async (
  userId: string,
  projectId: string,
  libId: string
): Promise<void> => {
  const projectRef = doc(db, "users", userId, "projects", projectId);
  await updateDoc(projectRef, {
    libraries: arrayRemove(libId),  // Remove the library from the project's libraries list
  });
};

export const renameProject = async (userId: string, projectId: string, newName: string): Promise<void> => {
  const projectRef = doc(db, "users", userId, "projects", projectId);
  await updateDoc(projectRef, {
    name: newName,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (userId: string, projectId: string): Promise<void> => {
  const projectRef = doc(db, "users", userId, "projects", projectId);
  await deleteDoc(projectRef);
};

type UserProject = {
  id: string;
  name: string;
  createdAt?: Timestamp | null;
  libraries: string[];
};

export const getProjects = async (userId: string): Promise<UserProject[]> => {
  const snapshot = await getDocs(collection(db, "users", userId, "projects"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProject[];
};
