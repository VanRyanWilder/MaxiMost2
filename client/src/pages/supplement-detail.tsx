import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  Beaker, 
  ExternalLink,
  Trophy,
  Star,
  StarHalf,
  User,
  Quote,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Clock,
  Send,
  Heart,
  HelpCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ExpertInsight {
  expert: string;
  insight: string;
}

interface TopSupplement {
  id: number;
  name: string;
  benefits: string;
  expertInsights: ExpertInsight[];
  dosage: string;
  amazonLink: string;
  averageRating?: number;
  totalReviews?: number;
  upvotes?: number;
  downvotes?: number;
  description?: string;
  sideEffects?: string;
  interactions?: string;
  categories?: string[];
  valueRating?: number;
  monthlyCostEstimate?: string;
  bestValue?: boolean;
  imageUrl?: string;
}

interface ReviewType {
  id: number;
  supplementId: number;
  userId: number;
  rating: number;
  content: string | null;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
  // Flag to track user's vote on this review
  userVoted?: 'helpful' | 'unhelpful' | null;
}

// Static data for the top 10 supplements
const getSupplementById = (id: number): TopSupplement | undefined => {
  const supplements = [
    {
      id: 1,
      name: "Omega-3 Fatty Acids (EPA and DHA)",
      benefits: "Reduces inflammation, supports heart and brain health, aids recovery.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Highlights omega-3s for their anti-inflammatory properties and cognitive benefits, key for recovery and mental clarity."
        },
        {
          expert: "Peter Attia",
          insight: "Recommends them for cardiovascular health, vital for endurance athletes."
        },
        {
          expert: "Ben Greenfield",
          insight: "Suggests omega-3s to reduce joint inflammation and enhance performance in high-intensity sports."
        }
      ],
      dosage: "2-4g daily, with ~2g EPA for optimal anti-inflammatory effects.",
      amazonLink: "https://www.amazon.com/dp/B01GV4O37E?tag=maximusgains-20",
      description: "High-quality omega-3 fatty acids provide essential EPA and DHA which cannot be produced by the body. These nutrients are critical for cellular health, brain function, and managing inflammation.",
      sideEffects: "Fishy aftertaste (reduced in quality products), occasional mild digestive discomfort.",
      interactions: "May interact with blood thinners. Consult doctor if on anticoagulant medication.",
      categories: ["Essential", "Daily", "Foundational"],
      valueRating: 9.5,
      monthlyCostEstimate: "$15-25",
      bestValue: true
    },
    {
      id: 2,
      name: "Vitamin D3",
      benefits: "Boosts bone health, immunity, and muscle function.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Stresses its role in immune support and injury prevention for athletes with heavy training loads."
        },
        {
          expert: "Kelly Starrett",
          insight: "Advocates for vitamin D to maintain bone density and aid recovery, especially for runners."
        },
        {
          expert: "Cate Shanahan",
          insight: "Notes its importance for calcium absorption and preventing stress fractures."
        }
      ],
      dosage: "4,000-5,000 IU/day, adjusted based on blood levels.",
      amazonLink: "https://www.amazon.com/dp/B0032BH76O?tag=maximusgains-20",
      description: "Vitamin D3 (cholecalciferol) is crucial for calcium absorption, immune function, and hormone regulation. Most people are deficient, making supplementation essential, especially in low-sunlight environments.",
      sideEffects: "Very rare at recommended doses. Excessive doses (>10,000 IU daily for months) may cause hypercalcemia.",
      interactions: "May interact with certain medications including statins, steroids, and weight loss drugs.",
      categories: ["Essential", "Daily", "Foundational"],
      valueRating: 9.8,
      monthlyCostEstimate: "$5-15",
      bestValue: true
    },
    // Other supplements would be listed here
  ];
  
  return supplements.find(s => s.id === id);
};

