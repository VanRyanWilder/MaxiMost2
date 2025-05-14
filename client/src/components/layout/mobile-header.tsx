import { Menu, User } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between bg-dark p-4 text-white">
      <button 
        onClick={onMenuClick}
        className="focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-bold">BeastMode</h1>
      <button className="focus:outline-none">
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}
