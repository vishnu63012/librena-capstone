// lib/type.ts
import { Timestamp } from "firebase/firestore";

export interface Library {
  id?: string;
  name: string;
  category: string;
  license: string;
  version: string;
  cost: string;
  os?: string;
  size: string;
  stars?: string;
  tags?: string[];
  description?: string;
  officialUrl?: string;
  addedBy?: string;
  createdAt?: Date | Timestamp;
  isFeatured?: boolean;
  last_updated?: string | Timestamp;
  compatible?: string;
  source?: string;
}

export interface FirestoreUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  createdAt?: Date | Timestamp;
}
