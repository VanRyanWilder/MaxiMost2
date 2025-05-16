import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info
} from "lucide-react";
import { Habit, HabitCompletion } from "@/types/habit";
import { 
  CATEGORY_COLORS,
  calculateTrend,
  formatDate
} from "@/utils/habit-progress-utils";

interface HabitProgressVisualizationProps {
  className?: string;
  habits?: Habit[];
  completions?: HabitCompletion[];
  isCompact?: boolean;
}

// Sample habit completion data by date and category
const mockPhysicalHabitData = [
  { date: "2023-02-05", value: 82 },
  { date: "2023-02-12", value: 88 },
  { date: "2023-02-19", value: 90 },
  { date: "2023-02-26", value: 85 },
  { date: "2023-03-05", value: 92 },
];

const mockNutritionHabitData = [
  { date: "2023-02-05", value: 75 },
  { date: "2023-02-12", value: 80 },
  { date: "2023-02-19", value: 82 },
  { date: "2023-02-26", value: 85 },
  { date: "2023-03-05", value: 88 },
];

const mockSleepHabitData = [
  { date: "2023-02-05", value: 82 },
  { date: "2023-02-12", value: 85 },
  { date: "2023-02-19", value: 82 },
  { date: "2023-02-26", value: 88 },
  { date: "2023-03-05", value: 90 },
];

const mockMentalHabitData = [
  { date: "2023-02-05", value: 75 },
  { date: "2023-02-12", value: 80 },
  { date: "2023-02-19", value: 82 },
  { date: "2023-02-26", value: 85 },
  { date: "2023-03-05", value: 88 },
];

const mockRelationshipHabitData = [
  { date: "2023-02-05", value: 68 },
  { date: "2023-02-12", value: 70 },
  { date: "2023-02-19", value: 75 },
  { date: "2023-02-26", value: 78 },
  { date: "2023-03-05", value: 82 },
];

const mockFinancialHabitData = [
  { date: "2023-02-05", value: 62 },
  { date: "2023-02-12", value: 65 },
  { date: "2023-02-19", value: 68 },
  { date: "2023-02-26", value: 72 },
  { date: "2023-03-05", value: 75 },
];

// Sample habit completion by category
const mockHabitCompletionData = [
  { name: "Physical", value: 92 },
  { name: "Nutrition", value: 88 },
  { name: "Sleep", value: 90 },
  { name: "Mental", value: 88 },
  { name: "Relationships", value: 82 },
  { name: "Financial", value: 75 },
];

