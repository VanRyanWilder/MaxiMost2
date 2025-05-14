import { useUser } from "@/context/user-context";
import { getGreeting } from "@/lib/utils";
import { TrendingUp, ArrowUpCircle, Percent } from "lucide-react";

export function WelcomeBanner() {
  const { user } = useUser();
  const compoundingQuotes = [
    "Discipline equals freedom. The harder you train, the more freedom you'll have when it matters. — Jocko Willink",
    "Compound interest is the 8th wonder of the world. He who understands it, earns it; he who doesn't, pays it. — Albert Einstein",
    "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential. — David Goggins",
    "Tiny changes, remarkable results. Small habits don't add up, they compound. — James Clear",
    "The man who moves a mountain begins by carrying away small stones. — Confucius",
    "You don't have to be great to start, but you have to start to be great. — Zig Ziglar"
  ];
  
  const randomQuote = compoundingQuotes[Math.floor(Math.random() * compoundingQuotes.length)];

  return (
    <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold">
              {getGreeting()}, {user?.name || "Maximus"}!
            </h2>
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-white text-opacity-80">MAXIMUS GAINS PHILOSOPHY</p>
            <p className="text-white text-opacity-90 max-w-lg">"{randomQuote}"</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-300" />
            <div>
              <p className="text-sm font-medium">Daily Improvement</p>
              <p className="font-bold text-lg">1% Better Today</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              <p className="text-sm font-medium">Compound Growth</p>
            </div>
            <p className="text-xs mt-1">1% daily = 37.8x yearly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
