import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ReviewModalProps {
  supplementId: number;
  supplementName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Review {
  id: number;
  supplementId: number;
  userId: number;
  rating: number;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

export function ReviewModal({ supplementId, supplementName, isOpen, onClose }: ReviewModalProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: [`/api/supplements/${supplementId}/reviews`],
    enabled: isOpen,
    staleTime: 60 * 1000, // 1 minute
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: (data: { supplementId: number; userId: number; rating: number; content: string }) => {
      return apiRequest("POST", "/api/supplements/reviews", data);
    },
    onSuccess: () => {
      // Invalidate reviews and supplements queries
      queryClient.invalidateQueries({ queryKey: [`/api/supplements/${supplementId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/supplements'] });
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience with this supplement!",
      });
      
      setReviewContent("");
      setUserRating(5);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
      console.error("Review submission error:", error);
    }
  });

  // Handle review submission
  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (reviewContent.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please provide more details in your review",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      supplementId,
      userId: user.id,
      rating: userRating,
      content: reviewContent
    });
  };

  // Check if user already has a review
  const userReview = reviews.find((review: Review) => review.userId === user?.id);

  // Render star rating input
  const renderStarInput = () => {
    return (
      <div className="flex items-center mb-4">
        <span className="text-sm font-medium mr-2">Your rating:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= (hoveredStar || userRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setUserRating(star)}
            />
          ))}
        </div>
      </div>
    );
  };

  // Function to render stars for a given rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reviews for {supplementName}</DialogTitle>
          <DialogDescription>
            See what the community thinks about this supplement or add your own review
          </DialogDescription>
        </DialogHeader>

        {!userReview && (
          <>
            <div className="my-4">
              <h3 className="text-lg font-medium mb-2">Write a Review</h3>
              {renderStarInput()}
              <Textarea
                placeholder="Share your experience with this supplement..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="mt-2 text-right">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={submitReviewMutation.isPending || !user}
                >
                  {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
          </>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-4">Community Reviews</h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review: Review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {review.userId === user?.id && (
                      <Button variant="ghost" size="sm" className="h-8">
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  {review.content && (
                    <p className="text-sm mt-2">{review.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}