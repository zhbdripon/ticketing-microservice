"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/authContext";
import axios from "axios";

export function SignOutButton() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      const response = await axios.post('/api/users/sign-out');
      if (response.status === 204) {
        setUser(null);
        await router.refresh();
        router.replace('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/';
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="text-sm font-medium transition-colors hover:text-primary"
    >
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </button>
  );
}