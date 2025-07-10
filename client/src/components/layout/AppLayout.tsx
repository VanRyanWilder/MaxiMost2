import { ReactNode, useState, useCallback } from 'react'; // Added useCallback
import Particles from "react-particles"; // Added Particles
import type { Engine } from "tsparticles-engine"; // Added Engine type
import { loadStarsPreset } from "tsparticles-preset-stars"; // Added loadStarsPreset

import { Sidebar } from './Sidebar';
import { Link } from 'wouter';
import { useUser } from '@/context/user-context';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User, Menu } from "lucide-react"; // Uncommented: Restore lucide-react icons
import { FirebaseUserComponent } from "@/components/auth/firebase-user"; // Assuming this handles auth display

// Placeholders for icons removed
// const Bell = (props: any) => <div {...props}>BellIcon</div>;
// const LogOut = (props: any) => <div {...props}>LogOutIcon</div>;
// const Settings = (props: any) => <div {...props}>SettingsIcon</div>;
// const User = (props: any) => <div {...props}>UserIcon</div>;
// const Menu = (props: any) => <div {...props}>MenuIcon</div>;

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string; // Optional page title for the header
}

export function AppLayout({ children, pageTitle = "MaxiMost" }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const { user, logout } = useUser(); // Basic user context

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  const particlesOptions = useCallback(() => {
    // Using a simplified version of home.tsx's options, without themeColorRgb
    return {
      preset: "stars",
      background: {
        color: {
          value: "#0A192F", // Base background color for particles canvas itself
        },
      },
      particles: {
        number: { value: 80 },
        color: { value: "#FFFFFF" },
        shape: { type: "circle" },
        opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false } },
        size: { value: { min: 0.5, max: 1.5 } },
        move: { enable: true, speed: 0.3, direction: "none", random: false, straight: false, out_mode: "out", bounce: false },
        links: { enable: false }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }
      },
      detectRetina: true,
    };
  }, []);

  return (
    <div className="flex min-h-screen relative"> {/* Removed bg-background, added relative for z-indexing context */}
      <Particles
        id="tsparticles-applayout"
        init={particlesInit}
        options={particlesOptions() as any}
        className="absolute inset-0 -z-10" // Positioned as background
      />
      {/* Sidebar */}
      {/* Ensure Sidebar and main content area have transparent backgrounds or backgrounds that work with particles */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-transparent"> {/* Added bg-transparent */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6"> {/* Adjusted header bg for glassmorphism */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2" // Only show on small screens
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" /> {/* Menu is a placeholder */}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>


            <div className="flex items-center gap-3 md:gap-4">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5" /> {/* Bell is a placeholder */}
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || "/avatar-placeholder.png"} alt={user.displayName || user.email || "User"} />
                        <AvatarFallback>
                          {user.displayName ? user.displayName.substring(0, 1).toUpperCase() : (user.email ? user.email.substring(0, 1).toUpperCase() : "U")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "MaxiMost User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <FirebaseUserComponent />
              )}
            </div>
          {/* */}
        </header>
        {/* <div>APP LAYOUT HEADER COMMENTED OUT</div> */} {/* Placeholder removed */}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
