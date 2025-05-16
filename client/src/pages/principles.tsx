import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scroll, 
  BookOpen, 
  Search, 
  Filter, 
  Quote, 
  Star, 
  ArrowRight, 
  Clock, 
  Bookmark, 
  Share2,
  Heart,
  BookMarked
} from "lucide-react";

// Sample stoic principles data - in a real app, this would come from an API
const stoicPrinciples = [
  {
    id: 1,
    title: "The Dichotomy of Control",
    author: "Epictetus",
    source: "Enchiridion",
    description: "Focus solely on what you can control - your judgments, actions, and intentions. Everything else is beyond your control and should not disturb your peace of mind.",
    quote: "Make the best use of what is in your power, and take the rest as it happens.",
    categories: ["Core Principle", "Mental Freedom", "Perspective"],
    application: "When facing uncertainty or challenges, identify what aspects you control and what you don't. Direct your energy only to what you can influence.",
    readTime: "4 min",
    featured: true
  },
  {
    id: 2,
    title: "Negative Visualization",
    author: "Seneca",
    source: "Letters from a Stoic",
    description: "Regularly contemplate the loss of what you value—health, relationships, possessions—not to induce anxiety, but to deepen gratitude and reduce attachment.",
    quote: "He who fears he shall suffer, already suffers what he fears.",
    categories: ["Practice", "Gratitude", "Detachment"],
    application: "Spend a few minutes each day imaging life without something you value. This practice reduces hedonic adaptation and increases appreciation.",
    readTime: "5 min",
    featured: true
  },
  {
    id: 3,
    title: "Amor Fati (Love of Fate)",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Embrace everything that happens as necessary and beneficial, even difficulties and setbacks. Don't merely tolerate circumstances but welcome them.",
    quote: "Love everything that happens to you. Everything was written.",
    categories: ["Core Principle", "Resilience", "Acceptance"],
    application: "When facing adversity, ask 'How can I use this as an opportunity?' rather than resisting what cannot be changed.",
    readTime: "4 min",
    featured: true
  },
  {
    id: 4,
    title: "Memento Mori (Remember Death)",
    author: "Seneca",
    source: "On the Shortness of Life",
    description: "Regular contemplation of mortality as a way to prioritize what truly matters and live with urgency and appreciation.",
    quote: "You live as if you were destined to live forever, no thought of your frailty ever enters your head.",
    categories: ["Practice", "Perspective", "Focus"],
    application: "Ask yourself: 'If I had one year to live, would I still spend my time this way?' Use this perspective to eliminate trivialities.",
    readTime: "6 min",
    featured: false
  },
  {
    id: 5,
    title: "The Inner Citadel",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Your mind is a fortress that cannot be breached without your permission. External events cannot harm your inner self unless you allow them to.",
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    categories: ["Core Principle", "Mental Freedom", "Resilience"],
    application: "When external circumstances seem overwhelming, retreat into your inner citadel through mindfulness or reflection.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 6,
    title: "Premeditatio Malorum (Premeditation of Evils)",
    author: "Seneca",
    source: "On Tranquility of Mind",
    description: "Mentally rehearsing potential difficulties to reduce their impact and develop resilience in advance.",
    quote: "He who has anticipated the coming of troubles takes away their power when they arrive.",
    categories: ["Practice", "Preparation", "Resilience"],
    application: "Before important events, spend time considering what could go wrong and how you would respond, not with anxiety but with calm preparation.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 7,
    title: "The View From Above",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Gaining perspective by imagining viewing your circumstances from a great height, revealing the smallness of your concerns in the cosmos.",
    quote: "Think of the whole universe of matter and how small your share. Think about the expanse of time and how brief your moment.",
    categories: ["Practice", "Perspective", "Humility"],
    application: "When caught in petty concerns, imagine viewing Earth from space, seeing your situation from this cosmic perspective.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 8,
    title: "Sympatheia (Connectedness)",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Recognizing the interconnectedness of all things and our place in the greater whole, fostering a sense of belonging and responsibility.",
    quote: "All things are implicated with one another, and the bond is holy.",
    categories: ["Core Principle", "Relationships", "Perspective"],
    application: "Consider how your actions affect others and how you're part of many larger systems - family, community, humanity, nature.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 9,
    title: "Self-Discipline as Freedom",
    author: "Epictetus",
    source: "Discourses",
    description: "True freedom comes from mastering your desires rather than being enslaved by them. Self-discipline creates the space for meaningful choice.",
    quote: "No man is free who is not master of himself.",
    categories: ["Core Principle", "Self-Discipline", "Freedom"],
    application: "Identify areas where impulsivity controls you. Practice deliberate restraint to build the muscle of choice.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 10,
    title: "Virtue as the Sole Good",
    author: "Zeno of Citium",
    source: "Republic",
    description: "Virtue - wisdom, courage, justice, and temperance - is the only true good. All else (health, wealth, reputation) are neither good nor bad in themselves.",
    quote: "Happiness is a good flow of life.",
    categories: ["Core Principle", "Virtue", "Values"],
    application: "When making decisions, prioritize what builds character over what merely provides pleasure or advantage.",
    readTime: "6 min",
    featured: false
  },
  {
    id: 11,
    title: "Voluntary Discomfort",
    author: "Musonius Rufus",
    source: "Lectures",
    description: "Deliberately engaging in physical discomfort (cold, hunger, simple living) to build resilience and reduce fear of hardship.",
    quote: "We should become accustomed to cold, heat, thirst, hunger, scarcity of food, hardness of bed, abstinence from pleasures, and endurance of pain.",
    categories: ["Practice", "Resilience", "Self-Discipline"],
    application: "Take cold showers, skip meals occasionally, sleep on a hard surface - building comfort with discomfort.",
    readTime: "4 min", 
    featured: false
  },
  {
    id: 12,
    title: "Hedonic Adaptation",
    author: "Seneca",
    source: "On the Happy Life",
    description: "The understanding that humans quickly adapt to pleasures and comforts, requiring ever more to maintain the same level of satisfaction.",
    quote: "It is not the man who has too little, but the man who craves more, that is poor.",
    categories: ["Core Principle", "Contentment", "Perspective"],
    application: "Notice when you take blessings for granted. Practice periodic abstinence from comforts you've adapted to.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 13,
    title: "Role Ethics",
    author: "Epictetus",
    source: "Discourses",
    description: "Understanding that we play various roles in life (parent, citizen, professional) and should fulfill each with excellence and integrity.",
    quote: "Remember that you are an actor in a drama of such sort as the author chooses.",
    categories: ["Core Principle", "Integrity", "Duty"],
    application: "List your key roles and what excellence looks like in each. Prioritize conflicts between roles based on core values.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 14,
    title: "Philosophical Journaling",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "The practice of regular reflection through writing to clarify thoughts, examine judgments, and cement philosophical principles into daily life.",
    quote: "Let no emotions of the flesh, be they of pain or of pleasure, disturb the even tenor of my mind.",
    categories: ["Practice", "Self-Awareness", "Growth"],
    application: "End each day with written reflection on where you lived according to your principles and where you fell short.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 15,
    title: "Philosophical Retreat",
    author: "Seneca",
    source: "On Tranquility of Mind",
    description: "Periodically withdrawing from daily life to examine one's values, review progress, and reconnect with philosophical principles.",
    quote: "We should take wandering outdoor walks, so that the mind might be nourished and refreshed by the open air and deep breathing.",
    categories: ["Practice", "Reflection", "Renewal"],
    application: "Schedule regular 'philosophical retreats' - even an hour of solitude to reassess your path and values.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 16,
    title: "The Present Moment",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Focusing entirely on the present moment, neither regretting the past nor anxious about the future, recognizing that now is all we truly have.",
    quote: "Every hour focus your mind attentively on the performance of the task in hand, with dignity, human sympathy, benevolence and freedom.",
    categories: ["Practice", "Focus", "Presence"],
    application: "When your mind wanders to past or future, gently bring it back to the present task with full attention.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 17,
    title: "Moral Development",
    author: "Musonius Rufus",
    source: "Lectures",
    description: "The belief that virtue is teachable and must be practiced daily, like physical exercise, to develop moral excellence.",
    quote: "For the human being, who is a rational and social animal, nothing is more natural than moral progress.",
    categories: ["Core Principle", "Growth", "Virtue"],
    application: "Identify one virtue to cultivate this month. Create specific opportunities to practice it daily.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 18,
    title: "Natural Law",
    author: "Zeno of Citium",
    source: "Republic",
    description: "The concept that there is a rational, divine order in the universe that humans can perceive and should live in accordance with.",
    quote: "Living in agreement with nature.",
    categories: ["Core Principle", "Harmony", "Wisdom"],
    application: "Observe natural cycles and relationships in nature. Consider how your lifestyle either aligns with or fights against these patterns.",
    readTime: "6 min",
    featured: false
  },
  {
    id: 19,
    title: "Rational Acceptance",
    author: "Epictetus",
    source: "Enchiridion",
    description: "Accepting reality as it is rather than as you wish it to be, which is the foundation for effective action and peace of mind.",
    quote: "Don't demand that things happen as you wish, but wish that they happen as they do happen, and you will go on well.",
    categories: ["Core Principle", "Acceptance", "Mental Freedom"],
    application: "When feeling resistance to reality, ask yourself: 'What would acceptance look like here?' Then act from that place.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 20,
    title: "The Arrow of Apollo",
    author: "Epictetus",
    source: "Discourses",
    description: "The recognition that people harm themselves not through events but through their judgments about those events.",
    quote: "It is not things that disturb people, but their judgments about things.",
    categories: ["Core Principle", "Perception", "Mental Freedom"],
    application: "Notice when you're disturbed. Identify the judgment causing the disturbance, not just the triggering event.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 21,
    title: "The Obstacle is the Way",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "The principle that obstacles and adversities are opportunities for growth and should be welcomed rather than avoided.",
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    categories: ["Core Principle", "Resilience", "Growth"],
    application: "When facing challenges, ask: 'How can this obstacle become my teacher or opportunity?' Reframe barriers as gateways.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 22,
    title: "Justice and Fairness",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "The commitment to treating others with fairness and justice regardless of their station or behavior, recognizing our common humanity.",
    quote: "Justice is the crowning glory of the virtues.",
    categories: ["Core Principle", "Justice", "Relationships"],
    application: "Notice when you treat others differently based on status or appearance. Practice equal respect for all you encounter.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 23,
    title: "The Cardinal Virtues",
    author: "Zeno of Citium",
    source: "Republic",
    description: "The four foundational virtues in Stoicism: wisdom (knowing good from bad), courage (enduring hardship), justice (fair treatment), and temperance (moderation).",
    quote: "Virtue alone is sufficient for happiness.",
    categories: ["Core Principle", "Virtue", "Values"],
    application: "Evaluate your daily choices against these four virtues. Identify which virtue needs most development in your life.",
    readTime: "6 min",
    featured: false
  },
  {
    id: 24,
    title: "The Discipline of Assent",
    author: "Epictetus",
    source: "Discourses",
    description: "The practice of questioning first impressions and withholding judgment until reason has examined them.",
    quote: "Make it your study to say to every harsh appearance, 'You are just an appearance, and not at all what you appear to be.'",
    categories: ["Practice", "Judgment", "Mental Freedom"],
    application: "When strong emotions arise, pause before accepting the impression. Ask: 'Is this really as it appears?'",
    readTime: "5 min",
    featured: false
  },
  {
    id: 25,
    title: "The Discipline of Desire",
    author: "Epictetus",
    source: "Discourses",
    description: "Training yourself to desire only what is within your control and to accept all else with equanimity.",
    quote: "Freedom is not procured by a full enjoyment of what is desired, but by controlling desire.",
    categories: ["Practice", "Self-Discipline", "Freedom"],
    application: "Review your desires daily. For each, ask: 'Is this within my control? Is it necessary for virtue?'",
    readTime: "5 min",
    featured: false
  },
  {
    id: 26,
    title: "The Discipline of Action",
    author: "Epictetus",
    source: "Discourses",
    description: "Ensuring that all actions are undertaken with full awareness of social duty and natural order.",
    quote: "For this is your duty, to act well the part that is given to you.",
    categories: ["Practice", "Duty", "Integrity"],
    application: "Before acting, ask: 'Does this action serve my role in the greater whole? Is it aligned with nature?'",
    readTime: "4 min",
    featured: false
  },
  {
    id: 27,
    title: "Simple Living",
    author: "Seneca",
    source: "On the Happy Life",
    description: "The practice of voluntary simplicity to reduce attachment to externals and focus on what truly matters.",
    quote: "It is not the man who has too little, but the man who craves more, that is poor.",
    categories: ["Practice", "Contentment", "Minimalism"],
    application: "Regularly declutter possessions. Before purchases, ask: 'Will this truly add value to my life?'",
    readTime: "4 min",
    featured: false
  },
  {
    id: 28,
    title: "The Common Good",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "The principle that humans are social beings by nature and should act for the common benefit, not merely self-interest.",
    quote: "What brings no benefit to the hive brings none to the bee.",
    categories: ["Core Principle", "Community", "Duty"],
    application: "Consider how your actions affect the community. Look for opportunities to contribute beyond personal gain.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 29,
    title: "Impermanence",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "The recognition that all things are temporary and in constant flux, including our possessions, relationships, and life itself.",
    quote: "All is ephemeral — fame and the famous as well.",
    categories: ["Core Principle", "Perspective", "Detachment"],
    application: "Regularly contemplate the transient nature of what you value. Ask: 'How would I live if I truly accepted impermanence?'",
    readTime: "4 min",
    featured: false
  },
  {
    id: 30,
    title: "Circle of Concern vs Control",
    author: "Epictetus",
    source: "Enchiridion",
    description: "Distinguishing between what we can influence and what we cannot, and focusing our energy exclusively on the former.",
    quote: "Some things are within our power, while others are not. Within our power are opinion, intention, desire, aversion; in a word, whatever is of our own doing.",
    categories: ["Practice", "Focus", "Mental Freedom"],
    application: "List your concerns. Divide them into 'within my control' and 'outside my control.' Focus solely on the former category.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 31,
    title: "Selective Avoidance",
    author: "Seneca",
    source: "On the Shortness of Life",
    description: "Being selective about activities, relationships, and media consumption that don't contribute to virtue or well-being.",
    quote: "It is not that we have a short time to live, but that we waste a lot of it.",
    categories: ["Practice", "Focus", "Minimalism"],
    application: "Audit how you spend time and energy. Eliminate low-value activities to make space for what truly matters.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 32,
    title: "Morning Preparation",
    author: "Seneca",
    source: "On Anger",
    description: "Beginning each day with mental preparation for challenges, reminding yourself of principles and setting clear intentions.",
    quote: "Every day, a person should confront themselves with the thought of 'today, I will meet with meddling, ingratitude, insolence, disloyalty, ill-will, and selfishness.'",
    categories: ["Practice", "Preparation", "Focus"],
    application: "Start each day by anticipating challenges and reminding yourself of your core principles and how you intend to respond.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 33,
    title: "Evening Reflection",
    author: "Seneca",
    source: "On Anger",
    description: "Ending each day with honest self-examination, celebrating successes and learning from shortcomings.",
    quote: "I will keep watch over myself and make a daily examination of my actions: this is what I have done wrong, this is what I have done right.",
    categories: ["Practice", "Self-Awareness", "Growth"],
    application: "Before sleep, review your day: What went well? Where did you fall short? What can you learn for tomorrow?",
    readTime: "4 min",
    featured: false
  },
  {
    id: 34,
    title: "Cosmopolitanism",
    author: "Zeno of Citium",
    source: "Republic",
    description: "The view that all humans belong to a single, global community with shared moral standards, regardless of nationality or culture.",
    quote: "All people are manifestations of the one universal spirit and should live in brotherly love.",
    categories: ["Core Principle", "Humanity", "Perspective"],
    application: "Practice expanding your circle of concern beyond family and nation to include all of humanity.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 35,
    title: "The Reserve Clause",
    author: "Epictetus",
    source: "Enchiridion",
    description: "Adding 'fate permitting' to all plans and intentions, acknowledging our limited control over outcomes.",
    quote: "I will sail, fate permitting. I will succeed in business, fate permitting.",
    categories: ["Practice", "Acceptance", "Perspective"],
    application: "Add 'fate permitting' to your plans, not out of superstition but as a reminder of reality's complexity.",
    readTime: "3 min",
    featured: false
  },
  {
    id: 36,
    title: "The Value of Adversity",
    author: "Seneca",
    source: "On Providence",
    description: "Understanding that challenges and hardships are not punishment but opportunities for growth and proving virtue.",
    quote: "Disaster is virtue's opportunity.",
    categories: ["Core Principle", "Resilience", "Growth"],
    application: "When facing difficulties, ask: 'How might this be making me stronger, wiser, or more compassionate?'",
    readTime: "5 min",
    featured: false
  },
  {
    id: 37,
    title: "Preferred Indifferents",
    author: "Zeno of Citium",
    source: "Republic",
    description: "The concept that while health, wealth, and reputation are not true goods, they are naturally preferred when they don't compromise virtue.",
    quote: "It is natural to prefer health to sickness, but virtue alone is good.",
    categories: ["Core Principle", "Values", "Perspective"],
    application: "Pursue advantages when aligned with virtue, but be ready to sacrifice them when virtue requires it.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 38,
    title: "Philanthropy",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "The active love of humanity expressed through service, forbearance, and contribution to the common good.",
    quote: "Men exist for the sake of one another. Teach them then or bear with them.",
    categories: ["Core Principle", "Service", "Humanity"],
    application: "Look for daily opportunities to serve others, not out of obligation but from recognition of our shared humanity.",
    readTime: "4 min",
    featured: false
  },
  {
    id: 39,
    title: "Natural Desires vs. Vain Desires",
    author: "Epictetus",
    source: "Discourses",
    description: "Distinguishing between natural needs (food, shelter, community) and socially-conditioned wants (luxury, fame, domination).",
    quote: "Wealth consists not in having great possessions, but in having few wants.",
    categories: ["Core Principle", "Simplicity", "Freedom"],
    application: "Examine your desires: Are they natural and necessary, or socially conditioned? Practice contentment with simple satisfaction of natural needs.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 40,
    title: "Appropriate Actions",
    author: "Cicero",
    source: "On Duties",
    description: "The concept that each situation has actions that are appropriate to it, based on natural roles and relationships.",
    quote: "For the whole glory of virtue is in activity.",
    categories: ["Practice", "Duty", "Wisdom"],
    application: "In each situation, ask not just 'What is right?' but 'What is appropriate to my role and this specific context?'",
    readTime: "5 min",
    featured: false
  }
];

