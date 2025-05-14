import { Menu, User } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between bg-background border-b border-border p-4 text-foreground sticky top-0 z-40">
      <button 
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-muted focus:outline-none"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        BeastMode
      </h1>
      <button className="p-2 rounded-md hover:bg-muted focus:outline-none">
        <User className="h-5 w-5" />
      </button>
    </div>
  );
}
