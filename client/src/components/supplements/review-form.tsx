import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(1, "Review content is required").max(1000, "Review must be less than 1000 characters"),
});

type ReviewFormProps = {
  supplementId: number;
  onReviewSubmitted: () => void;
  onCancel?: () => void;
};

export function ReviewForm({ supplementId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });
  
  const selectedRating = form.watch("rating");
  
  const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
    if (data.rating === 0) {
      form.setError("rating", { 
        type: "manual", 
        message: "Please select a rating" 
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await apiRequest("POST", "/api/supplement-reviews", {
        supplementId,
        rating: data.rating,
        content: data.content,
        isVerifiedPurchase: false, // This could be determined based on user purchase history
      });
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });
      
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="p-1"
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => field.onChange(rating)}
                    >
                      <Star 
                        className={`h-7 w-7 ${
                          (hoverRating !== 0 ? rating <= hoverRating : rating <= field.value) 
                            ? "text-amber-500 fill-amber-500" 
                            : "text-muted-foreground"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your experience with this supplement..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
}