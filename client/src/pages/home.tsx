import { Button } from "@/components/ui/button";
import { useNavigate } from "wouter";

export default function Home() {
  const [, navigate] = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            BeastMode
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
              onClick={() => navigate("/signup")}
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
                    onClick={() => navigate("/signup")}
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate("/programs")}
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
                    <div className="bg-gray-700 rounded-lg p-4 h-36 flex flex-col justify-between">
                      <div className="font-semibold text-lg">Mind & Spirit</div>
                      <p className="text-sm text-gray-300">Daily meditation, stoic practices, and mental clarity exercises</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 h-36 flex flex-col justify-between">
                      <div className="font-semibold text-lg">Body & Health</div>
                      <p className="text-sm text-gray-300">Workout programs, nutrition plans, and supplementation guidance</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 h-36 flex flex-col justify-between">
                      <div className="font-semibold text-lg">Personal Growth</div>
                      <p className="text-sm text-gray-300">Skill development, habit tracking, and productivity systems</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 h-36 flex flex-col justify-between">
                      <div className="font-semibold text-lg">Community</div>
                      <p className="text-sm text-gray-300">Connect with like-minded individuals on similar journeys</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-2 pb-8 bg-gray-700 sm:p-10 sm:pt-6">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-300 text-center">
                      Join thousands of others who have transformed their lives with BeastMode
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