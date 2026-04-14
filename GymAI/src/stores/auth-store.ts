import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "trainer"
  | "staff"
  | "receptionist";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  client_id: string | null;
  branch_id: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  setToken: (token: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      setToken: (accessToken) => set({ accessToken }),
      clear: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "gymai-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
