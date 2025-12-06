import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UploadCloud, ChefHat, Heart, Croissant } from "lucide-react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth() || {};
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-semibold text-foreground">
            CookSnap
          </span>
        </Link>

        <div className="max-[940px]:hidden min-[940px]:block">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-3">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md transition ${
                      isActive("/")
                        ? "bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-md"
                        : "hover:bg-accent px-4 py-2 rounded-md"
                    }`}
                  >
                    <UploadCloud size={18} className="inline mr-2" />
                    Upload
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/pantry"
                    className={`px-3 py-2 rounded-md transition ${
                      isActive("/pantry")
                        ? "bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-md"
                        : "hover:bg-accent px-4 py-2 rounded-md"
                    }`}
                  >
                    <Croissant size={18} className="inline mr-2" />
                    My Pantry
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/recipes"
                    className={`px-4 py-2 rounded-md transition ${
                      isActive("/recipes")
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "hover:bg-accent"
                    }`}
                  >
                    <ChefHat size={18} className="inline mr-2" />
                    Recipes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/favorites"
                    className={`px-3 py-2 rounded-md transition ${
                      isActive("/favorites")
                        ? "bg-accent text-accent-foreground font-semibold px-4 py-2 rounded-md"
                        : "hover:bg-accent px-4 py-2 rounded-md"
                    }`}
                  >
                    <Heart size={18} className="inline mr-2" />
                    Favorites
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="max-[940px]:hidden min-[940px]:flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photo || "https://github.com/shadcn.png"}
                  alt={user.name}
                />
                <AvatarFallback>
                  {(user?.name?.trim().split(/\s+/)[0] ||
                    user?.email ||
                    "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-sm text-foreground font-bold">
                {user.name?.split(" ")[0] || user.email || "Me"}
              </div>

              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="max-[940px]:hidden min-[940px]:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <button
            className="max-[940px]:block min-[940px]:hidden px-2"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64 p-4">
            <nav className="flex flex-col gap-3 mt-8">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded hover:bg-accent"
              >
                Upload
              </Link>

              <Link
                to="/pantry"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded hover:bg-accent"
              >
                My Pantry
              </Link>

              <Link
                to="/recipes"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded hover:bg-accent"
              >
                Recipes
              </Link>

              <Link
                to="/favorites"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded hover:bg-accent"
              >
                Favorites
              </Link>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded hover:bg-accent"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded hover:bg-accent"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded hover:bg-accent"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
