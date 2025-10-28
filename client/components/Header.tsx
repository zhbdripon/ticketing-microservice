"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/authContext";
import { useIsMobile } from "../hooks/use-is-mobile";
import { SignOutButton } from "./SignOutButton";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Header() {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <div className="w-full border-b">
      <NavigationMenu
        viewport={isMobile}
        key={user ? "auth" : "no-auth"}
        className="mx-auto max-w-7xl px-4"
      >
        <NavigationMenuList className="flex w-full justify-between">
          {/* Left side - App Name */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Ticketing</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Right side - Auth items */}
          <div className="flex items-center gap-2">
            {user && (
              <NavigationMenuItem>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </NavigationMenuItem>
            )}
            {!user && (
              <>
                {pathname === "/auth/sign-in" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/auth/sign-up">Sign Up</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                {pathname === "/auth/sign-up" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/auth/sign-in">Sign In</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                {!pathname.includes("/auth/") && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/auth/sign-up">Sign Up</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/auth/sign-in">Sign In</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </>
            )}
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <SignOutButton />
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
