import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check, Apple, Smartphone, Award, Zap, BarChart3, BookOpen, Badge, Gift } from "lucide-react";

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
        "Limited tracking capabilities (5 habits)",
        "Basic web app access",
        "Community access"
      ],
      buttonText: "Start Free",
      href: "/signup",
      highlighted: false
    },
    {
      name: "Maximus Pro",
      price: "$9.99",
      period: "per month",
      description: "Enhanced features for dedicated self-improvement enthusiasts.",
      features: [
        "Complete supplement database with reviews",
        "Detailed nutrition plans and recipes",
        "Advanced workout programs", 
        "Unlimited habit tracking",
        "Full mobile app access (iOS & Android)",
        "Ad-free experience",
        "Daily stoic principles & motivation",
        "Personalized recommendations",
        "Priority community support"
      ],
      buttonText: "Start 7-Day Free Trial",
      href: "/signup?plan=pro",
      highlighted: true
    },
    {
      name: "Maximus Elite",
      price: "$24.99",
      period: "per month",
      description: "Premium experience with exclusive content and features.",
      features: [
        "Everything in Maximus Pro",
        "1-on-1 coaching sessions",
        "Custom meal planning",
        "Personalized workout routines",
        "Blood work analysis",
        "Direct access to experts",
        "Advanced analytics dashboard",
        "Early access to new features",
        "Google Calendar integration",
        "Apple Health & Google Fit sync"
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
            Maximus Gains
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
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Select the plan that best fits your goals and commitment level. All plans include our core Maximus Gains philosophy of "1% better every day" and structured habit guidance.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border-indigo-500/30">
              No Magic Pills
            </Badge>
            <Badge className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border-indigo-500/30">
              Maximum ROI on Effort
            </Badge>
            <Badge className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border-indigo-500/30">
              Something Over Nothing
            </Badge>
          </div>
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
        
        {/* Mobile App Section */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-3xl font-bold mb-4">Get Maximus Gains on Mobile</h2>
              <p className="text-xl text-gray-300 mb-6">Take your habit tracking and wellness journey on the go with our powerful mobile apps for iOS and Android.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <Badge className="mr-3 bg-indigo-600 p-1.5 rounded-md text-white">
                    <Zap className="h-5 w-5" />
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-lg">Offline Tracking</h3>
                    <p className="text-gray-300">Log habits and view principles even without internet connection</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-indigo-600 p-1.5 rounded-md text-white">
                    <BarChart3 className="h-5 w-5" />
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-lg">Detailed Analytics</h3>
                    <p className="text-gray-300">Visualize your progress with powerful charts and insights</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-indigo-600 p-1.5 rounded-md text-white">
                    <BookOpen className="h-5 w-5" />
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-lg">Daily Principles</h3>
                    <p className="text-gray-300">Access all 365 stoic principles for daily motivation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 bg-indigo-600 p-1.5 rounded-md text-white">
                    <Gift className="h-5 w-5" />
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-lg">Exclusive Content</h3>
                    <p className="text-gray-300">Mobile-only features and premium content</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button className="bg-black text-white hover:bg-gray-900 flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  App Store
                </Button>
                <Button className="bg-green-700 text-white hover:bg-green-800 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Google Play
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 bg-black rounded-xl p-5 shadow-2xl shadow-purple-900/20 border border-purple-900/30">
              <div className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-xl text-center font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Mobile App Preview
                  <div className="text-sm mt-2 font-normal">Coming Soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Revenue Streams Section */}
        <div className="bg-gray-800/30 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Additional Ways to Maximize Your Results</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 border-amber-900/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Supplement Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Shop our curated selection of top-rated supplements with exclusive discounts for members. Thoroughly vetted and recommended by our experts.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-900/20">
                  Browse Marketplace
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 border-blue-900/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Expert E-Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Deep dive into specific wellness topics with our premium e-books written by industry leaders and scientific researchers.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-900/20">
                  View Library
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-900/20 to-green-700/10 border-green-900/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  Personal Coaching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>One-on-one coaching sessions with our certified fitness and nutrition experts. Custom programs tailored to your specific needs and goals.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-900/20">
                  Book Session
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
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
            <div>
              <h3 className="font-semibold text-lg mb-2">Will my data sync between devices?</h3>
              <p className="text-gray-300">Yes, with a paid subscription your habits, progress, and preferences will sync seamlessly between web and mobile apps.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Do you offer affiliate commissions?</h3>
              <p className="text-gray-300">Yes, we offer a 15% commission on referred subscription sign-ups and 10% on supplement marketplace purchases through our affiliate program.</p>
            </div>
          </div>
        </div>
        
        <footer className="pb-12 text-center text-gray-400">
          <div className="flex justify-center items-center gap-8 mb-6">
            <Button variant="link" className="text-gray-400 hover:text-white">Terms of Service</Button>
            <Button variant="link" className="text-gray-400 hover:text-white">Privacy Policy</Button>
            <Button variant="link" className="text-gray-400 hover:text-white">Affiliate Program</Button>
            <Button variant="link" className="text-gray-400 hover:text-white">Contact Us</Button>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Maximus Gains. All rights reserved.</p>
          <p className="text-xs mt-2 max-w-2xl mx-auto">
            The information provided is for educational purposes only. 
            Always consult with a healthcare professional before starting any new supplement regimen,
            exercise program, or drastic dietary change.
          </p>
        </footer>
      </div>
    </div>
  );
}