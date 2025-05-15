import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { sidebarLinks, type SidebarLink } from "@/lib/sidebar-links";
import { X, Menu, ChevronDown, ChevronRight } from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function ModernSidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    pillars: true
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const mainLinks = sidebarLinks.filter(link => link.section === 'main');
  const pillarLinks = sidebarLinks.filter(link => link.section === 'pillars');
  const healthLinks = sidebarLinks.filter(link => link.section === 'health');
  const resourceLinks = sidebarLinks.filter(link => link.section === 'resources');
  
  const renderNavItem = (link: SidebarLink) => {
    const isActive = location === link.href || 
      (link.submenu && link.submenu.some(sub => location === sub.href));
    
    // If this is a link with a submenu
    if (link.submenu && link.submenu.length > 0) {
      return (
        <Collapsible key={link.href} open={isActive} onOpenChange={() => {}}
          className={cn(
            "w-full rounded-lg overflow-hidden",
            isActive && "bg-muted/50"
          )}
        >
          <CollapsibleTrigger asChild className="w-full">
            <Link href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 rounded-none px-3 py-2 transition-all",
                  isActive ? "font-medium" : "font-normal"
                )}
              >
                {link.icon}
                <span>{link.title}</span>
                {isActive ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Button>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pr-2 py-1">
            {link.submenu.map((subLink) => (
              <Link key={subLink.href} href={subLink.href}>
                <Button
                  variant={location === subLink.href ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 px-2 py-1 text-sm",
                    location === subLink.href ? "font-medium" : "font-normal"
                  )}
                >
                  {subLink.icon}
                  <span>{subLink.title}</span>
                </Button>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }
    
    // Regular link without submenu
    return (
      <Link key={link.href} href={link.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "w-full justify-start gap-2 px-3",
            isActive ? "font-medium" : "font-normal"
          )}
        >
          {link.icon}
          <span>{link.title}</span>
        </Button>
      </Link>
    );
  };
  
  const renderSection = (title: string, links: SidebarLink[], sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div key={sectionKey} className="mb-4">
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-between px-3 text-muted-foreground hover:text-foreground"
            >
              <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pt-1">
            {links.map(renderNavItem)}
          </CollapsibleContent>
        </Collapsible>
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
            {renderSection("Main", mainLinks, "main")}
            {renderSection("Four Pillars", pillarLinks, "pillars")}
            {renderSection("Health & Wellness", healthLinks, "health")}
            {renderSection("Resources", resourceLinks, "resources")}
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