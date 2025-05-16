import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplementId: number;
  userId: number;
}

export function WriteReviewDialog({ open, onOpenChange, supplementId, userId }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating for this supplement",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/supplements/${supplementId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          supplementId,
          rating,
          content,
          isVerifiedPurchase: true
        })
      });
      
      if (!response.ok) throw new Error("Failed to submit review");
      
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience!"
      });
      
      setContent("");
      setRating(5);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this supplement to help others make informed decisions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating" className="font-medium">
              Rating
            </Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                defaultValue="5"
                value={rating.toString()}
                onValueChange={(value) => setRating(Number(value))}
                className="flex space-x-1"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`rating-${value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`rating-${value}`}
                      className="cursor-pointer p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          value <= rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    </Label>
                    <span className="text-xs">{value}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review" className="font-medium">
              Your Review (Optional)
            </Label>
            <Textarea
              id="review"
              placeholder="Share your thoughts about this supplement..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
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