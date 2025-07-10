import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"; // Commented out for FIX-15 as they cause error #310
// Updated import to include the new helper function
import { getGroupedSidebarLinks, type SidebarLink } from "@/lib/sidebar-links";
import { X, Menu, ChevronDown, ChevronRight } from "lucide-react"; // Restoring lucide-react icons

// Placeholders for icons removed
// const X = (props: any) => <div {...props}>XIcon</div>;
// const Menu = (props: any) => <div {...props}>MenuIcon</div>;
// const ChevronDown = (props: any) => <div {...props}>ChevronDownIcon</div>;
// const ChevronRight = (props: any) => <div {...props}>ChevronRightIcon</div>;


interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [location] = useLocation();
  // Updated to reflect current sections and default expansion for TOOLS and LEARN
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,      // Main navigation, typically good to keep open
    tools: true,     // As per requirement
    learn: true,     // As per requirement (was already true)
    connect: false,  // New section, default to closed or true as needed
    // Removed 'pillars' and 'community' as they are not in current sidebar-links.tsx
  });
  
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  // Use the new helper function to get grouped links
  const sections = getGroupedSidebarLinks();
  
  // Enhanced renderNavItem for UIX-14
  const renderNavItem = (link: SidebarLink, isSubmenuItem = false) => {
    const isActive = location === link.href;
    return (
      <div key={link.href} className={cn("my-0.5", isSubmenuItem ? "ml-0" : "")}>
        <Link href={link.href}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start text-sm h-9 px-3", // Consistent padding and height
              isActive ? "font-semibold text-primary" : "font-normal text-muted-foreground",
              !isActive && "hover:bg-muted hover:text-foreground" // Clearer hover state
            )}
          >
            <span className="mr-3 w-5 h-5 flex items-center justify-center">{link.icon}</span>
            <span>{link.title}</span>
          </Button>
        </Link>
        {/* Submenu rendering is now handled by recursively calling renderNavItem if sublinks are part of the main sections structure */}
      </div>
    );
  };

  // renderSection updated to handle submenus if they are structured within the main links array
  // For now, assuming sidebarLinks defines submenu items directly if needed and renderNavItem handles indentation.
  // The current getGroupedSidebarLinks structure does not produce nested submenus within the 'links' array of a section.
  // If deeper nesting is required, getGroupedSidebarLinks and renderSection/renderNavItem would need more complex recursion.

  // Enhanced renderSection for UIX-14
  const renderSection = (title: string, links: SidebarLink[], sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey] === undefined ? true : expandedSections[sectionKey]; // Default to true if not set
    return (
      // Removed inline debug style: style={{ border: '1px solid #aaa', padding: '5px' }}
      <div key={sectionKey} className="mb-1">
        <Button variant="ghost" size="sm" className="w-full justify-between" onClick={() => toggleSection(sectionKey)}>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </Button>
        {isExpanded && (
          <div className="space-y-1 pt-1 pl-2 border-l border-dashed ml-2"> {/* Added some indentation and border */}
            {links.map(renderNavItem)}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background transition-transform duration-300 ease-in-out md:sticky md:top-0 md:z-0 md:h-screen",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold">
                M
              </div>
              <span className="text-lg font-semibold">MaxiMost</span>
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator />
        
        {/* Navigation */}
        <ScrollArea className="flex-1 pb-4">
          <div className="px-2 py-4">
            {sections.map(section =>
              section.links.length > 0 && renderSection(section.title, section.links, section.key)
            )}
            {/* <div>SIDEBAR NAVIGATION CONTENT COMMENTED OUT</div> */}
          </div>
        </ScrollArea>
        
        {/* Mobile toggle button */}
        <Button
          className="absolute -right-12 top-4 h-9 w-9 rounded-full p-0 md:hidden"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}