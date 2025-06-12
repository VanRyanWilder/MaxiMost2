import { Menu, User } from "lucide-react";
// import { Logo } from "@/components/ui/logo"; // Replaced with image logo
import maximostLogo from '@/assets/maximost-logo.png'; // Import the image logo

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
      {/* Added image logo */}
      <img src={maximostLogo} alt="Maximost Logo" className="h-8 w-auto" />
      <button className="p-2 rounded-md hover:bg-muted focus:outline-none">
        <User className="h-5 w-5" />
      </button>
    </div>
  );
}
