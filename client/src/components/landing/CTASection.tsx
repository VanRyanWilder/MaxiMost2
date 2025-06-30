import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"; // For associating with checkbox

interface CTASectionProps {
  headline: string;
  description: string;
  buttonText: string;
  emailPlaceholder?: string;
  rewardsText?: string;
  showRewardsOptIn?: boolean;
  onSubmit: (formData: { email: string; rewardsOptIn: boolean }) => void;
  className?: string;
  isLoading?: boolean; // To show loading state on button
}

export const CTASection: React.FC<CTASectionProps> = ({
  headline,
  description,
  buttonText,
  emailPlaceholder = "Enter your email address",
  rewardsText = "Join our rewards program & refer friends for premium rewards!",
  showRewardsOptIn = true,
  onSubmit,
  className,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [rewardsOptIn, setRewardsOptIn] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email) { // Basic validation: ensure email is not empty
      onSubmit({ email, rewardsOptIn });
    } else {
      // Optionally, provide feedback if email is empty, e.g., using a toast
      console.warn("Email field is empty.");
    }
  };

  return (
    <section className={`py-12 px-4 bg-muted/40 dark:bg-background/40 rounded-lg shadow ${className}`}>
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
          {headline}
        </h2>
        <p className="mb-8 text-lg text-slate-100"> {/* Changed from text-muted-foreground */}
          {description}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Input
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow text-lg p-3 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 border-slate-600 focus:ring-primary focus:border-primary"
            required // HTML5 validation
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="lg" // Made button larger
            className="text-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </form>
        {showRewardsOptIn && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            <Checkbox
              id="rewards-opt-in"
              checked={rewardsOptIn}
              onCheckedChange={(checked) => setRewardsOptIn(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="rewards-opt-in" className="text-sm text-muted-foreground">
              {rewardsText}
            </Label>
          </div>
        )}
      </div>
    </section>
  );
};
