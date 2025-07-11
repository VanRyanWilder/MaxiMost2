import { useState } from 'react';
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
import { useTheme } from "@/components/theme-provider";
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
import { PageContainer } from "@/components/layout/page-container";
import { HeaderWithSettings } from "@/components/layout/header-with-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
            <TabsList className="grid grid-cols-4 md:w-1/2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            {/* Account Settings */}
            <TabsContent value="account" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user?.name || "MaxiMost User"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email || "user@example.com"} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={user?.username || "maximost_user"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subscription">Subscription Plan</Label>
                        <Input id="subscription" value={user?.subscriptionTier || "Premium"} readOnly />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>Update your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>Change how MaxiMost looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className={`cursor-pointer hover:bg-muted transition-colors ${theme === 'light' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => setTheme('light')}>
                      <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                        <Sun className="h-8 w-8 mb-3 text-amber-500" />
                        <h3 className="text-sm font-medium">Light Mode</h3>
                      </CardContent>
                    </Card>
                    
                    <Card className={`cursor-pointer hover:bg-muted transition-colors ${theme === 'dark' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => setTheme('dark')}>
                      <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                        <Moon className="h-8 w-8 mb-3 text-indigo-500" />
                        <h3 className="text-sm font-medium">Dark Mode</h3>
                      </CardContent>
                    </Card>
                    
                    <Card className={`cursor-pointer hover:bg-muted transition-colors ${theme === 'system' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => setTheme('system')}>
                      <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                        <div className="flex space-x-1 mb-3">
                          <Sun className="h-6 w-6 text-amber-500" />
                          <Moon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <h3 className="text-sm font-medium">System Default</h3>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Preferences</CardTitle>
                  <CardDescription>Customize your dashboard view</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="show-streaks" className="mb-0">Show Habit Streaks</Label>
                      </div>
                      <Switch id="show-streaks" 
                        checked={showStreaks} 
                        onCheckedChange={setShowStreaks} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BellRing className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="show-motivation" className="mb-0">Show Daily Motivation</Label>
                      </div>
                      <Switch id="show-motivation" 
                        checked={showMotivation} 
                        onCheckedChange={setShowMotivation} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="show-supplement" className="mb-0">Show Supplement Recommendations</Label>
                      </div>
                      <Switch id="show-supplement" 
                        checked={showSupplement} 
                        onCheckedChange={setShowSupplement} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you'd like to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="email-notifs" className="mb-0">Email Notifications</Label>
                        </div>
                        <Switch id="email-notifs" 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} />
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">Receive daily summaries and important updates via email</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="app-notifs" className="mb-0">App Notifications</Label>
                        </div>
                        <Switch id="app-notifs" 
                          checked={appNotifications} 
                          onCheckedChange={setAppNotifications} />
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">Receive reminders and updates within the app</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="sounds" className="mb-0">Notification Sounds</Label>
                        </div>
                        <Switch id="sounds" 
                          checked={sounds} 
                          onCheckedChange={setSounds} />
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">Play sounds for notifications and achievements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reminder Schedule</CardTitle>
                  <CardDescription>Set when you want to receive habit reminders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="morning-reminder">Morning Reminder</Label>
                        <Input id="morning-reminder" type="time" defaultValue="07:00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evening-reminder">Evening Reminder</Label>
                        <Input id="evening-reminder" type="time" defaultValue="19:00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-days">Reminder Days</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="reminder-days">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Every day</SelectItem>
                          <SelectItem value="weekdays">Weekdays only</SelectItem>
                          <SelectItem value="weekends">Weekends only</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="public-profile" className="mb-0">Public Profile</Label>
                        </div>
                        <Switch id="public-profile" 
                          checked={publicProfile} 
                          onCheckedChange={setPublicProfile} />
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">Allow others to view your profile and achievement history</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="share-activity" className="mb-0">Share Habit Activity</Label>
                        </div>
                        <Switch id="share-activity" 
                          checked={shareActivity} 
                          onCheckedChange={setShareActivity} />
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">Share your habit completion data with the community</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="share-progress" className="mb-0">Share Progress History</Label>
                        </div>
                        <Switch id="share-progress" 
                          checked={shareProgress} 
                          onCheckedChange={setShareProgress} />
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">Share your long-term progress and statistics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Manage your account data and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    // </> // Removed extraneous closing fragment
  );
}