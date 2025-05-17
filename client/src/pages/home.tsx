import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  CheckCircle, 
  Award, 
  Brain, 
  BookOpen, 
  AlertTriangle, 
  Pill, 
  FileText,
  TrendingUp,
  BarChart, 
  HeartPulse,
  Percent,
  Clock,
  Zap,
  LogIn
} from "lucide-react";
import { FirebaseUserComponent } from "@/components/auth/firebase-user";
import { useState, useEffect } from "react";
import { onAuthStateChange } from "@/lib/firebase";

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-6 flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 bg-clip-text text-transparent flex items-center gap-1">
            MaxiMost
            <span className="text-xs bg-purple-700 px-1 py-0.5 rounded text-white align-top mt-2">ALPHA</span>
          </div>
          <div className="space-x-4">
            {loading ? (
              <div className="h-10 w-20 animate-pulse bg-gray-800/70 rounded-md"></div>
            ) : user ? (
              <FirebaseUserComponent />
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="text-white hover:text-white border-white hover:border-white bg-gray-800/70"
                  onClick={() => setLocation("/login")}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Button>
                <Button 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:text-white"
                  onClick={() => setLocation("/signup")}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </header>
        
        <main className="mt-16 sm:mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Unlock your</span>
                <span className="block bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                  MaxiMost Potential
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Get the maximum bang for your buck. Our evidence-based system focuses on the vital few habits that deliver 80% of your results with just 20% of the effort.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="bg-indigo-900/40 text-indigo-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> High-ROI Focus
                </span>
                <span className="bg-purple-900/40 text-purple-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Scientific Principles
                </span>
                <span className="bg-rose-900/40 text-rose-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Percent className="h-3 w-3" /> Compound Gains
                </span>
              </div>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                  {user ? (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                      onClick={() => setLocation("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                      onClick={() => setLocation("/signup")}
                    >
                      Get Started
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-white hover:text-white border-white hover:border-white bg-gray-800/70"
                    onClick={() => setLocation("/dashboard")}
                  >
                    Habit Building
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
              <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-indigo-800/50">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/60 flex items-center justify-center mr-3">
                      <TrendingUp className="h-5 w-5 text-indigo-100" />
                    </div>
                    <div className="font-semibold text-xl text-white">1% Better Every Day</div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">Compound growth through small, consistent improvements:</p>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-indigo-700/50">
                    <div className="flex items-start gap-3">
                      <Percent className="h-5 w-5 text-indigo-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">The Compound Effect</div>
                        <p className="text-sm text-gray-300">1% improvement daily = 37.8x better in one year</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center -mt-2 mb-4">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                  
                  <p className="text-center text-sm font-medium text-indigo-300 mb-4">Focus only on what moves the needle</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-indigo-800/70 rounded-lg p-3 border border-indigo-700/50 flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-indigo-300" />
                      <span className="text-sm text-white">Maximum ROI</span>
                    </div>
                    <div className="bg-indigo-800/70 rounded-lg p-3 border border-indigo-700/50 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-300" />
                      <span className="text-sm text-white">Minimal Time</span>
                    </div>
                    <div className="bg-indigo-800/70 rounded-lg p-3 border border-indigo-700/50 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-300" />
                      <span className="text-sm text-white">Evidence-Based</span>
                    </div>
                    <div className="bg-indigo-800/70 rounded-lg p-3 border border-indigo-700/50 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-300" />
                      <span className="text-sm text-white">Actionable Steps</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-8 bg-gradient-to-r from-indigo-900/90 to-indigo-950 sm:p-10 sm:pt-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-white">Science-backed approach to optimal health</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Core knowledge areas for maximum performance */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-12">MaxiMost Cornerstones</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Principles Section */}
              <div className="bg-indigo-900/50 rounded-xl p-6 backdrop-blur-sm border border-indigo-800/40 hover:border-indigo-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Habit Building</h3>
                <p className="text-white/80 mb-4">Core philosophy from the world's top performers on how to build lasting habits with minimal effort for maximum results.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span className="text-white/90">Discipline = Freedom</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span className="text-white/90">The 1% Rule</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span className="text-white/90">Atomic Habits</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-indigo-400 pl-0 hover:text-indigo-300"
                    onClick={() => setLocation("/dashboard")}
                  >
                    Explore habit building →
                  </Button>
                </div>
              </div>
              
              {/* Sugar Section */}
              <div className="bg-rose-900/50 rounded-xl p-6 backdrop-blur-sm border border-rose-800/40 hover:border-rose-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sugar: The Hidden Poison</h3>
                <p className="text-white/80 mb-4">Comprehensive breakdown of how sugar affects your health and practical steps to eliminate it.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-white/90">Inflammation pathways</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-white/90">Metabolic impacts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-white/90">Sugar elimination guide</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-rose-400 pl-0 hover:text-rose-300"
                    onClick={() => setLocation("/sugar")}
                  >
                    Learn about sugar dangers →
                  </Button>
                </div>
              </div>
              
              {/* Supplements Section */}
              <div className="bg-amber-900/50 rounded-xl p-6 backdrop-blur-sm border border-amber-800/40 hover:border-amber-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Pill className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Science-Backed Supplements</h3>
                <p className="text-white/80 mb-4">Evidence-based supplement rankings showing only the most effective options with the highest return.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-white/90">Value rankings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-white/90">Verified efficacy</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-white/90">Cost-effectiveness analysis</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-amber-400 pl-0 hover:text-amber-300"
                    onClick={() => setLocation("/supplements")}
                  >
                    View supplement rankings →
                  </Button>
                </div>
              </div>
              
              {/* Research Section */}
              <div className="bg-emerald-900/20 rounded-xl p-6 backdrop-blur-sm border border-emerald-800/40 hover:border-emerald-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-100 mb-3">Health Research</h3>
                <p className="text-gray-300 mb-4">Cutting-edge scientific research from leading health experts, simplified and actionable.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300">Latest peer-reviewed studies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300">Expert breakdowns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300">Practical applications</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-emerald-400 pl-0 hover:text-emerald-300"
                    onClick={() => setLocation("/research")}
                  >
                    Explore research →
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Why it works section */}
          <div className="mt-24 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-800/30 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Why Our Approach Works</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Focus on the vital few actions that produce the majority of results. Master the art of doing less, but better.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">The 80/20 Principle</h3>
                <p className="text-gray-300">Focus on the 20% of actions that deliver 80% of results. Eliminate everything else to maximize efficiency.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Evidence-Based</h3>
                <p className="text-gray-300">Every recommendation backed by peer-reviewed research and expert consensus, not anecdotes or opinions.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                  <HeartPulse className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sustainable Change</h3>
                <p className="text-gray-300">Small, consistent improvements that compound over time rather than unsustainable massive efforts.</p>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-20 text-center">
            <div className="inline-block p-0.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">
              <div className="bg-gray-900 rounded-md px-8 py-6">
                <h3 className="text-2xl font-bold mb-2">Ready to maximize your health ROI?</h3>
                <p className="text-gray-300 mb-4">Join MaxiMost today and focus on what truly matters for your health.</p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 hover:from-indigo-600 hover:via-purple-600 hover:to-rose-600"
                  onClick={() => setLocation("/signup")}
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="mt-24 pb-12 text-center text-gray-400 text-sm">
          <p>© 2025 MaxiMost. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}