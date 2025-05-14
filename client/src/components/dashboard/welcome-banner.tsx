import { useUser } from "@/context/user-context";
import { getGreeting } from "@/lib/utils";

export function WelcomeBanner() {
  const { user } = useUser();
  const quotes = [
    "Discipline equals freedom. The harder you train, the more freedom you'll have when it matters. — Jocko Willink",
    "The only easy day was yesterday. — Navy SEALs",
    "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential. — David Goggins",
    "The mind always quits before the body. — David Goggins",
    "Success isn't owned. It's leased, and rent is due every day. — J.J. Watt",
    "You have power over your mind - not outside events. Realize this, and you will find strength. — Marcus Aurelius"
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="bg-gradient-to-r from-primary to-progress rounded-xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {getGreeting()}, {user?.name || "Warrior"}!
          </h2>
          <p className="text-white text-opacity-90 max-w-lg">"{randomQuote}"</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Today's Focus</p>
            <p className="font-bold text-lg">Mental Toughness</p>
          </div>
        </div>
      </div>
    </div>
  );
}
