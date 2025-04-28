// lib/type.ts

export interface Library {
  id?: string;
  name: string;
  category: string;
  license: string;
  version: string;
  cost: string;
  os?: string; 
  size: string;
  stars: string;
  tags: string[];
  description: string;
  officialUrl?: string;
  addedBy?: string;
  createdAt: Date;
  isFeatured?: boolean;
  last_updated?: string; 
  compatible?: string;
  
  
  source?: string; 

}

export interface FirestoreUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  createdAt?: Date;
}
