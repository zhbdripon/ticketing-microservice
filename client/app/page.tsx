"use client";

import { useUser } from "@/context/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-[90%] max-w-[600px]">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to Ticketing</CardTitle>
          <CardDescription>
            Your one-stop solution for event ticketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Welcome back, <span className="font-medium">{user.email}</span>! 👋
              </p>
              <p className="text-muted-foreground">
                You're logged in and ready to manage your tickets.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg">
                Get started by creating an account or signing in
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/auth/sign-up">Create Account</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
