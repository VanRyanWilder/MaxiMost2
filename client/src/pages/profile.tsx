// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
// import { useState } from "react"; // Removed
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed
  const { user, userLoading } = useUser();

  return (
    // Outer divs and Sidebar/MobileHeader removed, AppLayout handles them.
    // Main content starts here.
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            
            {userLoading ? (
              <div className="grid gap-6 animate-pulse">
                <Card>
                  <CardHeader>
                    <div className="h-7 bg-gray-200 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium">{user?.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Program Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Program</p>
                        <p className="font-medium">12-Week MaxiMost</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">April 15, 2023</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "32%" }}></div>
                          </div>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
  );
}
