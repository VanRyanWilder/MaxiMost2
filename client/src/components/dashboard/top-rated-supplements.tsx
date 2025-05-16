import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Trophy, 
  ThumbsUp, 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  ArrowUpRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "../supplements/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function TopRatedSupplements() {
  const [, setLocation] = useLocation();
  
  const { data: supplements, isLoading } = useQuery({
    queryKey: ['/api/supplements/top-rated'],
    // In a real app, this would be an API call
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: 1,
          name: "Omega-3 (EPA/DHA)",
          rating: 4.8,
          reviewCount: 342,
          votesUp: 942,
          category: "Essential Fatty Acids",
          price: 29.99,
          description: "High-quality fish oil providing essential EPA and DHA fatty acids",
          tags: ["Heart Health", "Brain Function", "Inflammation"]
        },
        {
          id: 2,
          name: "Magnesium Glycinate",
          rating: 4.7,
          reviewCount: 287,
          votesUp: 822,
          category: "Minerals",
          price: 19.99,
          description: "Highly bioavailable form of magnesium for relaxation and sleep",
          tags: ["Sleep", "Muscle Recovery", "Stress"]
        },
        {
          id: 3,
          name: "Vitamin D3 + K2",
          rating: 4.9,
          reviewCount: 418,
          votesUp: 1036,
          category: "Vitamins",
          price: 24.99,
          description: "Synergistic combination for optimal calcium metabolism and immune support",
          tags: ["Immune Health", "Bone Health", "Metabolism"]
        }
      ];
    }
  });
  
  const handleViewDetails = (id: number) => {
    setLocation(`/supplement-detail/${id}`);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle>Top-Rated Supplements</CardTitle>
        </div>
        <CardDescription>
          Highest-rated supplements with community reviews
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {supplements?.map((supplement) => (
            <div 
              key={supplement.id}
              className="flex gap-3 items-start pb-3 border-b last:border-b-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShoppingCart className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{supplement.name}</h4>
                
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={supplement.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    ({supplement.reviewCount})
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-medium">${supplement.price}</span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {supplement.category}
                  </Badge>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0" 
                onClick={() => handleViewDetails(supplement.id)}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setLocation('/supplements')}
        >
          <span>View all supplements</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}