export default function SupplementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supplementId = parseInt(id);
  const { toast } = useToast();
  const { user, userLoading } = useUser();
  const queryClient = useQueryClient();
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: "",
    isVerifiedPurchase: false
  });
  
  // Initial data from static source (would be replaced by API call in production)
  const initialSupplement = getSupplementById(supplementId);
  
  // Fetch supplement details
  const { 
    data: supplement, 
    isLoading: isSupplementLoading,
    error: supplementError
  } = useQuery({
    queryKey: ['/api/supplements', supplementId],
    queryFn: async () => {
      try {
        const response = await apiRequest(
          'GET', 
          `/api/supplements/${supplementId}`
        );
        const data = await response.json();
        
        // Merge static and dynamic data
        return {
          ...initialSupplement,
          ...data,
          // Ensure expertInsights comes from static data since it's not in the DB
          expertInsights: initialSupplement?.expertInsights || []
        };
      } catch (error) {
        console.error("Error fetching supplement:", error);
        // Fall back to static data if API fails
        return initialSupplement;
      }
    },
    // Always use static data initially if available
    initialData: initialSupplement,
    enabled: !!supplementId
  });
  
  // Fetch reviews
  const { 
    data: reviews = [], 
    isLoading: areReviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: ['/api/supplement-reviews', supplementId],
    queryFn: async () => {
      try {
        const response = await apiRequest(
          'GET', 
          `/api/supplements/${supplementId}/reviews`
        );
        return response.json();
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
      }
    },
    enabled: !!supplementId
  });
  
  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to submit a review");
      
      const response = await apiRequest(
        'POST',
        `/api/supplements/${supplementId}/reviews`,
        {
          rating: newReview.rating,
          content: newReview.content.trim() || null,
          isVerifiedPurchase: newReview.isVerifiedPurchase
        }
      );
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience with this supplement!",
      });
      
      // Reset form
      setNewReview({
        rating: 5,
        content: "",
        isVerifiedPurchase: false
      });
      
      // Refresh reviews
      queryClient.invalidateQueries({ queryKey: ['/api/supplement-reviews', supplementId] });
      queryClient.invalidateQueries({ queryKey: ['/api/supplements', supplementId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  });
  
  // Vote on supplement mutation
  const voteOnSupplementMutation = useMutation({
    mutationFn: async (voteType: 'up' | 'down') => {
      if (!user) throw new Error("You must be logged in to vote");
      
      const response = await apiRequest(
        'POST',
        `/api/supplements/${supplementId}/vote`,
        { voteType }
      );
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/supplements', supplementId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to register vote",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  });
  
  // Vote on review helpfulness mutation
  const voteOnReviewMutation = useMutation({
    mutationFn: async ({ reviewId, isHelpful }: { reviewId: number, isHelpful: boolean }) => {
      if (!user) throw new Error("You must be logged in to vote");
      
      const response = await apiRequest(
        'POST',
        `/api/supplement-reviews/${reviewId}/vote`,
        { isHelpful }
      );
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/supplement-reviews', supplementId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to register vote",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  });
  
  // Handlers
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    submitReviewMutation.mutate();
  };
  
  const handleVoteOnSupplement = (voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to vote on supplements",
        variant: "destructive"
      });
      return;
    }
    
    voteOnSupplementMutation.mutate(voteType);
  };
  
  const handleVoteOnReview = (reviewId: number, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to vote on reviews",
        variant: "destructive"
      });
      return;
    }
    
    voteOnReviewMutation.mutate({ reviewId, isHelpful });
  };
  
  // Handle stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };
  
  // Render interactive stars for leaving a review
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            variant="ghost"
            size="sm"
            className="p-0 h-auto hover:bg-transparent"
            onClick={() => setNewReview({ ...newReview, rating })}
          >
            <Star 
              className={`h-6 w-6 ${
                rating <= newReview.rating 
                  ? "fill-amber-500 text-amber-500" 
                  : "text-gray-300"
              }`} 
            />
          </Button>
        ))}
      </div>
    );
  };
  
  if (supplementError) {
    return (
      <PageContainer title="Supplement Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Supplement Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the supplement you're looking for.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </PageContainer>
    );
  }
  
  if (isSupplementLoading || !supplement) {
    return (
      <PageContainer title="Loading Supplement Details">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title={`${supplement.name} - Supplement Details`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Button 
            variant="ghost" 
            className="p-0 h-auto hover:bg-transparent"
            onClick={() => window.history.back()}
          >
            ← Back to Supplements
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold shadow-md">
            {supplement.id}
          </div>
          <h1 className="text-3xl font-bold">{supplement.name}</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Benefits Section */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-5 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold text-green-800">Benefits</h2>
                </div>
                <p className="text-green-700">{supplement.benefits}</p>
              </CardContent>
            </Card>
            
            {/* Description Section */}
            {supplement.description && (
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h2 className="font-semibold text-gray-800">Description</h2>
                  </div>
                  <p className="text-gray-700">{supplement.description}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Dosage Section */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-5 bg-blue-50">
                <div className="flex items-center gap-2 mb-3">
                  <Beaker className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-blue-800">Recommended Dosage</h2>
                </div>
                <p className="text-blue-700">{supplement.dosage}</p>
              </CardContent>
            </Card>
            
            {/* Side Effects Section */}
            {supplement.sideEffects && (
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-5 bg-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h2 className="font-semibold text-amber-800">Potential Side Effects</h2>
                  </div>
                  <p className="text-amber-700">{supplement.sideEffects}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Interactions Section */}
            {supplement.interactions && (
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-5 bg-red-50">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                    <h2 className="font-semibold text-red-800">Potential Interactions</h2>
                  </div>
                  <p className="text-red-700">{supplement.interactions}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Expert Insights Section */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-5 bg-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-purple-600" />
                  <h2 className="font-semibold text-purple-800">Expert Insights</h2>
                </div>
                <div className="space-y-4">
                  {supplement.expertInsights?.map((insight, index) => (
                    <div key={index} className="bg-white p-4 rounded-md border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {insight.expert}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-700 italic">
                        <Quote className="h-4 w-4 inline-block mr-1 rotate-180" />
                        {insight.insight}
                        <Quote className="h-4 w-4 inline-block ml-1" />
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Community Reviews
              <Badge variant="outline" className="ml-2">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Badge>
            </h2>
            
            {/* Review Form */}
            {user && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Share Your Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Rating</label>
                        <div className="flex items-center gap-2">
                          {renderRatingSelector()}
                          <span className="text-sm text-muted-foreground ml-2">
                            {newReview.rating} out of 5 stars
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Review (optional)</label>
                        <Textarea 
                          placeholder="Share your experience with this supplement..."
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="verified-purchase"
                          checked={newReview.isVerifiedPurchase}
                          onChange={(e) => setNewReview({ ...newReview, isVerifiedPurchase: e.target.checked })}
                          className="mr-2"
                        />
                        <label htmlFor="verified-purchase" className="text-sm">
                          I purchased this product (verified reviews help others make decisions)
                        </label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto"
                        disabled={submitReviewMutation.isPending}
                      >
                        {submitReviewMutation.isPending ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send className="h-4 w-4 mr-2" />
                            Submit Review
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Review List */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: ReviewType) => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-medium">
                            {review.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{review.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center mt-2 sm:mt-0">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium">{review.rating}/5</span>
                        </div>
                      </div>
                      
                      {review.content && (
                        <p className="text-gray-700 mb-4">{review.content}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 text-sm">
                        <div className="text-muted-foreground">
                          {review.helpfulVotes + review.unhelpfulVotes > 0 ? (
                            <span>
                              {review.helpfulVotes} of {review.helpfulVotes + review.unhelpfulVotes} people found this helpful
                            </span>
                          ) : (
                            <span>Be the first to vote on this review</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant={review.userVoted === 'helpful' ? 'default' : 'outline'} 
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleVoteOnReview(review.id, true)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful
                          </Button>
                          <Button 
                            variant={review.userVoted === 'unhelpful' ? 'default' : 'outline'} 
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleVoteOnReview(review.id, false)}
                          >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Not Helpful
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Be the first to share your experience with this supplement!
                  </p>
                  {!user && (
                    <Button onClick={() => window.location.href = "/login"}>
                      Login to Leave a Review
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Rating Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl font-bold mr-2">
                  {supplement.averageRating ? supplement.averageRating.toFixed(1) : "N/A"}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    {supplement.averageRating ? renderStars(supplement.averageRating) : renderStars(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {supplement.totalReviews || 0} {supplement.totalReviews === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-6 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleVoteOnSupplement('up')}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{supplement.upvotes || 0}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleVoteOnSupplement('down')}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{supplement.downvotes || 0}</span>
                </Button>
              </div>
              
              {!user && (
                <div className="text-center text-sm text-muted-foreground">
                  <a href="/login" className="text-primary hover:underline">Log in</a> to vote or review
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Purchase Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplement.monthlyCostEstimate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Monthly Cost</span>
                  </div>
                  <div className="font-medium">{supplement.monthlyCostEstimate}</div>
                </div>
              )}
              
              {supplement.valueRating && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-amber-600" />
                    <span>Value Rating</span>
                  </div>
                  <div className="font-medium">{supplement.valueRating}/10</div>
                </div>
              )}
              
              {supplement.bestValue && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 w-full justify-center py-1 mt-2">
                  <Trophy className="h-3 w-3 mr-1" />
                  Best Value Pick
                </Badge>
              )}
              
              <div className="pt-4">
                <a 
                  href={supplement.amazonLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md w-full justify-center"
                >
                  <span>Buy on Amazon</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <div className="text-xs text-center mt-2 text-muted-foreground">
                  As an Amazon Associate we earn from qualifying purchases
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Related Categories */}
          {supplement.categories && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplement.categories.map((category, index) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}