import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check } from "lucide-react";

export default function Pricing() {
  const [, setLocation] = useLocation();

  const tiers = [
    {
      name: "Free Trial",
      price: "$0",
      description: "Start your transformation journey with access to essential features.",
      features: [
        "Top 10 supplement recommendations",
        "Basic nutrition guidelines",
        "Free workout plans",
        "Limited tracking capabilities",
        "Community access"
      ],
      buttonText: "Start Free",
      href: "/signup",
      highlighted: false
    },
    {
      name: "BeastMode Pro",
      price: "$14.99",
      period: "per month",
      description: "Enhanced features for dedicated self-improvement enthusiasts.",
      features: [
        "Complete supplement database with reviews",
        "Detailed nutrition plans and recipes",
        "Advanced workout programs",
        "Full tracking capabilities",
        "Personalized recommendations",
        "Daily habit formation guidance",
        "Priority community support"
      ],
      buttonText: "Start 7-Day Free Trial",
      href: "/signup?plan=pro",
      highlighted: true
    },
    {
      name: "BeastMode Elite",
      price: "$29.99",
      period: "per month",
      description: "Premium experience with exclusive content and features.",
      features: [
        "Everything in BeastMode Pro",
        "1-on-1 coaching sessions",
        "Custom meal planning",
        "Personalized workout routines",
        "Blood work analysis",
        "Direct access to experts",
        "Advanced analytics dashboard",
        "Early access to new features"
      ],
      buttonText: "Start 7-Day Free Trial",
      href: "/signup?plan=elite",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <header className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            BeastMode
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>
            Back to Home
          </Button>
        </header>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="block">Choose Your </span>
            <span className="block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Transformation Path
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Select the plan that fits your goals and commitment level. All plans include our core BeastMode philosophy and guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`flex flex-col ${
                tier.highlighted 
                  ? 'border-2 border-indigo-500 bg-gray-800/50' 
                  : 'border border-gray-700 bg-gray-800/30'
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl">
                  {tier.highlighted && (
                    <div className="text-sm font-medium text-indigo-400 mb-2">MOST POPULAR</div>
                  )}
                  {tier.name}
                </CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="ml-2 text-sm text-gray-400">{tier.period}</span>
                  )}
                </div>
                <CardDescription className="mt-3 text-gray-300">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      : ''
                  }`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                  onClick={() => setLocation(tier.href)}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change plans later?</h3>
              <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-300">Yes, both our Pro and Elite plans come with a 7-day free trial. You can cancel anytime during the trial period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What's included in coaching sessions?</h3>
              <p className="text-gray-300">Elite plan coaching sessions include personalized advice, goal setting, and accountability check-ins with our certified experts.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-300">Yes, you can cancel your subscription at any time from your account settings. Access continues until the end of your billing period.</p>
            </div>
          </div>
        </div>
        
        <footer className="pb-12 text-center text-gray-400 text-sm">
          <p>© 2023 BeastMode. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}