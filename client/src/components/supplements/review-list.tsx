import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Star } from "lucide-react";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types for supplement reviews
interface SupplementReview {
  id: number;
  supplementId: number;
  userId: number;
  user: {
    id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    email?: string;
  };
  rating: number;
  content: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewListProps {
  supplementId: number;
  supplementName: string;
  overallRating: number;
  reviewCount: number;
}

export function ReviewList({ 
  supplementId, 
  supplementName, 
  overallRating, 
  reviewCount 
}: ReviewListProps) {
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { data: reviews, isLoading, error } = useQuery<SupplementReview[]>({
    queryKey: ['/api/supplement-reviews', supplementId],
    enabled: !!supplementId,
  });
  
  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Invalidate the review queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ['/api/supplement-reviews', supplementId] });
    queryClient.invalidateQueries({ queryKey: ['/api/supplements', supplementId] });
  };
  
  const handleVoteUpdated = () => {
    // Refresh the reviews data
    queryClient.invalidateQueries({ queryKey: ['/api/supplement-reviews', supplementId] });
  };
  
  // Calculate rating distribution from reviews
  const ratingCounts = reviews ? [1, 2, 3, 4, 5].map(rating => 
    reviews.filter((review: SupplementReview) => review.rating === rating).length
  ) : [0, 0, 0, 0, 0];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold">{overallRating.toFixed(1)}</span>
          <div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= Math.round(overallRating) ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Based on {reviewCount} reviews
            </span>
          </div>
        </div>
        
        <Button onClick={() => setShowReviewForm(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Write a Review
        </Button>
      </div>
      
      {/* Rating distribution */}
      {reviews && reviews.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Rating Distribution</h3>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating, index) => {
              const count = ratingCounts[5 - rating];
              const percentage = reviewCount ? Math.round((count / reviewCount) * 100) : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-14">
                    <span>{rating}</span>
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-14 text-right">
                    {count} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Reviews list */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-2">
            Failed to load reviews. Please try again later.
          </p>
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: SupplementReview) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              onVoteUpdated={handleVoteUpdated}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No Reviews Yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to share your experience with this supplement
          </p>
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        </div>
      )}
      
      {/* Review form dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review {supplementName}</DialogTitle>
            <DialogDescription>
              Share your experience and help others make informed decisions
            </DialogDescription>
          </DialogHeader>
          <ReviewForm 
            supplementId={supplementId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}