import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Moon,
  Sun,
  PaintBucket,
  Bell,
  Calendar,
  User,
  Database,
  Save,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define the types for our settings
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'daily' | 'weekly' | 'monthly';
  defaultCategory: string;
  notifications: boolean;
  streakReminders: boolean;
  showCompleted: boolean;
  habitColors: {
    completed: string;
    pending: string;
  };
  habitDisplayMode: 'compact' | 'detailed';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
}

// Initial default settings
const defaultSettings: AppSettings = {
  theme: 'system',
  defaultView: 'weekly',
  defaultCategory: 'all',
  notifications: true,
  streakReminders: true,
  showCompleted: true,
  habitColors: {
    completed: 'blue',
    pending: 'gray',
  },
  habitDisplayMode: 'detailed',
  weekStartsOn: 0,
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsContext = React.createContext<{
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

// Settings provider that will be used at a higher level
export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse settings from localStorage', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook for using settings
export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your habit tracking experience
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 h-[calc(100vh-180px)] overflow-y-auto pr-2">
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="appearance">
                <PaintBucket className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <User className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Theme</h3>
                  <RadioGroup 
                    defaultValue={settings.theme} 
                    onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center">
                        <Sun className="h-4 w-4 mr-1" /> Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center">
                        <Moon className="h-4 w-4 mr-1" /> Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">System</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Habit Button Colors</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="completed-color">Completed</Label>
                      <Select 
                        value={settings.habitColors.completed}
                        onValueChange={(value) => updateSettings({ 
                          habitColors: { ...settings.habitColors, completed: value } 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Completed Color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="indigo">Indigo</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className={`h-4 w-full rounded-full bg-${settings.habitColors.completed}-500`}></div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pending-color">Pending</Label>
                      <Select 
                        value={settings.habitColors.pending}
                        onValueChange={(value) => updateSettings({ 
                          habitColors: { ...settings.habitColors, pending: value } 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pending Color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gray">Gray</SelectItem>
                          <SelectItem value="slate">Slate</SelectItem>
                          <SelectItem value="zinc">Zinc</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className={`h-4 w-full rounded-full bg-${settings.habitColors.pending}-300`}></div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Habit Display Mode</h3>
                  <Select 
                    value={settings.habitDisplayMode}
                    onValueChange={(value) => updateSettings({ 
                      habitDisplayMode: value as 'compact' | 'detailed' 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Display Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <span className="text-xs text-gray-500">Preview:</span>
                    {settings.habitDisplayMode === 'compact' ? (
                      <div className="flex items-center mt-2 p-2 border rounded-md">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium">Habit Name</span>
                      </div>
                    ) : (
                      <div className="flex flex-col mt-2 p-2 border rounded-md">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm font-medium">Habit Name</span>
                          <Badge className="ml-auto text-[10px]">Daily</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Habit description goes here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Default View</h3>
                <Select 
                  value={settings.defaultView}
                  onValueChange={(value) => updateSettings({ 
                    defaultView: value as 'daily' | 'weekly' | 'monthly' 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Default Category</h3>
                <Select 
                  value={settings.defaultCategory}
                  onValueChange={(value) => updateSettings({ defaultCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mind">Mind</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="absolute">Daily Habits</SelectItem>
                    <SelectItem value="frequency">Frequency Habits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Week Starts On</h3>
                <RadioGroup 
                  defaultValue={settings.weekStartsOn.toString()} 
                  onValueChange={(value) => updateSettings({ weekStartsOn: parseInt(value) as 0 | 1 })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="sunday" />
                    <Label htmlFor="sunday">Sunday</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="monday" />
                    <Label htmlFor="monday">Monday</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-completed">Show Completed Habits</Label>
                  <div className="text-sm text-muted-foreground">
                    Keep completed habits visible
                  </div>
                </div>
                <Switch 
                  id="show-completed" 
                  checked={settings.showCompleted}
                  onCheckedChange={(checked) => updateSettings({ showCompleted: checked })}
                />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive reminders for your habits
                  </div>
                </div>
                <Switch 
                  id="notifications" 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="streak-reminders">Streak Reminders</Label>
                  <div className="text-sm text-muted-foreground">
                    Get notified when a streak is at risk
                  </div>
                </div>
                <Switch 
                  id="streak-reminders" 
                  checked={settings.streakReminders}
                  onCheckedChange={(checked) => updateSettings({ streakReminders: checked })}
                  disabled={!settings.notifications}
                />
              </div>

              <Card className="mt-4">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Note: Notifications require browser permissions and may not work on all devices.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="mt-6 flex-row space-x-2">
          <Button
            variant="outline"
            onClick={resetSettings}
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={() => {
              // Save is automatic but we'll add a confirmation here
              alert('Settings saved!');
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}