// Available categories for filtering
const categories = [
  "All Categories",
  "Core Principle",
  "Practice",
  "Perspective",
  "Resilience",
  "Mental Freedom",
  "Acceptance",
  "Gratitude",
  "Focus"
];

export default function PrinciplesPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPrinciples, setSavedPrinciples] = useState<number[]>([]);
  
  const toggleSave = (id: number) => {
    setSavedPrinciples(prev => 
      prev.includes(id) ? prev.filter(principleId => principleId !== id) : [...prev, id]
    );
  };
  
  const filteredPrinciples = stoicPrinciples.filter(principle => {
    // Apply category filter
    if (activeCategory !== "All Categories" && !principle.categories.includes(activeCategory)) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        principle.title.toLowerCase().includes(query) ||
        principle.description.toLowerCase().includes(query) ||
        principle.author.toLowerCase().includes(query) ||
        principle.quote.toLowerCase().includes(query) ||
        principle.categories.some(category => category.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Featured principles at the top
  const featuredPrinciples = filteredPrinciples.filter(p => p.featured);
  const regularPrinciples = filteredPrinciples.filter(p => !p.featured);
  
  return (
    <PageContainer title="Core Stoic Principles">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Core Stoic Principles</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Ancient wisdom for modern challenges and maximum effectiveness
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search principles..."
                    className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon" title="Filter principles">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Featured Principles Section */}
          {featuredPrinciples.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Essential Principles
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {featuredPrinciples.map(principle => (
                  <PrincipleCard 
                    key={principle.id} 
                    principle={principle} 
                    isSaved={savedPrinciples.includes(principle.id)} 
                    onToggleSave={() => toggleSave(principle.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Principles Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">All Principles</h2>
            
            {regularPrinciples.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {regularPrinciples.map(principle => (
                  <PrincipleCard 
                    key={principle.id} 
                    principle={principle} 
                    isSaved={savedPrinciples.includes(principle.id)} 
                    onToggleSave={() => toggleSave(principle.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No principles found matching your criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setActiveCategory("All Categories");
                      setSearchQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Information Section */}
          <Card className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-amber-100 dark:bg-amber-900 p-4 rounded-full text-amber-600 dark:text-amber-300">
                  <Scroll className="h-10 w-10" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Why Stoicism?</h2>
                  <p className="text-muted-foreground mb-4">
                    Stoicism offers practical wisdom for thriving in an unpredictable world. These ancient principles 
                    have endured for over 2,000 years because they focus on what truly matters: developing inner 
                    resilience, maintaining perspective, and taking effective action. Stoicism doesn't just help you
                    endure life's challenges—it provides a framework for flourishing despite them.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-orange-100 dark:bg-orange-900 p-1.5 rounded-full mt-0.5">
                        <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time-Tested Wisdom</p>
                        <p className="text-xs text-muted-foreground">From ancient Rome to modern CEOs and athletes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 dark:bg-red-900 p-1.5 rounded-full mt-0.5">
                        <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Practical Application</p>
                        <p className="text-xs text-muted-foreground">Actionable exercises for daily challenges</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

// Principle Card Component
interface PrincipleCardProps {
  principle: {
    id: number;
    title: string;
    author: string;
    source: string;
    description: string;
    quote: string;
    categories: string[];
    application: string;
    readTime: string;
    featured: boolean;
  };
  isSaved: boolean;
  onToggleSave: () => void;
}

function PrincipleCard({ principle, isSaved, onToggleSave }: PrincipleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {principle.categories.map(category => (
              <Badge key={category} variant="secondary" className="font-normal">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
            <Clock className="h-4 w-4" />
            <span>{principle.readTime}</span>
          </div>
        </div>
        <CardTitle className="text-xl mb-1">{principle.title}</CardTitle>
        <CardDescription className="text-sm">
          {principle.author} • {principle.source}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 bg-secondary/20 dark:bg-secondary/10 p-4 rounded-md relative">
          <Quote className="absolute top-2 left-2 h-5 w-5 text-secondary opacity-40" />
          <p className="pl-4 pt-2 italic text-muted-foreground">
            "{principle.quote}"
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {principle.description}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Practical Application:</h4>
          <p className="text-sm text-muted-foreground">{principle.application}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Button variant="outline" className="gap-2" size="sm">
            <BookMarked className="h-4 w-4" />
            <span>Learn More</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1" 
              onClick={onToggleSave}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}