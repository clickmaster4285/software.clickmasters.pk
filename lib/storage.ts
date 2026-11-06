/**
 * Storage utility for client-side operations
 * Safe to use in browser only
 */

export const storage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  clear: (): void => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  },
};

// Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Project {
  _id?: string;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string | Category;
  tags: string[];
  status: 'live' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  _id: string;
  slug?: string;
  project: string | Project;
  published: boolean;
  title: string;
  seoTitle?: string;
  excerpt: string;
  client?: string;
  technologies: string[];
  thumbnail?: string;
  status: 'live' | 'in-progress' | 'completed';
  challenge: string;
  approach: string;
  results: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  slug?: string;
  published: boolean;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  email: string;
  passwordHash: string;
}
