"use client";
import { User } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({
  initialValue,
  children,
}: {
  initialValue: User | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialValue);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  return useContext(AuthContext);
}
