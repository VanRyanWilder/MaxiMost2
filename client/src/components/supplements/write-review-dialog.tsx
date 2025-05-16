import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { StarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplementId: number;
  userId: number;
  supplementName: string;
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  supplementId,
  userId,
  supplementName,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must provide a star rating to submit a review.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Please add a review",
        description: "Please share your experience with this supplement.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/supplements/reviews", {
        supplementId,
        userId,
        rating,
        content,
        isVerifiedPurchase: false // Default to false, could be updated with real purchase verification
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      
      // Success
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });
      
      // Reset form and close dialog
      setRating(0);
      setContent("");
      onOpenChange(false);
      
      // Invalidate related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/supplements', supplementId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/supplements'] });
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your experience with {supplementName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Star rating selector */}
          <div className="flex flex-col items-center mb-6">
            <p className="text-sm text-gray-500 mb-2">Overall rating</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium mt-2">
              {rating === 1 && "Poor - Not recommended"}
              {rating === 2 && "Fair - Has issues"}
              {rating === 3 && "Average - Met expectations"}
              {rating === 4 && "Good - Recommended"}
              {rating === 5 && "Excellent - Highly recommended"}
            </p>
          </div>
          
          {/* Review text area */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Your review</p>
            <Textarea
              placeholder="What did you like or dislike? How effective was it?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}