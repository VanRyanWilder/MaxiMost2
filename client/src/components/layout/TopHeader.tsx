import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, UserCircle } from 'lucide-react'; // UserCircle as placeholder for profile
import { Logo } from '@/components/ui/logo'; // Assuming Logo component exists
import { useUser } from '@/context/user-context';
// Potentially import SettingsPanel or a UserDropdown component here later

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden mr-2"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Logo */}
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Logo size="small" /> {/* Using existing Logo component */}
          {/* <span className="hidden font-bold sm:inline-block">MaxiMost</span> */}
        </Link>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* User Profile / Settings - Placeholder */}
        <div className="flex items-center space-x-3">
          {user ? (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.displayName || user.email}
            </span>
          ) : null}
          {/* This could be a DropdownMenu with user options & settings */}
          <Button variant="ghost" size="icon">
            <UserCircle className="h-6 w-6" />
            <span className="sr-only">User Profile</span>
          </Button>
          {/* Or <SettingsPanel /> if that's the main user interaction point */}
        </div>
      </div>
    </header>
  );
};
