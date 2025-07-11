import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Check, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid
} from "lucide-react";
import { SettingsPanel } from '@/components/settings/settings-panel';
import { format } from 'date-fns';

interface HeaderWithSettingsProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  viewMode?: 'daily' | 'weekly';
  currentDay?: Date;
  onPreviousClick?: () => void;
  onTodayClick?: () => void;
  onNextClick?: () => void;
  onDailyViewClick?: () => void;
  onWeeklyViewClick?: () => void;
}

export function HeaderWithSettings({
  title,
  subtitle,
  onMenuClick,
  viewMode = 'weekly',
  currentDay = new Date(),
  onPreviousClick,
  onTodayClick,
  onNextClick,
  onDailyViewClick,
  onWeeklyViewClick,
}: HeaderWithSettingsProps) {
  return (
    // Use a semi-transparent background if this header is meant to be "glassy" itself,
    // or keep bg-background if it's a solid themed bar.
    // For now, assume it's a solid bar consistent with AppLayout's header.
    // Border color updated for glass theme.
    <div className="border-b border-white/10 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onMenuClick && (
              <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2 text-gray-300 hover:text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-100">{title}</h1> {/* Text color */}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>} {/* Text color */}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            {onDailyViewClick && onWeeklyViewClick && (
              // Container for buttons styled for glass
              <div className="bg-white/10 rounded-md p-0.5 flex mr-1 hidden sm:flex">
                <Button 
                  variant={viewMode === "daily" ? "secondary" : "ghost"} // Use secondary for active
                  size="sm" 
                  className={cn(
                    "h-8 text-xs px-3",
                    viewMode === "daily"
                      ? "bg-white/20 text-white" // Active glass style
                      : "text-gray-300 hover:bg-white/20 hover:text-white" // Inactive glass style
                  )}
                  onClick={onDailyViewClick}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Day
                </Button>
                <Button 
                  variant={viewMode === "weekly" ? "secondary" : "ghost"} // Use secondary for active
                  size="sm" 
                  className={cn(
                    "h-8 text-xs px-3",
                    viewMode === "weekly"
                      ? "bg-white/20 text-white" // Active glass style
                      : "text-gray-300 hover:bg-white/20 hover:text-white" // Inactive glass style
                  )}
                  onClick={onWeeklyViewClick}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Week
                </Button>
              </div>
            )}
            
            {/* Date navigation */}
            {(onPreviousClick || onNextClick) && (
              // Container for buttons styled for glass
              <div className="flex items-center bg-white/10 rounded-md mr-1">
                {onPreviousClick && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-white/20" onClick={onPreviousClick}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                )}
                
                {onTodayClick && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs px-2 text-gray-300 hover:text-white hover:bg-white/20" // Style for glass
                    onClick={onTodayClick}
                  >
                    Today
                  </Button>
                )}
                
                {onNextClick && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-white/20" onClick={onNextClick}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                )}
              </div>
            )}
            {/* SettingsPanel removed from here as per UIX-14 */}
            {/* <SettingsPanel /> */}
          </div>
        </div>
        
        {/* Current date display */}
        {currentDay && (
          <div className="text-sm text-gray-300 mt-1"> {/* Updated text color for better contrast */}
            {format(currentDay, 'EEEE, MMMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
}