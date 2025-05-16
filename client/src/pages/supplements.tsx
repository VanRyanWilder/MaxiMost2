import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, ShieldCheck, ShieldAlert, Star, ThumbsUp, ThumbsDown, Link } from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageContainer } from '@/components/page-container';
import { WriteReviewDialog } from '@/components/supplements/write-review-dialog';

// Types 
import { Supplement, SupplementReview } from '@shared/schema';

const SupplementsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userId, setUserId] = useState(1); // For demo purposes, hardcoded user ID
  
  // Fetch supplements
  const { data: supplements, isLoading: isLoadingSupplements } = useQuery({
    queryKey: ['/api/supplements', selectedCategory !== 'all' ? selectedCategory : null],
    queryFn: async () => {
      const url = selectedCategory === 'all' 
        ? '/api/supplements'
        : `/api/supplements?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch supplements');
      return response.json();
    }
  });
  
  const categories = [
    { id: "all", name: "All Supplements" },
    { id: "Essential", name: "Essential" },
    { id: "Performance", name: "Performance" },
    { id: "Daily", name: "Daily" },
    { id: "Foundational", name: "Foundational" },
    { id: "Advanced", name: "Advanced" }
  ];
  
  return (
    <PageContainer title="Supplements">
      <div className="flex flex-col space-y-8 pb-16">
        {/* Hero section */}
        <section className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">MaxiMost Supplement Guide</h1>
            <p className="text-lg mb-4 max-w-2xl">
              Community-driven ratings and reviews of the most effective supplements for optimal health and performance.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Expert verified and community tested</span>
            </div>
          </div>
        </section>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id}
                value={category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Main content */}
        {isLoadingSupplements ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplements?.map((supplement: Supplement) => (
              <SupplementCard 
                key={supplement.id} 
                supplement={supplement} 
                userId={userId}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

const SupplementCard = ({ supplement, userId }: { supplement: Supplement, userId: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // Fetch reviews for this supplement
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['/api/supplements', supplement.id, 'reviews'],
    queryFn: async () => {
      const response = await fetch(`/api/supplements/${supplement.id}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
    enabled: expanded // Only fetch when card is expanded
  });
  
  // Calculate rating distribution
  const getRatingDistribution = (reviews?: SupplementReview[]) => {
    if (!reviews || reviews.length === 0) return Array(5).fill(0);
    
    const counts = Array(5).fill(0);
    reviews.forEach(review => counts[review.rating - 1]++);
    return counts;
  };
  
  // Format categories for display
  const categories = supplement.categories.split(',').map(cat => cat.trim());
  
  // Format rating for display
  const starRating = supplement.averageRating ? Number(supplement.averageRating) : 0;
  
  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      const response = await fetch('/api/supplements/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          supplementId: supplement.id,
          voteType
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit vote');
      
      // Could refresh the supplement data here, for simplicity we're not
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-xl">{supplement.name}</CardTitle>
          {supplement.bestValue && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Best Value
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1 my-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < Math.round(starRating) 
                ? "fill-amber-500 text-amber-500" 
                : "text-gray-300"} 
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({supplement.totalReviews} reviews)
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {categories.map(category => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-gray-700 mb-2 line-clamp-3">
          {supplement.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-xs text-gray-500">Monthly Cost</p>
            <p className="font-medium">{supplement.monthlyCostEstimate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Value Rating</p>
            <div className="flex items-center">
              <span className="font-medium mr-2">{supplement.valueRating}/10</span>
              <Progress value={Number(supplement.valueRating) * 10} className="h-2" />
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Benefits</h4>
            <p className="text-sm">{supplement.benefits}</p>
            
            <h4 className="font-medium mt-4 mb-2">Recommended Dosage</h4>
            <p className="text-sm">{supplement.dosage}</p>
            
            {supplement.sideEffects && (
              <>
                <h4 className="font-medium mt-4 mb-2">Potential Side Effects</h4>
                <p className="text-sm">{supplement.sideEffects}</p>
              </>
            )}
            
            {supplement.amazonUrl && (
              <div className="mt-4">
                <Button asChild className="w-full" variant="outline">
                  <a href={supplement.amazonUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    View on Amazon <Link size={16} className="ml-2" />
                  </a>
                </Button>
              </div>
            )}
            
            {/* Expert Insights */}
            {supplement.expertInsights && supplement.expertInsights.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Expert Insights</h4>
                {supplement.expertInsights.map((insight: any, index: number) => (
                  <Alert key={index} className="mb-3 bg-blue-50 border-blue-200">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-sm font-semibold">
                      {insight.expert}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {insight.comment}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
            
            {/* Community Reviews */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Community Reviews</h4>
              {isLoadingReviews ? (
                <div className="py-4 text-center">
                  <p className="text-gray-500">Loading reviews...</p>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {/* Rating distribution */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h5 className="text-sm font-medium mb-2">Rating Distribution</h5>
                    {getRatingDistribution(reviews).reverse().map((count, i) => {
                      const starNumber = 5 - i;
                      const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={i} className="flex items-center text-sm mb-1">
                          <span className="w-16">{starNumber} stars</span>
                          <div className="w-full bg-gray-200 h-2 rounded-full mx-2">
                            <div
                              className="bg-amber-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator />
                  
                  {/* Review list */}
                  {reviews.map((review: SupplementReview & { user: { name: string } }) => (
                    <div key={review.id} className="py-2">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="font-medium text-sm">{review.user.name}</p>
                            {review.isVerifiedPurchase && (
                              <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-800 border-green-200">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-amber-500 my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"} 
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{review.content}</p>
                          
                          {/* Helpful buttons */}
                          <div className="flex items-center mt-2 space-x-4">
                            <button className="flex items-center text-xs text-gray-500 hover:text-blue-600">
                              <ThumbsUp size={14} className="mr-1" />
                              Helpful ({review.helpfulVotes})
                            </button>
                            <button className="flex items-center text-xs text-gray-500 hover:text-red-600">
                              <ThumbsDown size={14} className="mr-1" />
                              Not helpful ({review.unhelpfulVotes})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    Write a Review
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                  <p className="text-gray-500 mb-3">No reviews yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    Be the first to write a review
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => handleVote('up')}
          >
            <ThumbsUp size={16} className="mr-1" /> 
            {supplement.upvotes}
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleVote('down')}
          >
            <ThumbsDown size={16} className="mr-1" /> 
            {supplement.downvotes}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardFooter>
      
      {/* Review dialog */}
      <WriteReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        supplementId={supplement.id}
        userId={userId}
        supplementName={supplement.name}
      />
    </Card>
  );
};

export default SupplementsPage;