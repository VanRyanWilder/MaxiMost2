import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle, Clock, Users, Award, Brain, Heart, Activity, BookOpen, Dumbbell, Flame, Zap, Moon, Sunrise } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-6 flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
            BeastMode
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => setLocation("/login")}>
              Log in
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
              onClick={() => setLocation("/signup")}
            >
              Sign up
            </Button>
          </div>
        </header>
        
        <main className="mt-16 sm:mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Transform your life with</span>
                <span className="block bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                  BeastMode
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                A holistic development platform integrating Mind, Body, and Spirit to help you reach your full potential through structured programs and expert guidance.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    onClick={() => setLocation("/signup")}
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setLocation("/programs")}
                  >
                    Explore Programs
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
              <div className="bg-gray-800/50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm border border-slate-700/50">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-900/70 to-indigo-800/50 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-indigo-800 hover:to-indigo-900 transition-all duration-300 border border-indigo-700/30 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3">
                          <Brain className="h-5 w-5 text-indigo-300" />
                        </div>
                        <div className="font-semibold text-lg text-indigo-100">Mind</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 flex items-center justify-center">
                          <div className="flex space-x-2">
                            <BookOpen className="h-5 w-5 text-indigo-300/80" />
                            <Brain className="h-5 w-5 text-indigo-300/80" />
                            <Zap className="h-5 w-5 text-indigo-300/80" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-indigo-100/80 mt-2">Mental training, knowledge building & cognitive enhancement</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-900/70 to-rose-800/50 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-rose-800 hover:to-rose-900 transition-all duration-300 border border-rose-700/30 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-rose-500/30 flex items-center justify-center mr-3">
                          <Activity className="h-5 w-5 text-rose-300" />
                        </div>
                        <div className="font-semibold text-lg text-rose-100">Body</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-rose-500/20 to-rose-600/10 flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Dumbbell className="h-5 w-5 text-rose-300/80" />
                            <Flame className="h-5 w-5 text-rose-300/80" />
                            <Activity className="h-5 w-5 text-rose-300/80" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-rose-100/80 mt-2">Physical training, nutrition & optimal supplementation</p>
                    </div>
                    <div className="col-span-2 bg-gradient-to-br from-emerald-900/70 to-emerald-800/50 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-emerald-800 hover:to-emerald-900 transition-all duration-300 border border-emerald-700/30 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center mr-3">
                          <Heart className="h-5 w-5 text-emerald-300" />
                        </div>
                        <div className="font-semibold text-lg text-emerald-100">Spirit</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                          <div className="flex space-x-4">
                            <Moon className="h-5 w-5 text-emerald-300/80" />
                            <Heart className="h-5 w-5 text-emerald-300/80" />
                            <Sunrise className="h-5 w-5 text-emerald-300/80" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-emerald-100/80 mt-2">Emotional wellbeing, meditation, stoic principles & purpose discovery</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-8 bg-gradient-to-r from-gray-800/80 to-gray-900/80 sm:p-10 sm:pt-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-gray-300">Join thousands who've transformed their lives with BeastMode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Three main areas in detail */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-12">The Three Pillars of Transformation</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Mind Section */}
              <div className="bg-indigo-900/20 rounded-xl p-6 backdrop-blur-sm border border-indigo-800/40 hover:border-indigo-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-indigo-100 mb-3">Mind</h3>
                <p className="text-gray-300 mb-4">Develop mental clarity, focus, and cognitive abilities through structured practices and learning.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span className="text-gray-300">Daily mental exercises</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span className="text-gray-300">Knowledge acquisition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-indigo-400" />
                    <span className="text-gray-300">Cognitive enhancement</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-indigo-400 pl-0 hover:text-indigo-300"
                    onClick={() => setLocation("/mind-spirit")}
                  >
                    Explore mental training →
                  </Button>
                </div>
              </div>
              
              {/* Body Section */}
              <div className="bg-rose-900/20 rounded-xl p-6 backdrop-blur-sm border border-rose-800/40 hover:border-rose-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-rose-100 mb-3">Body</h3>
                <p className="text-gray-300 mb-4">Transform your physical health through expert workout programs, nutrition guidance and supplementation.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-gray-300">Structured workouts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-gray-300">Nutrition optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-rose-400" />
                    <span className="text-gray-300">Evidence-based supplements</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-rose-400 pl-0 hover:text-rose-300"
                    onClick={() => setLocation("/workouts")}
                  >
                    Explore physical training →
                  </Button>
                </div>
              </div>
              
              {/* Spirit Section */}
              <div className="bg-emerald-900/20 rounded-xl p-6 backdrop-blur-sm border border-emerald-800/40 hover:border-emerald-700/40 transition-all group">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-100 mb-3">Spirit</h3>
                <p className="text-gray-300 mb-4">Nurture your emotional wellbeing and develop inner peace through meditation and stoic practices.</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300">Meditation practices</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300">Stoic philosophy</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300">Purpose alignment</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-emerald-400 pl-0 hover:text-emerald-300"
                    onClick={() => setLocation("/mind-spirit")}
                  >
                    Explore spiritual practices →
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-20 text-center">
            <div className="inline-block p-0.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">
              <div className="bg-gray-900 rounded-md px-8 py-6">
                <h3 className="text-2xl font-bold mb-2">Ready to transform your life?</h3>
                <p className="text-gray-300 mb-4">Join BeastMode today and start your journey towards a better you.</p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 hover:from-indigo-600 hover:via-purple-600 hover:to-rose-600"
                  onClick={() => setLocation("/signup")}
                >
                  Begin Transformation
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="mt-24 pb-12 text-center text-gray-400 text-sm">
          <p>© 2023 BeastMode. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}