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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    learn: true,
    pillars: true,
    tools: false,
    community: false,
  });
  
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  // Use the new helper function to get grouped links
  const sections = getGroupedSidebarLinks();
  
  // Simplified renderNavItem for FIX-15 debugging
  const renderNavItem = (link: SidebarLink) => {
    const isActive = location === link.href; // Simplified active check for now
    return (
      <div key={link.href} style={{ paddingLeft: link.submenu ? '10px' : '0px', border: '1px dashed #ccc', margin: '2px' }}>
        <Link href={link.href}>
          <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
            {link.icon} {/* This is already a placeholder like "[LD]" */}
            <span>{link.title}</span>
          </Button>
        </Link>
        {link.submenu && link.submenu.length > 0 && (
          <div style={{ paddingLeft: '15px', borderLeft: '1px solid #eee' }}>
            {link.submenu.map(subLink => (
              <div key={subLink.href} style={{ border: '1px dashed #eee', margin: '1px' }}>
                <Link href={subLink.href}>
                  <Button variant={location === subLink.href ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
                    {subLink.icon}
                    <span>{subLink.title}</span>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Simplified renderSection for FIX-15 debugging
  const renderSection = (title: string, links: SidebarLink[], sectionKey: string) => {
    // const isExpanded = expandedSections[sectionKey]; // Not using expansion for now
    return (
      <div key={sectionKey} className="mb-4" style={{ border: '1px solid #aaa', padding: '5px' }}>
        <Button variant="ghost" size="sm" className="w-full justify-between">
          <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
          {/* Chevron placeholders are fine as they are simple divs */}
          {/* {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />} */}
        </Button>
        <div className="space-y-1 pt-1">
          {links.map(renderNavItem)}
        </div>
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