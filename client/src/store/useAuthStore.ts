import { create } from "zustand";

export type UserRole = "ADMIN" | "PROJECT_MANAGER" | "SITE_ENGINEER" | "CONTRACTOR" | "CLIENT";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  setUser: (user: UserProfile | null) => void;
  setActiveRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr_pm_sarah",
    email: "pm@civilcorp.com",
    name: "Sarah Chen",
    role: "PROJECT_MANAGER",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  isAuthenticated: true,
  activeRole: "PROJECT_MANAGER",
  setUser: (user) => set({ user, isAuthenticated: !!user, activeRole: user?.role || "SITE_ENGINEER" }),
  setActiveRole: (role) => set((state) => ({
    activeRole: role,
    user: state.user ? { ...state.user, role } : null,
  })),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
