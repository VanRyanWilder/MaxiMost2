import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ReviewCard } from "./review-card";
import { RatingStars } from "./rating-stars";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentReviewsProps {
  limit?: number;
  onViewAllClick?: () => void;
  showViewAll?: boolean;
}

export function RecentReviews({ 
  limit = 3, 
  onViewAllClick, 
  showViewAll = true 
}: RecentReviewsProps) {
  const { data: recentReviews, isLoading } = useQuery({
    queryKey: ['/api/supplement-reviews/recent'],
    // We would normally have this endpoint on the backend
    // For demo purposes, we'll just return some sample data
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        {
          id: 1,
          supplementId: 1,
          userId: 101,
          user: {
            id: 101,
            username: "health_enthusiast",
            firstName: "Alex",
            profileImageUrl: null
          },
          rating: 5,
          content: "This omega-3 supplement has been a game-changer for me. After 3 weeks, I noticed improved mental clarity and reduced joint discomfort. The quality is excellent with no fishy aftertaste.",
          helpfulVotes: 24,
          unhelpfulVotes: 2,
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          supplementId: 3,
          userId: 102,
          user: {
            id: 102,
            username: "fitness_pro",
            lastName: "Johnson",
            profileImageUrl: null
          },
          rating: 4,
          content: "Solid Vitamin D supplement. I like that it includes K2 for better absorption. Noticed increased energy levels after consistent use over several weeks.",
          helpfulVotes: 16,
          unhelpfulVotes: 1,
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          supplementId: 2,
          userId: 103,
          user: {
            id: 103,
            firstName: "Jamie",
            lastName: "Smith",
            profileImageUrl: null
          },
          rating: 5,
          content: "Best magnesium supplement I've tried. The glycinate form is gentle on the stomach and really helps with sleep quality and muscle recovery after workouts.",
          helpfulVotes: 32,
          unhelpfulVotes: 0,
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          supplementId: 5,
          userId: 104,
          user: {
            id: 104,
            username: "science_geek",
            profileImageUrl: null
          },
          rating: 3,
          content: "The B-complex is decent, but I wish they used methylated forms of B vitamins which are better for those with MTHFR gene variants. Still, noticed some improvement in energy levels.",
          helpfulVotes: 8,
          unhelpfulVotes: 1,
          isVerifiedPurchase: false,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        }
      ].slice(0, limit);
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!recentReviews || recentReviews.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No reviews available yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[520px] pr-4">
        <div className="space-y-4">
          {recentReviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium">{review.user.username || review.user.firstName || `User ${review.userId}`}</div>
                  <RatingStars rating={review.rating} size="sm" className="mt-1" />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <p className="text-sm line-clamp-3">{review.content}</p>
              
              <div className="mt-2 text-xs">
                <a href={`/supplement-detail/${review.supplementId}`} className="text-primary hover:underline">
                  View supplement →
                </a>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {showViewAll && onViewAllClick && (
        <div className="flex justify-center mt-2">
          <Button variant="outline" size="sm" onClick={onViewAllClick}>
            View all reviews
          </Button>
        </div>
      )}
    </div>
  );
}