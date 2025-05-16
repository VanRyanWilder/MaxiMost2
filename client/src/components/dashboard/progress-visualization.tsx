import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Calendar, 
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { analyzeProgress } from "@/lib/gemini";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressVisualizationProps {
  className?: string;
}

// Color palette for charts
const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  chart: [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#a855f7"
  ]
};

// Sample habit completion data by date
const mockPhysicalHabitData = [
  { date: "2023-01-01", value: 65 },
  { date: "2023-01-08", value: 70 },
  { date: "2023-01-15", value: 75 },
  { date: "2023-01-22", value: 80 },
  { date: "2023-01-29", value: 85 },
  { date: "2023-02-05", value: 82 },
  { date: "2023-02-12", value: 88 },
  { date: "2023-02-19", value: 90 },
  { date: "2023-02-26", value: 85 },
  { date: "2023-03-05", value: 92 },
];

const mockNutritionHabitData = [
  { date: "2023-01-01", value: 55 },
  { date: "2023-01-08", value: 60 },
  { date: "2023-01-15", value: 65 },
  { date: "2023-01-22", value: 70 },
  { date: "2023-01-29", value: 75 },
  { date: "2023-02-05", value: 72 },
  { date: "2023-02-12", value: 78 },
  { date: "2023-02-19", value: 80 },
  { date: "2023-02-26", value: 82 },
  { date: "2023-03-05", value: 85 },
];

const mockSleepHabitData = [
  { date: "2023-01-01", value: 70 },
  { date: "2023-01-08", value: 72 },
  { date: "2023-01-15", value: 75 },
  { date: "2023-01-22", value: 80 },
  { date: "2023-01-29", value: 82 },
  { date: "2023-02-05", value: 85 },
  { date: "2023-02-12", value: 88 },
  { date: "2023-02-19", value: 90 },
  { date: "2023-02-26", value: 85 },
  { date: "2023-03-05", value: 92 },
];

const mockMentalHabitData = [
  { date: "2023-01-01", value: 60 },
  { date: "2023-01-08", value: 65 },
  { date: "2023-01-15", value: 70 },
  { date: "2023-01-22", value: 72 },
  { date: "2023-01-29", value: 75 },
  { date: "2023-02-05", value: 78 },
  { date: "2023-02-12", value: 80 },
  { date: "2023-02-19", value: 82 },
  { date: "2023-02-26", value: 85 },
  { date: "2023-03-05", value: 88 },
];

const mockRelationshipHabitData = [
  { date: "2023-01-01", value: 50 },
  { date: "2023-01-08", value: 55 },
  { date: "2023-01-15", value: 60 },
  { date: "2023-01-22", value: 65 },
  { date: "2023-01-29", value: 70 },
  { date: "2023-02-05", value: 75 },
  { date: "2023-02-12", value: 80 },
  { date: "2023-02-19", value: 78 },
  { date: "2023-02-26", value: 82 },
  { date: "2023-03-05", value: 85 },
];

const mockFinancialHabitData = [
  { date: "2023-01-01", value: 45 },
  { date: "2023-01-08", value: 50 },
  { date: "2023-01-15", value: 55 },
  { date: "2023-01-22", value: 60 },
  { date: "2023-01-29", value: 65 },
  { date: "2023-02-05", value: 70 },
  { date: "2023-02-12", value: 75 },
  { date: "2023-02-19", value: 80 },
  { date: "2023-02-26", value: 82 },
  { date: "2023-03-05", value: 85 },
];

const mockHabitCompletionData = [
  { name: "Physical", value: 85 },
  { name: "Nutrition", value: 75 },
  { name: "Sleep", value: 82 },
  { name: "Mental", value: 78 },
  { name: "Relationships", value: 70 },
  { name: "Financial", value: 65 },
];

