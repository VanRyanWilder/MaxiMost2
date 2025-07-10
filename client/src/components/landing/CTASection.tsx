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
  onSubmit?: (formData: { email: string; rewardsOptIn: boolean }) => void; // Optional for link buttons
  buttonLink?: string; // For navigation
  showEmailInput?: boolean; // To control visibility of email form
  className?: string;
  isLoading?: boolean; // To show loading state on button
  buttonVariant?: 'primary' | 'secondary'; // New prop for button styling
}

import { Link, useLocation } from "wouter";


export const CTASection: React.FC<CTASectionProps> = ({
  headline,
  description,
  buttonText,
  emailPlaceholder = "Enter your email address",
  rewardsText = "Join our rewards program & refer friends for premium rewards!",
  showRewardsOptIn = true, // Default to true for existing behavior
  onSubmit,
  buttonLink,
  showEmailInput = true, // Default to true for existing behavior
  className,
  isLoading = false,
  buttonVariant = 'primary', // Added buttonVariant to destructuring with default
}) => {
  const [email, setEmail] = useState("");
  const [rewardsOptIn, setRewardsOptIn] = useState(false);
  const [, setLocation] = useLocation();


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit && email) {
      onSubmit({ email, rewardsOptIn });
    } else if (onSubmit) {
      console.warn("Email field is empty but onSubmit was called.");
    }
  };

  const handleButtonClick = () => {
    if (buttonLink === "/login") { // Test for FIX-18
      console.log("FIX-18 Test: Navigating to /login via window.location.href");
      window.location.href = "/login"; // Standard HTML navigation
    } else if (buttonLink) {
      console.log(`FIX-18 Test: Navigating to ${buttonLink} via wouter setLocation`);
      setLocation(buttonLink); // wouter programmatic navigation for other links
    }
    // If it's a form button, the form's onSubmit will handle it.
  };

  return (
    <section className={`py-12 px-4 bg-muted/40 dark:bg-background/40 rounded-lg shadow ${className}`}>
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
          {headline}
        </h2>
        <p className="mb-8 text-lg text-slate-100">
          {description}
        </p>
        {showEmailInput ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Input
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow text-lg p-3 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 border-slate-600 focus:ring-primary focus:border-primary"
              required
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="lg"
              className={`text-lg transition-all duration-200 ease-in-out
                ${buttonVariant === 'secondary'
                  ? 'bg-slate-200 text-blue-800 hover:bg-slate-100 hover:shadow-[0_0_15px_2px_rgba(59,130,246,0.3)] hover:text-blue-900 hover:scale-105' // Darker blue text, lighter bg on hover, blue glow shadow
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 animate-pulse-glow'
                }`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : buttonText}
            </Button>
          </form>
        ) : (
          <Button
            size="lg"
            className={`text-lg transition-all duration-200 ease-in-out
              ${buttonVariant === 'secondary'
                ? 'bg-slate-200 text-blue-800 hover:bg-slate-100 hover:shadow-[0_0_15px_2px_rgba(59,130,246,0.3)] hover:text-blue-900 hover:scale-105' // Darker blue text, lighter bg on hover, blue glow shadow
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 animate-pulse-glow'
              }`}
            disabled={isLoading}
            onClick={handleButtonClick}
          >
            {isLoading ? "Processing..." : buttonText}
          </Button>
        )}
        {showEmailInput && showRewardsOptIn && rewardsText && (
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
