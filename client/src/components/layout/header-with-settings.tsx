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
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onMenuClick && (
              <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            {onDailyViewClick && onWeeklyViewClick && (
              <div className="bg-muted rounded-md p-0.5 flex mr-1 hidden sm:flex">
                <Button 
                  variant={viewMode === "daily" ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8"
                  onClick={onDailyViewClick}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Day
                </Button>
                <Button 
                  variant={viewMode === "weekly" ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8"
                  onClick={onWeeklyViewClick}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Week
                </Button>
              </div>
            )}
            
            {/* Date navigation */}
            {(onPreviousClick || onNextClick) && (
              <div className="flex items-center bg-muted rounded-md mr-1">
                {onPreviousClick && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPreviousClick}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                )}
                
                {onTodayClick && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs px-2"
                    onClick={onTodayClick}
                  >
                    Today
                  </Button>
                )}
                
                {onNextClick && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextClick}>
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
          <div className="text-sm text-muted-foreground mt-1">
            {format(currentDay, 'EEEE, MMMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
}