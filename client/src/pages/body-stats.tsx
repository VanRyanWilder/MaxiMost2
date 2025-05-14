import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, LineChart, Percent, TrendingDown, TrendingUp, Upload, Weight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BodyStat {
  id: number;
  date: Date;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  source: string;
}

interface BloodworkMarker {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high';
  trend?: 'up' | 'down' | 'stable';
  date: Date;
}

export default function BodyStats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  
  // Mock body composition stats
  const bodyStats: BodyStat[] = [
    {
      id: 1,
      date: new Date(2023, 4, 10),
      weight: 185.5,
      bodyFat: 18.2,
      muscleMass: 152,
      source: "Manual Entry"
    },
    {
      id: 2,
      date: new Date(2023, 4, 17),
      weight: 183.2,
      bodyFat: 17.8,
      muscleMass: 151.5,
      source: "Manual Entry"
    },
    {
      id: 3,
      date: new Date(2023, 4, 24),
      weight: 181.3,
      bodyFat: 17.1,
      muscleMass: 152.1,
      source: "Renpho Scale"
    },
    {
      id: 4,
      date: new Date(2023, 5, 1),
      weight: 180.0,
      bodyFat: 16.5,
      muscleMass: 152.8,
      source: "Renpho Scale"
    },
    {
      id: 5,
      date: new Date(2023, 5, 8),
      weight: 179.2,
      bodyFat: 15.9,
      muscleMass: 153.3,
      source: "DEXA Scan"
    }
  ];
  
  // Mock bloodwork markers
  const bloodworkMarkers: BloodworkMarker[] = [
    {
      name: "Testosterone",
      value: 650,
      unit: "ng/dL",
      referenceRange: "300-1000",
      status: "normal",
      trend: "up",
      date: new Date(2023, 5, 1)
    },
    {
      name: "Vitamin D",
      value: 42,
      unit: "ng/mL",
      referenceRange: "30-100",
      status: "normal",
      trend: "up",
      date: new Date(2023, 5, 1)
    },
    {
      name: "Fasting Glucose",
      value: 88,
      unit: "mg/dL",
      referenceRange: "70-99",
      status: "normal",
      trend: "down",
      date: new Date(2023, 5, 1)
    },
    {
      name: "HbA1c",
      value: 5.1,
      unit: "%",
      referenceRange: "4.0-5.6",
      status: "normal",
      trend: "down",
      date: new Date(2023, 5, 1)
    },
    {
      name: "Total Cholesterol",
      value: 210,
      unit: "mg/dL",
      referenceRange: "<200",
      status: "high",
      trend: "down",
      date: new Date(2023, 5, 1)
    },
    {
      name: "HDL Cholesterol",
      value: 62,
      unit: "mg/dL",
      referenceRange: ">40",
      status: "normal",
      trend: "up",
      date: new Date(2023, 5, 1)
    },
    {
      name: "LDL Cholesterol",
      value: 135,
      unit: "mg/dL",
      referenceRange: "<100",
      status: "high",
      trend: "down",
      date: new Date(2023, 5, 1)
    },
    {
      name: "Triglycerides",
      value: 65,
      unit: "mg/dL",
      referenceRange: "<150",
      status: "normal",
      trend: "down",
      date: new Date(2023, 5, 1)
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'low': return 'text-amber-600 bg-amber-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'stable': return <LineChart className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Body Composition & Biomarkers</h1>
            
            <div className="bg-gradient-to-r from-secondary to-accent rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">Tracking Overview</h2>
              <p className="text-white text-opacity-90 max-w-3xl">
                "What gets measured gets managed. Regular tracking of body composition and bloodwork biomarkers provides the quantitative feedback needed to optimize your health and fitness interventions." — Gary Brecka
              </p>
            </div>
            
            <Tabs defaultValue="composition" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="composition">Body Composition</TabsTrigger>
                <TabsTrigger value="bloodwork">Bloodwork Markers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="composition">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <Weight className="mr-2 h-5 w-5 text-primary" />
                        Current Weight
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">{bodyStats[bodyStats.length - 1].weight}</span>
                        <span className="text-xl ml-1">lbs</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm">
                        <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600 font-medium">-1.3%</span>
                        <span className="text-gray-500 ml-2">Last 30 days</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <Percent className="mr-2 h-5 w-5 text-warning" />
                        Body Fat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">{bodyStats[bodyStats.length - 1].bodyFat}</span>
                        <span className="text-xl ml-1">%</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm">
                        <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600 font-medium">-2.3%</span>
                        <span className="text-gray-500 ml-2">Last 30 days</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <Weight className="mr-2 h-5 w-5 text-secondary" />
                        Muscle Mass
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">{bodyStats[bodyStats.length - 1].muscleMass}</span>
                        <span className="text-xl ml-1">lbs</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600 font-medium">+0.8%</span>
                        <span className="text-gray-500 ml-2">Last 30 days</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stat History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Date</th>
                              <th className="text-center py-2">Weight (lbs)</th>
                              <th className="text-center py-2">Body Fat (%)</th>
                              <th className="text-center py-2">Muscle Mass (lbs)</th>
                              <th className="text-right py-2">Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bodyStats.slice().reverse().map((stat) => (
                              <tr key={stat.id} className="border-b last:border-0">
                                <td className="py-2">{format(stat.date, 'MMM d, yyyy')}</td>
                                <td className="text-center py-2">{stat.weight}</td>
                                <td className="text-center py-2">{stat.bodyFat}%</td>
                                <td className="text-center py-2">{stat.muscleMass}</td>
                                <td className="text-right py-2 text-gray-500">{stat.source}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => date && setDate(date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input id="weight" type="number" step="0.1" placeholder="Enter weight" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bodyFat">Body Fat (%)</Label>
                            <Input id="bodyFat" type="number" step="0.1" placeholder="Enter body fat %" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="muscleMass">Muscle Mass (lbs)</Label>
                            <Input id="muscleMass" type="number" step="0.1" placeholder="Enter muscle mass" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="source">Data Source</Label>
                          <select 
                            id="source"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option>Manual Entry</option>
                            <option>Renpho Scale</option>
                            <option>Withings Scale</option>
                            <option>DEXA Scan</option>
                            <option>Other Scale</option>
                          </select>
                        </div>
                        
                        <Button className="w-full" type="submit">Save Entry</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Import Data from External Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Fitness Apps & Smart Devices</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/z8w5JCi.png" alt="Renpho" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Renpho</h3>
                            <p className="text-xs text-gray-500 mb-4">Sync body composition data from your Renpho smart scale</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/KdZKYo1.png" alt="Apple Health" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Apple Health</h3>
                            <p className="text-xs text-gray-500 mb-4">Import data from Apple Health including weight and body measurements</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/8ANNlde.png" alt="Fitbit" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Fitbit</h3>
                            <p className="text-xs text-gray-500 mb-4">Sync weight and body fat percentage from your Fitbit account</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Wearable & Health Devices</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/rBFRxfN.png" alt="Oura Ring" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Oura Ring</h3>
                            <p className="text-xs text-gray-500 mb-4">Import sleep quality, heart rate variability, and recovery metrics</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/bk5j5xZ.png" alt="Whoop" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Whoop</h3>
                            <p className="text-xs text-gray-500 mb-4">Track strain, recovery, and sleep performance from your Whoop band</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/R2WxFdP.png" alt="Garmin" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Garmin</h3>
                            <p className="text-xs text-gray-500 mb-4">Sync exercise, heart rate, and body metrics from Garmin Connect</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Nutrition & Activity Trackers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/GwqYy6k.png" alt="MyFitnessPal" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">MyFitnessPal</h3>
                            <p className="text-xs text-gray-500 mb-4">Import nutrition data, calories, and macronutrient tracking</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/8vfPk4e.png" alt="Strava" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Strava</h3>
                            <p className="text-xs text-gray-500 mb-4">Sync running, cycling, and workout data from your Strava account</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <img src="https://i.imgur.com/7lxukT4.png" alt="Cronometer" className="h-12 mb-4" />
                            <h3 className="font-semibold mb-2">Cronometer</h3>
                            <p className="text-xs text-gray-500 mb-4">Track detailed nutrition including micronutrients and biometrics</p>
                            <Button variant="outline" className="w-full">Connect</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bloodwork">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Bloodwork Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-4">
                          <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Upload Lab Reports</h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload your PDF lab reports to track your biomarkers over time
                        </p>
                        <div className="flex justify-center">
                          <Button className="mr-4">Upload PDF</Button>
                          <Button variant="outline">Manual Entry</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Biomarkers</CardTitle>
                      <p className="text-sm text-gray-500">Last updated: {format(bloodworkMarkers[0].date, 'MMMM d, yyyy')}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Marker</th>
                              <th className="text-center py-2">Value</th>
                              <th className="text-center py-2">Reference Range</th>
                              <th className="text-center py-2">Status</th>
                              <th className="text-right py-2">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bloodworkMarkers.map((marker, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 font-medium">{marker.name}</td>
                                <td className="text-center py-3">{marker.value} {marker.unit}</td>
                                <td className="text-center py-3 text-gray-500">{marker.referenceRange}</td>
                                <td className="text-center py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(marker.status)}`}>
                                    {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)}
                                  </span>
                                </td>
                                <td className="text-right py-3">
                                  {getTrendIcon(marker.trend)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Bloodwork Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Summary</h3>
                          <p className="text-gray-600">
                            Your overall bloodwork shows good health with a few areas for improvement. Your 
                            metabolic markers are excellent with fasting glucose and HbA1c well within optimal ranges. 
                            Testosterone levels are good and trending up, likely due to your exercise regimen and 
                            supplement protocol.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Areas to Address</h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>
                              <span className="font-medium">Total & LDL Cholesterol:</span> Slightly elevated. Consider increasing omega-3 intake and fiber consumption.
                            </li>
                            <li>
                              <span className="font-medium">Vitamin D:</span> While in normal range, optimal levels are 50-80 ng/mL. Continue supplementation and sun exposure.
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Recommended Actions</h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Continue current supplement protocol with emphasis on omega-3s</li>
                            <li>Maintain time-restricted feeding to keep metabolic markers optimized</li>
                            <li>Consider adding red yeast rice supplement for cholesterol management</li>
                            <li>Retest in 3 months to track improvements</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}