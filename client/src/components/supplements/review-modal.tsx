import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarIcon, ThumbsUp, Trash2, Edit, AlertCircle, Filter, Calendar, SortAsc, SortDesc, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
  helpfulVotes: number;
  unhelpfulVotes: number;
  isVerifiedPurchase?: boolean;
  user: {
    id: number;
    username: string;
    name: string;
    reviewCount?: number;
    expertLevel?: string;
  };
}

interface ReviewHelpfulVote {
  reviewId: number;
  userId: number;
  isHelpful: boolean;
}

export function ReviewModal({ supplementId, supplementName, isOpen, onClose }: ReviewModalProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'date-desc' | 'date-asc' | 'rating-high' | 'rating-low' | 'helpful'>('date-desc');
  const [filterOption, setFilterOption] = useState<'all' | 'verified' | '5-star' | '1-star' | 'with-content'>('all');
  
  // Fetch reviews
  const { data: reviewsData = [], isLoading } = useQuery({
    queryKey: [`/api/supplements/${supplementId}/reviews`],
    enabled: isOpen,
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Type assertion for reviews
  const reviews = reviewsData as Review[];
  
  // Fetch user's helpful votes
  const { data: userHelpfulVotes = [] } = useQuery({
    queryKey: [`/api/supplements/reviews/helpful/${user?.id}`],
    enabled: isOpen && !!user,
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
  
  // Edit review mutation
  const editReviewMutation = useMutation({
    mutationFn: (data: { id: number; rating: number; content: string }) => {
      return apiRequest("PATCH", `/api/supplements/reviews/${data.id}`, {
        rating: data.rating,
        content: data.content
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplements/${supplementId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/supplements'] });
      
      toast({
        title: "Review updated",
        description: "Your review has been updated successfully.",
      });
      
      setReviewContent("");
      setUserRating(5);
      setIsEditing(false);
      setEditingReviewId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update your review. Please try again.",
        variant: "destructive",
      });
      console.error("Review update error:", error);
    }
  });
  
  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => {
      return apiRequest("DELETE", `/api/supplements/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplements/${supplementId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/supplements'] });
      
      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully.",
      });
      
      setReviewToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete your review. Please try again.",
        variant: "destructive",
      });
      console.error("Review deletion error:", error);
    }
  });
  
  // Vote for review helpfulness
  const voteHelpfulMutation = useMutation({
    mutationFn: (data: { reviewId: number; userId: number; isHelpful: boolean }) => {
      return apiRequest("POST", "/api/supplements/reviews/helpful", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplements/${supplementId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/supplements/reviews/helpful/${user?.id}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to register your vote. Please try again.",
        variant: "destructive",
      });
      console.error("Helpful vote error:", error);
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

    if (isEditing && editingReviewId) {
      editReviewMutation.mutate({
        id: editingReviewId,
        rating: userRating,
        content: reviewContent
      });
    } else {
      submitReviewMutation.mutate({
        supplementId,
        userId: user.id,
        rating: userRating,
        content: reviewContent
      });
    }
  };
  
  // Start editing a review
  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setUserRating(review.rating);
    setReviewContent(review.content || "");
    setIsEditing(true);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setUserRating(5);
    setReviewContent("");
    setIsEditing(false);
  };
  
  // Prepare to delete a review
  const handleDeleteReviewClick = (reviewId: number) => {
    setReviewToDelete(reviewId);
    setDeleteConfirmOpen(true);
  };
  
  // Confirm and execute review deletion
  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteReviewMutation.mutate(reviewToDelete);
      setDeleteConfirmOpen(false);
    }
  };
  
  // Vote a review as helpful or not helpful
  const handleHelpfulVote = (reviewId: number, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to vote on reviews",
        variant: "destructive",
      });
      return;
    }
    
    voteHelpfulMutation.mutate({
      reviewId,
      userId: user.id,
      isHelpful
    });
  };
  
  // Check if a user has already voted on a review
  const hasUserVotedOnReview = (reviewId: number) => {
    return (userHelpfulVotes as ReviewHelpfulVote[])?.some(
      vote => vote.reviewId === reviewId
    );
  };
  
  // Get if a user found a review helpful
  const didUserFindHelpful = (reviewId: number) => {
    const vote = (userHelpfulVotes as ReviewHelpfulVote[])?.find(
      vote => vote.reviewId === reviewId
    );
    return vote?.isHelpful;
  };

  // Filter and sort reviews
  const getFilteredAndSortedReviews = () => {
    let filteredReviews = [...reviews];
    
    // Apply filters
    if (filterOption === 'verified') {
      filteredReviews = filteredReviews.filter(review => review.isVerifiedPurchase);
    } else if (filterOption === '5-star') {
      filteredReviews = filteredReviews.filter(review => review.rating === 5);
    } else if (filterOption === '1-star') {
      filteredReviews = filteredReviews.filter(review => review.rating === 1);
    } else if (filterOption === 'with-content') {
      filteredReviews = filteredReviews.filter(review => review.content && review.content.trim().length > 0);
    }
    
    // Apply sorting
    if (sortOption === 'date-desc') {
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'date-asc') {
      filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === 'rating-high') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'rating-low') {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === 'helpful') {
      filteredReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
    }
    
    return filteredReviews;
  };

  // Check if user already has a review
  const userReview = reviews.find((review: Review) => review.userId === user?.id);
  
  // Reset edit state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setEditingReviewId(null);
      setReviewContent("");
      setUserRating(5);
    }
  }, [isOpen]);

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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reviews for {supplementName}</DialogTitle>
            <DialogDescription>
              See what the community thinks about this supplement or add your own review
            </DialogDescription>
          </DialogHeader>

          {/* Review Form - shown when user hasn't reviewed or is editing */}
          {(!userReview || isEditing) && (
            <>
              <div className="my-4">
                <h3 className="text-lg font-medium mb-2">
                  {isEditing ? "Edit Your Review" : "Write a Review"}
                </h3>
                {renderStarInput()}
                <Textarea
                  placeholder="Share your experience with this supplement..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="mt-2 flex justify-end space-x-2">
                  {isEditing && (
                    <Button 
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={(submitReviewMutation.isPending || editReviewMutation.isPending) || !user}
                  >
                    {(submitReviewMutation.isPending || editReviewMutation.isPending) 
                      ? (isEditing ? "Updating..." : "Submitting...") 
                      : (isEditing ? "Update Review" : "Submit Review")}
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Community Reviews</h3>
              
              {/* Filter and Sort Controls */}
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter Reviews</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterOption('all')}>
                      All Reviews
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterOption('verified')}>
                      Verified Purchases
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterOption('5-star')}>
                      5 Star Reviews
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterOption('1-star')}>
                      1 Star Reviews
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterOption('with-content')}>
                      With Comments
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <SortAsc className="h-4 w-4 mr-1" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort Reviews</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortOption('date-desc')}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('date-asc')}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('rating-high')}>
                      <StarIcon className="h-4 w-4 mr-1" />
                      Highest Rated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('rating-low')}>
                      <StarIcon className="h-4 w-4 mr-1" />
                      Lowest Rated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('helpful')}>
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Most Helpful
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
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
                {/* Small text showing the number of reviews */}
                <div className="text-sm text-muted-foreground mb-2">
                  Showing {getFilteredAndSortedReviews().length} of {reviews.length} reviews
                </div>
              
                {getFilteredAndSortedReviews().map((review: Review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="font-medium">{review.user.name}</p>
                            {review.user.reviewCount && review.user.reviewCount > 5 && (
                              <Badge variant="outline" className="text-xs py-0">
                                {review.user.reviewCount}+ reviews
                              </Badge>
                            )}
                            {review.user.expertLevel && (
                              <Badge className="bg-blue-500 text-xs py-0">
                                {review.user.expertLevel}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(review.createdAt), 'MMM d, yyyy')}
                            </span>
                            {review.isVerifiedPurchase && (
                              <Badge variant="secondary" className="text-xs py-0 bg-green-100 text-green-800">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {review.userId === user?.id && (
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleEditReview(review)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-red-500"
                            onClick={() => handleDeleteReviewClick(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {review.content && (
                      <p className="text-sm mt-2 mb-3">{review.content}</p>
                    )}
                    
                    {/* Helpful/Unhelpful buttons */}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="text-xs text-muted-foreground">
                        {review.helpfulVotes > 0 && (
                          <span>{review.helpfulVotes} found this helpful</span>
                        )}
                      </div>
                      
                      {review.userId !== user?.id && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`h-7 text-xs ${hasUserVotedOnReview(review.id) && didUserFindHelpful(review.id) ? 'bg-green-50 border-green-200' : ''}`}
                            onClick={() => handleHelpfulVote(review.id, true)}
                            disabled={hasUserVotedOnReview(review.id) || voteHelpfulMutation.isPending}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`h-7 text-xs ${hasUserVotedOnReview(review.id) && !didUserFindHelpful(review.id) ? 'bg-red-50 border-red-200' : ''}`}
                            onClick={() => handleHelpfulVote(review.id, false)}
                            disabled={hasUserVotedOnReview(review.id) || voteHelpfulMutation.isPending}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1 rotate-180" />
                            Not helpful
                          </Button>
                        </div>
                      )}
                    </div>
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
      
      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}