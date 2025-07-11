import { useState } from 'react';
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
import { useTheme } from "@/components/theme-provider";
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
import { PageContainer } from "@/components/layout/page-container";
import { HeaderWithSettings } from "@/components/layout/header-with-settings";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Replaced by GlassCard
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription
} from "@/components/glass/GlassCard";
import { Separator } from "@/components/ui/separator"; // Separator already themed to bg-white/20
import { Switch } from "@/components/ui/switch"; // Switch will need glass theme styling
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Moon, Sun, Volume2, User, Shield, Clock, Eye, Target, BellRing } from 'lucide-react';

export default function Settings() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Removed
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  
  // Privacy settings state
  const [publicProfile, setPublicProfile] = useState(false);
  const [shareActivity, setShareActivity] = useState(false);
  const [shareProgress, setShareProgress] = useState(false);
  
  // Display settings state
  const [weekStartsOn, setWeekStartsOn] = useState("monday");
  const [showStreaks, setShowStreaks] = useState(true);
  const [showMotivation, setShowMotivation] = useState(true);
  const [showSupplement, setShowSupplement] = useState(true);

  return (
    // Sidebar, MobileHeader, and outer fragment removed. PageContainer is the root.
      <PageContainer>
        {/* HeaderWithSettings already provides an H1 title "Settings" */}
        <HeaderWithSettings title="Settings" description="Customize your MaxiMost experience" />
        
        <div className="space-y-6">
          <Tabs defaultValue="account" className="w-full">
            {/* Styled TabsList and TabsTrigger for glass theme */}
            <TabsList className="grid grid-cols-4 md:w-1/2 bg-white/5 border border-white/10 rounded-md p-1">
              <TabsTrigger
                value="account"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/10 hover:text-gray-200"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/10 hover:text-gray-200"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/10 hover:text-gray-200"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/10 hover:text-gray-200"
              >
                Privacy
              </TabsTrigger>
            </TabsList>
            
            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6 mt-4"> {/* Increased space-y for GlassCards */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Account Information</GlassCardTitle>
                  <GlassCardDescription>Manage your account details</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Name</Label>
                        <Input id="name" defaultValue={user?.name || "MaxiMost User"} className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email || "user@example.com"} className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">Username</Label>
                        <Input id="username" defaultValue={user?.username || "maximost_user"} className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subscription" className="text-gray-300">Subscription Plan</Label>
                        <Input id="subscription" value={user?.subscriptionTier || "Premium"} readOnly className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Password & Security</GlassCardTitle>
                  <GlassCardDescription>Update your password and security settings</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
                        <Input id="current-password" type="password" className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                        <Input id="new-password" type="password" className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Update Password</Button>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
            
            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6 mt-4"> {/* Increased space-y */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Theme Preferences</GlassCardTitle>
                  <GlassCardDescription>Change how MaxiMost looks</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Theme selection cards - styled for glass */}
                    <GlassCard
                      className={`cursor-pointer hover:bg-white/5 transition-colors ${theme === 'light' ? 'ring-2 ring-blue-400' : 'border-white/10'}`}
                      onClick={() => setTheme('light')}
                    >
                      <GlassCardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                        <Sun className="h-8 w-8 mb-3 text-amber-400" />
                        <h3 className="text-sm font-medium text-gray-200">Light Mode</h3>
                      </GlassCardContent>
                    </GlassCard>
                    
                    <GlassCard
                      className={`cursor-pointer hover:bg-white/5 transition-colors ${theme === 'dark' ? 'ring-2 ring-blue-400' : 'border-white/10'}`}
                      onClick={() => setTheme('dark')}
                    >
                      <GlassCardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                        <Moon className="h-8 w-8 mb-3 text-indigo-400" />
                        <h3 className="text-sm font-medium text-gray-200">Dark Mode</h3>
                      </GlassCardContent>
                    </GlassCard>
                    
                    <GlassCard
                      className={`cursor-pointer hover:bg-white/5 transition-colors ${theme === 'system' ? 'ring-2 ring-blue-400' : 'border-white/10'}`}
                      onClick={() => setTheme('system')}
                    >
                      <GlassCardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                        <div className="flex space-x-1 mb-3">
                          <Sun className="h-6 w-6 text-amber-400" />
                          <Moon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-200">System Default</h3>
                      </GlassCardContent>
                    </GlassCard>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Dashboard Preferences</GlassCardTitle>
                  <GlassCardDescription>Customize your dashboard view</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="space-y-3"> {/* Adjusted spacing */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <Label htmlFor="show-streaks" className="mb-0 text-gray-300">Show Habit Streaks</Label>
                      </div>
                      {/* Switch styling for glass theme */}
                      <Switch
                        id="show-streaks"
                        checked={showStreaks} 
                        onCheckedChange={setShowStreaks}
                        className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BellRing className="h-4 w-4 text-gray-400" />
                        <Label htmlFor="show-motivation" className="mb-0 text-gray-300">Show Daily Motivation</Label>
                      </div>
                      <Switch
                        id="show-motivation"
                        checked={showMotivation} 
                        onCheckedChange={setShowMotivation}
                        className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <Label htmlFor="show-supplement" className="mb-0 text-gray-300">Show Supplement Recommendations</Label>
                      </div>
                      <Switch
                        id="show-supplement"
                        checked={showSupplement} 
                        onCheckedChange={setShowSupplement}
                        className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30"
                      />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
            
            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6 mt-4"> {/* Increased space-y */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Notification Preferences</GlassCardTitle>
                  <GlassCardDescription>Choose how you'd like to be notified</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-gray-400" />
                          <Label htmlFor="email-notifs" className="mb-0 text-gray-300">Email Notifications</Label>
                        </div>
                        <Switch id="email-notifs" 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                          className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30" />
                      </div>
                      <p className="text-sm text-gray-400 pl-6">Receive daily summaries and important updates via email</p>
                    </div>
                    
                    <Separator/> {/* Already themed to bg-white/20 */}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-gray-400" />
                          <Label htmlFor="app-notifs" className="mb-0 text-gray-300">App Notifications</Label>
                        </div>
                        <Switch id="app-notifs" 
                          checked={appNotifications} 
                          onCheckedChange={setAppNotifications}
                          className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30" />
                      </div>
                      <p className="text-sm text-gray-400 pl-6">Receive reminders and updates within the app</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-gray-400" />
                          <Label htmlFor="sounds" className="mb-0 text-gray-300">Notification Sounds</Label>
                        </div>
                        <Switch id="sounds" 
                          checked={sounds} 
                          onCheckedChange={setSounds}
                          className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30" />
                      </div>
                      <p className="text-sm text-gray-400 pl-6">Play sounds for notifications and achievements</p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Reminder Schedule</GlassCardTitle>
                  <GlassCardDescription>Set when you want to receive habit reminders</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="morning-reminder" className="text-gray-300">Morning Reminder</Label>
                        <Input id="morning-reminder" type="time" defaultValue="07:00" className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evening-reminder" className="text-gray-300">Evening Reminder</Label>
                        <Input id="evening-reminder" type="time" defaultValue="19:00" className="bg-white/5 border-white/20 text-white placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-days" className="text-gray-300">Reminder Days</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="reminder-days" className="bg-white/5 border-white/20 text-white data-[placeholder]:text-gray-400">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-sm border-white/20 text-gray-200">
                          <SelectItem value="all" className="focus:bg-white/10 focus:text-white">Every day</SelectItem>
                          <SelectItem value="weekdays" className="focus:bg-white/10 focus:text-white">Weekdays only</SelectItem>
                          <SelectItem value="weekends" className="focus:bg-white/10 focus:text-white">Weekends only</SelectItem>
                          <SelectItem value="custom" className="focus:bg-white/10 focus:text-white">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
            
            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6 mt-4"> {/* Increased space-y */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Privacy Settings</GlassCardTitle>
                  <GlassCardDescription>Control your data and privacy preferences</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <Label htmlFor="public-profile" className="mb-0 text-gray-300">Public Profile</Label>
                        </div>
                        <Switch id="public-profile" 
                          checked={publicProfile} 
                          onCheckedChange={setPublicProfile}
                          className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30" />
                      </div>
                      <p className="text-sm text-gray-400 pl-6">Allow others to view your profile and achievement history</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <Label htmlFor="share-activity" className="mb-0 text-gray-300">Share Habit Activity</Label>
                        </div>
                        <Switch id="share-activity" 
                          checked={shareActivity} 
                          onCheckedChange={setShareActivity}
                          className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30" />
                      </div>
                      <p className="text-sm text-gray-400 pl-6">Share your habit completion data with the community</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <Label htmlFor="share-progress" className="mb-0 text-gray-300">Share Progress History</Label>
                        </div>
                        <Switch id="share-progress" 
                          checked={shareProgress} 
                          onCheckedChange={setShareProgress}
                          className="data-[state=checked]:bg-blue-500/70 data-[state=unchecked]:bg-gray-500/30" />
                      </div>
                      <p className="text-sm text-gray-400 pl-6">Share your long-term progress and statistics</p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
              
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Data Management</GlassCardTitle>
                  <GlassCardDescription>Manage your account data and preferences</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="text-gray-200 border-white/30 hover:bg-white/10 hover:text-white">Download My Data</Button>
                    <Button variant="destructive" className="bg-red-700/80 hover:bg-red-600/100 text-white border-red-500/50 hover:border-red-400">Delete Account</Button>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    // </> // Removed extraneous closing fragment
  );
}