export function ProgressVisualization({ className }: ProgressVisualizationProps) {
  const [timeRange, setTimeRange] = useState<string>("10w");
  const [chartType, setChartType] = useState<string>("line");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["physical", "mental"]);
  const [insights, setInsights] = useState<{
    summary: string;
    observations: string[];
    recommendations: string[];
  } | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const { user } = useUser();

  const timeRangeOptions = [
    { value: "4w", label: "4 Weeks" },
    { value: "10w", label: "10 Weeks" },
    { value: "6m", label: "6 Months" },
    { value: "1y", label: "1 Year" },
  ];

  const metricOptions = [
    { id: "physical", name: "Physical", unit: "%", data: mockPhysicalHabitData, color: "#ef4444" }, // Red
    { id: "nutrition", name: "Nutrition", unit: "%", data: mockNutritionHabitData, color: "#f97316" }, // Orange
    { id: "sleep", name: "Sleep", unit: "%", data: mockSleepHabitData, color: "#8b5cf6" }, // Indigo
    { id: "mental", name: "Mental", unit: "%", data: mockMentalHabitData, color: "#facc15" }, // Yellow
    { id: "relationships", name: "Relationships", unit: "%", data: mockRelationshipHabitData, color: "#22c55e" }, // Green
    { id: "financial", name: "Financial", unit: "%", data: mockFinancialHabitData, color: "#10b981" }, // Emerald
  ];

  // Filter metrics based on selection
  const filteredMetrics = metricOptions.filter(metric => 
    selectedMetrics.includes(metric.id)
  );

  // Calculate trend for each metric
  const calculateTrend = (data: { date: string; value: number }[]) => {
    if (data.length < 2) return { trend: "stable", percentage: 0 };
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const change = lastValue - firstValue;
    const percentChange = (change / firstValue) * 100;
    
    return { 
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
      percentage: Math.abs(percentChange).toFixed(1)
    };
  };

  const getAIInsights = async () => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) return;
    
    setInsightsLoading(true);
    
    try {
      const progressData = filteredMetrics.map(metric => ({
        metric: metric.name,
        data: metric.data
      }));
      
      const result = await analyzeProgress(progressData);
      
      if (result) {
        setInsights(result);
      }
    } catch (error) {
      console.error("Error getting AI insights:", error);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Fallback content for when the AI is not available
  const fallbackInsights = {
    summary: "Your habit consistency is showing positive trends across key categories. Continue focusing on daily habits for best results.",
    observations: [
      "Your Physical and Mental habit categories show the strongest adherence.",
      "Sleep habits are consistently performed at a high rate.",
      "Financial habits show the most room for improvement."
    ],
    recommendations: [
      "Try stacking your financial habits with existing physical habits for better consistency.",
      "Maintain your current sleep routine - it's a foundation for other categories.",
      "Focus on one new habit at a time to avoid overwhelm and ensure consistent progress."
    ]
  };

  useEffect(() => {
    if (user && filteredMetrics.length > 0) {
      console.log("Attempting to get AI insights...");
      getAIInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="text-xs text-gray-500">{label ? formatDate(label) : ""}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}% completion
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progress Visualization
              </CardTitle>
              <CardDescription>
                Track your progress across different metrics
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {metricOptions.map(metric => (
              <Badge
                key={metric.id}
                variant={selectedMetrics.includes(metric.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={selectedMetrics.includes(metric.id) ? { backgroundColor: metric.color } : {}}
                onClick={() => {
                  if (selectedMetrics.includes(metric.id)) {
                    setSelectedMetrics(selectedMetrics.filter(id => id !== metric.id));
                  } else {
                    setSelectedMetrics([...selectedMetrics, metric.id]);
                  }
                }}
              >
                {metric.name}
              </Badge>
            ))}
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate} 
                    minTickGap={30}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke={filteredMetrics[0]?.color || COLORS.chart[0]} domain={[0, 100]} />
                  {filteredMetrics.length > 1 && (
                    <YAxis yAxisId="right" orientation="right" stroke={filteredMetrics[1]?.color || COLORS.chart[1]} domain={[0, 100]} />
                  )}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {filteredMetrics.map((metric, index) => (
                    <Line
                      key={metric.id}
                      type="monotone"
                      dataKey="value"
                      data={metric.data}
                      name={metric.name}
                      stroke={metric.color}
                      yAxisId={index === 0 ? "left" : "right"}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              ) : chartType === "area" ? (
                <AreaChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    minTickGap={30}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke={filteredMetrics[0]?.color || COLORS.chart[0]} domain={[0, 100]} />
                  {filteredMetrics.length > 1 && (
                    <YAxis yAxisId="right" orientation="right" stroke={filteredMetrics[1]?.color || COLORS.chart[1]} domain={[0, 100]} />
                  )}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {filteredMetrics.map((metric, index) => (
                    <Area
                      key={metric.id}
                      type="monotone"
                      dataKey="value"
                      data={metric.data}
                      name={metric.name}
                      stroke={metric.color}
                      fill={metric.color}
                      fillOpacity={0.2}
                      yAxisId={index === 0 ? "left" : "right"}
                    />
                  ))}
                </AreaChart>
              ) : (
                <BarChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    minTickGap={30}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke={filteredMetrics[0]?.color || COLORS.chart[0]} domain={[0, 100]} />
                  {filteredMetrics.length > 1 && (
                    <YAxis yAxisId="right" orientation="right" stroke={filteredMetrics[1]?.color || COLORS.chart[1]} domain={[0, 100]} />
                  )}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {filteredMetrics.map((metric, index) => (
                    <Bar
                      key={metric.id}
                      dataKey="value"
                      data={metric.data}
                      name={metric.name}
                      fill={metric.color}
                      yAxisId={index === 0 ? "left" : "right"}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        {filteredMetrics.map(metric => {
          const trend = calculateTrend(metric.data);
          const latestValue = metric.data[metric.data.length - 1].value;
          
          return (
            <Card key={metric.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{metric.name}</CardTitle>
                <CardDescription>Current and trend analysis</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{latestValue} <span className="text-sm font-normal text-gray-500">{metric.unit}</span></p>
                    <div className="flex items-center gap-1 mt-1">
                      {trend.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : trend.trend === "down" ? (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-500" />
                      )}
                      <span className={`text-sm ${
                        trend.trend === "up" ? "text-green-500" : 
                        trend.trend === "down" ? "text-red-500" : 
                        "text-gray-500"
                      }`}>
                        {trend.percentage}% {trend.trend === "up" ? "increase" : trend.trend === "down" ? "decrease" : "change"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-16 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.data.slice(-5)}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={metric.color}
                          strokeWidth={2}
                          dot={false}
                        />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit Completion Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Habit Completion Rate
            </CardTitle>
            <CardDescription>
              Completion percentage for daily habits
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockHabitCompletionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockHabitCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Insights */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Personalized analysis of your progress
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {insightsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : !insights && import.meta.env.VITE_GEMINI_API_KEY ? (
              <div className="text-center py-6">
                <Info className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">
                  Select metrics to get AI-powered insights
                </p>
                <Button 
                  onClick={getAIInsights}
                  variant="outline"
                  className="gap-2"
                >
                  <Activity className="h-4 w-4" /> Generate Insights
                </Button>
              </div>
            ) : insights ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Summary</h4>
                  <p className="text-sm text-gray-600">{insights.summary}</p>
                </div>
                
                {insights.observations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Observations</h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      {insights.observations.map((observation, i) => (
                        <li key={i}>{observation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {insights.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      {insights.recommendations.map((recommendation, i) => (
                        <li key={i}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-1">
                  <Button 
                    onClick={getAIInsights}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Activity className="h-3 w-3" /> Refresh Insights
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full py-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">
                    AI-powered insights are currently unavailable
                  </p>
                  <p className="text-sm text-gray-400">
                    A Gemini API key is required for this feature
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}