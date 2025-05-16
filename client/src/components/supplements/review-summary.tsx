import { Star } from "lucide-react";
import { RatingStars } from "./rating-stars";

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
  ratingDistribution?: number[];
}

export function ReviewSummary({ rating, reviewCount, ratingDistribution = [0, 0, 0, 0, 0] }: ReviewSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
        <div>
          <RatingStars rating={rating} className="mb-1" />
          <span className="text-sm text-muted-foreground">
            Based on {reviewCount} reviews
          </span>
        </div>
      </div>
      
      {reviewCount > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Rating Distribution</h3>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((starRating, index) => {
              const count = ratingDistribution[5 - starRating];
              const percentage = reviewCount ? Math.round((count / reviewCount) * 100) : 0;
              
              return (
                <div key={starRating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-14">
                    <span>{starRating}</span>
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
    </div>
  );
}