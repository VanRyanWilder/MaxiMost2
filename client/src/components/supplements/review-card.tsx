import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Star, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReviewCardProps {
  review: {
    id: number;
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
  };
  onVoteUpdated?: () => void;
}

export function ReviewCard({ review, onVoteUpdated }: ReviewCardProps) {
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<'helpful' | 'unhelpful' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async (voteType: 'helpful' | 'unhelpful') => {
    if (isVoting) return;
    
    try {
      setIsVoting(true);
      
      // If already voted the same way, remove vote
      const newVote = userVote === voteType ? null : voteType;
      
      await apiRequest("POST", `/api/supplement-reviews/${review.id}/vote`, {
        isHelpful: newVote === 'helpful',
      });
      
      setUserVote(newVote);
      if (onVoteUpdated) onVoteUpdated();
      
      if (newVote) {
        toast({
          description: `You marked this review as ${newVote}`,
        });
      }
    } catch (error) {
      console.error("Error voting on review:", error);
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  // Generate display name from user data
  const displayName = review.user.username || 
    (review.user.firstName && review.user.lastName
      ? `${review.user.firstName} ${review.user.lastName}`
      : review.user.firstName || 
      (review.user.email ? review.user.email.split('@')[0] : `User ${review.userId}`));
  
  const createdDate = new Date(review.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.user.profileImageUrl} />
            <AvatarFallback>
              <User className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="font-medium">{displayName}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {timeAgo}
              {review.isVerifiedPurchase && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Verified Purchase
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              className={`h-4 w-4 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm whitespace-pre-line">{review.content}</p>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div>Was this review helpful?</div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 p-1 h-auto ${userVote === 'helpful' ? 'text-green-600' : ''}`}
            onClick={() => handleVote('helpful')}
            disabled={isVoting}
          >
            <ThumbsUp className={`h-4 w-4 ${userVote === 'helpful' ? 'fill-green-600' : ''}`} />
            <span>{review.helpfulVotes + (userVote === 'helpful' ? 1 : 0)}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 p-1 h-auto ${userVote === 'unhelpful' ? 'text-rose-600' : ''}`}
            onClick={() => handleVote('unhelpful')}
            disabled={isVoting}
          >
            <ThumbsDown className={`h-4 w-4 ${userVote === 'unhelpful' ? 'fill-rose-600' : ''}`} />
            <span>{review.unhelpfulVotes + (userVote === 'unhelpful' ? 1 : 0)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}