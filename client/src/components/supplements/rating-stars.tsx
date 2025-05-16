import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingStars({ rating, size = 'md', className = '' }: RatingStarsProps) {
  const starSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };
  
  const sizeClass = starSizes[size];
  
  return (
    <div className={`flex ${className}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star} 
          className={`${sizeClass} ${star <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} 
        />
      ))}
    </div>
  );
}