export function HabitProgressVisualization({ 
  className,
  habits = [],
  completions = [],
  isCompact = false
}: HabitProgressVisualizationProps) {
  const [timeRange, setTimeRange] = useState<string>("4w");
  const [chartType, setChartType] = useState<string>("line");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Physical", "Mental"]);
  
  // Use real data if available, otherwise fall back to mock data
  const useRealData = habits.length > 0 && completions.length > 0;

  const timeRangeOptions = [
    { value: "1w", label: "1 Week" },
    { value: "4w", label: "4 Weeks" },
    { value: "12w", label: "12 Weeks" },
    { value: "24w", label: "24 Weeks" },
  ];

  // Calculate date ranges based on selected time range
  const getDateRange = () => {
    const today = new Date();
    let startDate;
    
    switch(timeRange) {
      case "1w":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "12w":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 84);
        break;
      case "24w":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 168);
        break;
      case "4w":
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 28);
    }
    
    return { startDate, endDate: today };
  };
  
  // Get real data if available
  const getCategoryData = () => {
    if (useRealData) {
      const { startDate, endDate } = getDateRange();
      
      // Use utilities to calculate real data
      const realData = getLatestCompletionsByCategory(
        habits,
        completions
      );
      
      return [
        { id: "Physical", name: "Physical", unit: "%", data: realData["Physical"] || [], color: CATEGORY_COLORS.Physical },
        { id: "Nutrition", name: "Nutrition", unit: "%", data: realData["Nutrition"] || [], color: CATEGORY_COLORS.Nutrition },
        { id: "Sleep", name: "Sleep", unit: "%", data: realData["Sleep"] || [], color: CATEGORY_COLORS.Sleep },
        { id: "Mental", name: "Mental", unit: "%", data: realData["Mental"] || [], color: CATEGORY_COLORS.Mental },
        { id: "Relationships", name: "Relationships", unit: "%", data: realData["Relationships"] || [], color: CATEGORY_COLORS.Relationships },
        { id: "Financial", name: "Financial", unit: "%", data: realData["Financial"] || [], color: CATEGORY_COLORS.Financial },
      ];
    } else {
      // Use mock data
      return [
        { id: "Physical", name: "Physical", unit: "%", data: mockPhysicalHabitData, color: CATEGORY_COLORS.Physical },
        { id: "Nutrition", name: "Nutrition", unit: "%", data: mockNutritionHabitData, color: CATEGORY_COLORS.Nutrition },
        { id: "Sleep", name: "Sleep", unit: "%", data: mockSleepHabitData, color: CATEGORY_COLORS.Sleep },
        { id: "Mental", name: "Mental", unit: "%", data: mockMentalHabitData, color: CATEGORY_COLORS.Mental },
        { id: "Relationships", name: "Relationships", unit: "%", data: mockRelationshipHabitData, color: CATEGORY_COLORS.Relationships },
        { id: "Financial", name: "Financial", unit: "%", data: mockFinancialHabitData, color: CATEGORY_COLORS.Financial },
      ];
    }
  };
  
  // Get category options
  const categoryOptions = getCategoryData();

  // Filter categories based on selection
  const filteredCategories = categoryOptions.filter(category => 
    selectedCategories.includes(category.id)
  );

  // Using the utility functions from habit-progress-utils.ts

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

  // Insights content
  const insights = {
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

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Habit Progress Tracker
              </CardTitle>
              <CardDescription>
                Track your habit completion across different categories
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
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryOptions.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                style={{ 
                  backgroundColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
                  borderColor: category.color,
                  color: selectedCategories.includes(category.id) ? 'white' : category.color
                }}
                className="cursor-pointer"
                onClick={() => {
                  const newSelection = selectedCategories.includes(category.id)
                    ? selectedCategories.filter(id => id !== category.id)
                    : [...selectedCategories, category.id];
                  
                  // Ensure at least one category is selected
                  if (newSelection.length > 0) {
                    setSelectedCategories(newSelection);
                  }
                }}
              >
                {category.name}
              </Badge>
            ))}
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    minTickGap={30}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {filteredCategories.map((category) => (
                    <Line
                      key={category.id}
                      type="monotone"
                      dataKey="value"
                      data={category.data}
                      name={category.name}
                      stroke={category.color}
                      activeDot={{ r: 5 }}
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
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {filteredCategories.map((category) => (
                    <Area
                      key={category.id}
                      type="monotone"
                      dataKey="value"
                      data={category.data}
                      name={category.name}
                      stroke={category.color}
                      fill={category.color}
                      fillOpacity={0.2}
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
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {filteredCategories.map((category) => (
                    <Bar
                      key={category.id}
                      dataKey="value"
                      data={category.data}
                      name={category.name}
                      fill={category.color}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Category Cards */}
        {categoryOptions.map(category => {
          const trend = calculateTrend(category.data);
          const latestValue = category.data[category.data.length - 1].value;
          
          return (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="pb-2" style={{borderBottom: `2px solid ${category.color}30`}}>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{backgroundColor: category.color}}></span>
                  {category.name} Habits
                </CardTitle>
                <CardDescription>Habit adherence rate</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{latestValue}<span className="text-sm font-normal text-gray-500">%</span></p>
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
                        {trend.percentage}% {trend.trend !== "stable" && (trend.trend === "up" ? "improvement" : "decrease")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-16 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={category.data}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={category.color}
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
              Current completion percentage by category
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockHabitCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Insights */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Progress Insights
            </CardTitle>
            <CardDescription>
              Analysis of your habit data
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="font-medium">{insights.summary}</p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Key Observations:</h4>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  {insights.observations.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  {insights.recommendations.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}