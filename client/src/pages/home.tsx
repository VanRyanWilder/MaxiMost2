import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle, Clock, Users, Award, Brain, Heart, Activity } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
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
                <span className="block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  BeastMode
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Comprehensive development platform for mind, body, brain, and spirit with expert guidance and structured programs to help you reach your full potential.
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
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-indigo-900 hover:to-indigo-950 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                          <Brain className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="font-semibold text-lg">Mind & Spirit</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                          <span className="text-xs text-indigo-300 italic">Image: Meditation scene</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">Daily meditation, stoic practices, and mental clarity exercises</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-purple-900 hover:to-purple-950 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <Activity className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="font-semibold text-lg">Body & Health</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                          <span className="text-xs text-purple-300 italic">Image: Workout training</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">Workout programs, nutrition plans, and supplementation guidance</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-blue-900 hover:to-blue-950 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="font-semibold text-lg">Personal Growth</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                          <span className="text-xs text-blue-300 italic">Image: Achievement goals</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">Skill development, habit tracking, and productivity systems</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 h-40 flex flex-col justify-between group hover:from-emerald-900 hover:to-emerald-950 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="font-semibold text-lg">Community</div>
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md">
                        <div className="w-full h-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                          <span className="text-xs text-emerald-300 italic">Image: Community support</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">Connect with like-minded individuals on similar journeys</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-8 bg-gradient-to-r from-gray-800 to-gray-900 sm:p-10 sm:pt-6">
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
        </main>
        
        <footer className="mt-24 pb-12 text-center text-gray-400 text-sm">
          <p>© 2023 BeastMode. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}