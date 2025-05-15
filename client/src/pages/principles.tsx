import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Quote, 
  Star, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  Compass,
  Sword,
  Shield,
  Brain,
  Heart,
  Flame,
  Clock
} from "lucide-react";

// Types for principles
interface Principle {
  id: string;
  title: string;
  quote: string;
  explanation: string;
  source: string;
  author: "jocko" | "goggins" | "marcus" | "seneca" | "epictetus" | "cato" | "other";
  category: "discipline" | "resilience" | "perspective" | "courage" | "self-mastery" | "leadership" | "virtue";
  dateAdded: string;
  day?: number; // For daily principles
}

export default function PrinciplesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  
  // Sample principles data
  const principles: Principle[] = [
    {
      id: "discipline-equals-freedom",
      title: "Discipline Equals Freedom",
      quote: "Discipline equals freedom.",
      explanation: "This principle emphasizes that by imposing discipline on yourself, you actually create freedom. By waking up early, maintaining fitness, and developing good habits, you free yourself from the constraints of poor health, lack of time, and reduced capabilities. The more disciplined your mind and body are, the more freedom you have to achieve your goals and live life on your own terms.",
      source: "Discipline Equals Freedom: Field Manual",
      author: "jocko",
      category: "discipline",
      dateAdded: "2023-01-15",
      day: 1
    },
    {
      id: "extreme-ownership",
      title: "Extreme Ownership",
      quote: "There are no bad teams, only bad leaders.",
      explanation: "Extreme Ownership means taking complete responsibility for everything in your world. If a project fails, a relationship deteriorates, or goals aren't met, the principle demands you look inward first. Instead of blaming circumstances or others, ask: 'What could I have done differently?' This mindset eliminates excuses and empowers you to control outcomes by focusing on what you can change — yourself and your actions.",
      source: "Extreme Ownership",
      author: "jocko",
      category: "leadership",
      dateAdded: "2023-01-22",
      day: 8
    },
    {
      id: "good-cookie-jar",
      title: "The Cookie Jar Method",
      quote: "The Cookie Jar became a concept that I've used numerous times in my life. When I need a boost, I open it up mentally and draw strength from it.",
      explanation: "The Cookie Jar is a mental reservoir of past accomplishments and obstacles overcome. During moments of doubt or pain, you can mentally reach into this jar to draw strength from previous victories. By remembering how you've overcome challenges in the past, you gain confidence in your ability to push through current difficulties. This mental tool converts past hardships into future strength.",
      source: "Can't Hurt Me",
      author: "goggins",
      category: "resilience",
      dateAdded: "2023-02-05",
      day: 22
    },
    {
      id: "40-percent-rule",
      title: "The 40% Rule",
      quote: "When your mind is telling you you're done, you're really only 40 percent done.",
      explanation: "The 40% Rule states that when you think you've reached your limit, you've actually only reached about 40% of your capacity. This principle challenges the idea of perceived limitations and suggests that the mind gives up long before the body actually needs to. By pushing beyond the initial signals of fatigue or discomfort, you can access untapped reserves of performance and endurance.",
      source: "Living with a SEAL",
      author: "goggins",
      category: "self-mastery",
      dateAdded: "2023-02-12",
      day: 29
    },
    {
      id: "dichotomy-of-control",
      title: "The Dichotomy of Control",
      quote: "Make the best use of what is in your power, and take the rest as it happens.",
      explanation: "The Dichotomy of Control teaches us to focus our energy only on what we can control - our thoughts, judgments, and actions - while accepting what we cannot control with equanimity. This principle eliminates wasted emotional energy on external events beyond our influence. By concentrating solely on our response to events rather than the events themselves, we gain mental clarity, reduce anxiety, and make better decisions.",
      source: "Enchiridion",
      author: "epictetus",
      category: "perspective",
      dateAdded: "2023-03-01",
      day: 46
    },
    {
      id: "memento-mori",
      title: "Memento Mori",
      quote: "You could leave life right now. Let that determine what you do and say and think.",
      explanation: "Memento Mori ('Remember that you will die') reminds us of our mortality to emphasize the urgency of living well today. This principle isn't morbid but clarifying - it strips away trivialities and focuses attention on what truly matters. By contemplating death regularly, you gain perspective on your priorities, reduce procrastination, and make more meaningful choices about how to spend your limited time.",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-03-15",
      day: 60
    },
    {
      id: "obstacle-is-the-way",
      title: "The Obstacle Is The Way",
      quote: "The impediment to action advances action. What stands in the way becomes the way.",
      explanation: "This principle teaches that obstacles aren't just challenges to overcome but often the path itself. When facing difficulties, look for how they can become advantages or opportunities. By reframing obstacles as teachers rather than barriers, you can extract value from every challenge. The very thing blocking your path often contains the solution to moving forward in a better way than originally planned.",
      source: "Meditations",
      author: "marcus",
      category: "resilience",
      dateAdded: "2023-03-22",
      day: 67
    },
    {
      id: "premeditatio-malorum",
      title: "Premeditatio Malorum",
      quote: "Nothing happens to the wise man against his expectation.",
      explanation: "Premeditatio malorum (premeditation of evils) involves visualizing potential challenges or setbacks before they happen. By mentally rehearsing difficulties, you reduce their emotional impact when they actually occur. This isn't negative thinking but pragmatic preparation. By habitually considering potential obstacles, you develop resilience, prepare contingency plans, and remain unshaken when facing adversity.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "resilience",
      dateAdded: "2023-03-29",
      day: 74
    },
    {
      id: "amor-fati",
      title: "Amor Fati",
      quote: "Love of fate. Not just bearing what is necessary, but loving it.",
      explanation: "Amor fati means 'love of fate.' The principle invites us to not merely accept what happens to us but to embrace it wholeheartedly. It transforms 'this is happening to me' into 'this is happening for me.' By looking for the opportunity in every difficulty and the lesson in every setback, you transcend mere resilience to find genuine appreciation for life's full spectrum of experiences.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "perspective",
      dateAdded: "2023-04-05",
      day: 81
    },
    {
      id: "summum-bonum",
      title: "Summum Bonum",
      quote: "Virtue is the only good. All else is indifferent.",
      explanation: "Summum bonum (highest good) reminds us that virtue—practical wisdom, courage, justice, and temperance—is the only true good worth pursuing. External outcomes, possessions, health, and even life itself are 'preferred indifferents.' By focusing on developing virtue rather than pursuing outcomes, you gain independence from external circumstances. This principle provides clarity in decision-making and emotional stability regardless of life's ups and downs.",
      source: "Discourses",
      author: "epictetus",
      category: "virtue",
      dateAdded: "2023-04-12",
      day: 88
    },
    {
      id: "ego-is-the-enemy",
      title: "Ego Is The Enemy",
      quote: "Do not indulge in dreams of having what you have not, but reckon up the chief of the blessings you do possess, and then thankfully remember how you would crave for them if they were not yours.",
      explanation: "Ego blinds us to our flaws, prevents learning, and makes us defensive. This principle teaches the value of humility and objectivity in self-assessment. By separating your sense of self-worth from external markers of success, you can remain teachable and grounded. Maintaining clear perception of reality requires continually stripping away the distortions of ego and embracing honest self-evaluation.",
      source: "Meditations",
      author: "marcus",
      category: "self-mastery",
      dateAdded: "2023-04-19",
      day: 95
    },
    {
      id: "practice-misfortune",
      title: "Practice Misfortune",
      quote: "Set aside a certain number of days, during which you shall be content with the scantiest and cheapest fare, with coarse and rough dress, saying to yourself the while: 'Is this the condition that I feared?'",
      explanation: "This principle advocates for deliberately practicing discomfort and simplicity. By temporarily living with less than you need, you develop resilience against potential hardships and overcome the fear of losing comforts. This practice builds confidence in your ability to handle adversity and reduces anxiety about potential loss. It also develops gratitude for daily provisions often taken for granted.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "resilience",
      dateAdded: "2023-04-26",
      day: 102
    },
    {
      id: "morning-routine",
      title: "Win The Morning",
      quote: "Discipline starts with waking up early. If you can't discipline yourself to get out of bed then how will you ever discipline yourself to be truly exceptional?",
      explanation: "How you start your day sets the tone for everything that follows. This principle highlights the compounding power of consistent morning habits. By taking control of your first waking hours—through exercise, reflection, and purposeful work—you create momentum that carries throughout the day. The morning routine is your daily opportunity to demonstrate agency and commitment to your goals.",
      source: "Discipline Equals Freedom: Field Manual",
      author: "jocko",
      category: "discipline",
      dateAdded: "2023-05-03",
      day: 109
    },
    {
      id: "growth-mindset",
      title: "The Growth Mindset",
      quote: "Don't let the negativity of others who are unable or unwilling to do something themselves affect your own growth and potential.",
      explanation: "The Growth Mindset principle emphasizes that abilities are developed through dedication and hard work, not fixed traits. By embracing challenges as opportunities for improvement rather than threats to your self-image, you develop resilience and a love of learning. This mindset shifts focus from proving yourself to improving yourself, allowing you to face setbacks with curiosity rather than defensiveness.",
      source: "Can't Hurt Me",
      author: "goggins",
      category: "self-mastery",
      dateAdded: "2023-05-10",
      day: 116
    },
    {
      id: "kaizen",
      title: "Kaizen: 1% Better Every Day",
      quote: "You don't want to judge your improvement against anyone but your previous self. If you are 1% better than yesterday, then today is a success.",
      explanation: "This principle focuses on making small, incremental improvements consistently rather than seeking dramatic changes. By improving just 1% each day, you create powerful compound growth over time. This approach makes progress sustainable and achievable while reducing resistance to change. The focus on continuous small steps removes the pressure of perfectionism and makes the journey of improvement itself the reward.",
      source: "Atomic Habits",
      author: "other",
      category: "discipline",
      dateAdded: "2023-05-17",
      day: 123
    },
    {
      id: "do-difficult-things",
      title: "Do Difficult Things",
      quote: "Seek out discomfort. The most important skill in life is being comfortable being uncomfortable.",
      explanation: "This principle urges you to deliberately seek challenges rather than avoiding them. By regularly engaging with difficult activities, you expand your comfort zone and build resilience against future adversity. The practice trains both mind and body to handle stress productively rather than shutting down. Each challenge overcome builds confidence for tackling even greater obstacles.",
      source: "Never Finished",
      author: "goggins",
      category: "courage",
      dateAdded: "2023-05-24",
      day: 130
    },
    {
      id: "negative-visualization",
      title: "Negative Visualization",
      quote: "Begin each day by telling yourself: Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness.",
      explanation: "Negative visualization involves mentally rehearsing potential hardships or losses. By imagining the worst-case scenarios, you develop gratitude for what you currently have and reduce the sting when facing actual setbacks. This practice also helps prepare contingency plans, reducing anxiety about the future. Regular practice builds emotional resilience and perspective during challenging times.",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-05-31",
      day: 137
    },
    {
      id: "something-over-nothing",
      title: "Something Over Nothing",
      quote: "A small, consistent effort is infinitely better than grand plans that never materialize. Imperfect action beats perfect inaction every time.",
      explanation: "This principle emphasizes that taking any productive action, however small, creates momentum and progress. Perfectionism often leads to paralysis, while embracing small imperfect steps leads to real results. The compounding effect of consistent 'somethings' ultimately outperforms the theoretical potential of delayed 'perfect' actions that remain undone.",
      source: "Discipline Equals Freedom: Field Manual",
      author: "jocko",
      category: "discipline",
      dateAdded: "2023-06-07",
      day: 144
    },
    {
      id: "view-from-above",
      title: "The View From Above",
      quote: "How beautifully Plato puts it. Whenever you want to talk about people, it's best to take a bird's-eye view and see everything all at once.",
      explanation: "The View From Above asks you to mentally zoom out and observe your situation from an increasingly wider perspective—from personal, to community, to global, to cosmic. This practice diminishes the apparent magnitude of your problems and provides clarity about their true significance. By expanding your perspective, you gain objectivity about your challenges and freedom from being consumed by them.",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-06-14",
      day: 151
    },
    {
      id: "keep-it-simple",
      title: "Keep It Simple",
      quote: "Simplicity is the ultimate sophistication. The path to success is not through complexity but through the relentless elimination of the unnecessary.",
      explanation: "This principle advocates for removing unnecessary complexity in all areas of life. By focusing only on what truly matters and eliminating distractions, you conserve energy and increase effectiveness. The discipline of simplicity forces clarity of thought and purpose. In fitness, nutrition, habits, or productivity—the simplest sustainable approach is often the most effective long-term strategy.",
      source: "Can't Hurt Me",
      author: "goggins",
      category: "self-mastery",
      dateAdded: "2023-06-21",
      day: 158
    },
    {
      id: "gratitude-practice",
      title: "Daily Gratitude Practice",
      quote: "Do not spoil what you have by desiring what you have not; remember that what you now have was once among the things you only hoped for.",
      explanation: "The Daily Gratitude Practice involves regularly acknowledging and appreciating what you already have. By focusing on existing blessings rather than perceived lacks, you shift from scarcity to abundance mindset. This practice reduces hedonic adaptation (taking things for granted) and increases present-moment satisfaction. Regular gratitude practice has been shown to improve mental health, sleep quality, and relationship satisfaction.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "perspective",
      dateAdded: "2023-06-28",
      day: 165
    },
    {
      id: "delayed-gratification",
      title: "Delayed Gratification",
      quote: "Easy choices, hard life. Hard choices, easy life.",
      explanation: "This principle emphasizes choosing short-term discomfort for long-term benefit over immediate pleasure that leads to future pain. By developing the ability to delay gratification, you build self-discipline and make decisions aligned with your long-term goals rather than momentary desires. This mental muscle enables you to consistently make choices that compound positively over time rather than deteriorating your future position.",
      source: "Extreme Ownership",
      author: "jocko",
      category: "self-mastery",
      dateAdded: "2023-07-05",
      day: 172
    },
    {
      id: "take-the-cold-shower",
      title: "Take The Cold Shower",
      quote: "Comfort makes you weak. Choose discomfort deliberately and grow stronger, mentally and physically.",
      explanation: "The Cold Shower principle uses literal or metaphorical cold exposure as training for the mind. By deliberately choosing discomfort in controlled settings, you strengthen your ability to endure necessary discomfort in pursuit of important goals. This practice builds mental toughness through repeated small acts of willpower, preparing you for bigger challenges. Each voluntary discomfort you embrace makes you more resilient against involuntary hardships.",
      source: "Discipline Equals Freedom: Field Manual",
      author: "jocko",
      category: "discipline",
      dateAdded: "2023-07-12",
      day: 179
    },
    {
      id: "role-ethics",
      title: "Role Ethics",
      quote: "Consider who you are. Not simply your name, but all the roles you play: citizen, parent, friend, leader, student.",
      explanation: "Role Ethics acknowledges that we occupy multiple roles in life—family member, professional, citizen, friend—each with specific duties and virtues. By clearly understanding each role's responsibilities, you gain clarity on appropriate action in different contexts. This prevents ethical confusion and helps prioritize conflicting demands. By consciously designing and committing to your roles, you create a coherent, purpose-driven identity across all life domains.",
      source: "Discourses",
      author: "epictetus",
      category: "virtue",
      dateAdded: "2023-07-19",
      day: 186
    },
    {
      id: "sympatheia",
      title: "Sympatheia (Cosmic Sympathy)",
      quote: "All things are woven together and the common bond is sacred, and scarcely one thing is foreign to another, for they have been arranged together in their places and together make the same ordered Universe.",
      explanation: "Sympatheia is the Stoic concept of cosmic interconnectedness. It recognizes that all human beings share a common nature and belong to a universal community. This principle encourages empathy by recognizing that all humans are parts of the same whole, facing similar challenges. By viewing others through this lens, you develop compassion and reduce division, seeing the universal human experience in all people regardless of background.",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-07-26",
      day: 193
    },
    {
      id: "temperance",
      title: "Practice Temperance",
      quote: "Self-control is strength. Right thought is mastery. Calmness is power.",
      explanation: "Temperance involves moderation in all things—eating, drinking, emotional reactions, and desires. By exercising restraint and avoiding excess, you maintain balance and preserve energy for what truly matters. This principle doesn't ask for denial of pleasure but for conscious engagement with it. Through moderated enjoyment, you avoid the diminishing returns and negative consequences of overindulgence.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "self-mastery",
      dateAdded: "2023-08-02",
      day: 200
    },
    {
      id: "mental-fortress",
      title: "Build Your Inner Citadel",
      quote: "The happiness of your life depends upon the quality of your thoughts.",
      explanation: "The Inner Citadel represents your mind as a fortress that external events cannot penetrate without your permission. This principle focuses on developing an internal locus of control—where your sense of well-being comes from within rather than from external validation or circumstances. By strengthening this inner refuge through philosophy and reflection, you become increasingly immune to the chaos of the world.",
      source: "Meditations",
      author: "marcus",
      category: "resilience",
      dateAdded: "2023-08-09",
      day: 207
    },
    {
      id: "focus-on-process",
      title: "Focus on Process, Not Outcomes",
      quote: "Make the best use of what is in your power, and take the rest as it happens.",
      explanation: "This principle redirects attention from results (which are often beyond our control) to the process (which is within our control). By focusing on executing the right actions with excellence rather than fixating on outcomes, you can maintain equanimity regardless of results. This mindset eliminates anxiety about future outcomes and keeps you present and engaged with the task at hand.",
      source: "Enchiridion",
      author: "epictetus",
      category: "perspective",
      dateAdded: "2023-08-16",
      day: 214
    },
    {
      id: "fatalism-about-past",
      title: "Be a Fatalist About the Past",
      quote: "Don't seek for everything to happen as you wish it would, but rather wish that everything happens as it actually will—then your life will flow well.",
      explanation: "This principle encourages complete acceptance of what has already happened. Since the past cannot be changed, wishing it had been different creates unnecessary suffering. By embracing what has occurred as necessary and even beneficial for your growth, you free yourself from regret and resentment. This acceptance doesn't mean condoning wrongs but recognizing the futility of fighting against established reality.",
      source: "Enchiridion",
      author: "epictetus",
      category: "perspective",
      dateAdded: "2023-08-23",
      day: 221
    },
    {
      id: "judgments-on-pause",
      title: "Put Your Judgments on Pause",
      quote: "When you are offended at any man's fault, turn to yourself and study your own failings. Then you will forget your anger.",
      explanation: "This principle asks you to suspend automatic judgments, especially negative ones. By creating space between an event and your reaction to it, you gain freedom from impulsive responses. When something appears bad, ask: 'Is this truly harmful, or merely inconvenient? Is my judgment accurate or distorted by bias?' This pause allows for wiser, more measured responses aligned with your values rather than your instincts.",
      source: "Meditations",
      author: "marcus",
      category: "self-mastery",
      dateAdded: "2023-08-30",
      day: 228
    },
    {
      id: "voluntary-discomfort",
      title: "Practice Voluntary Discomfort",
      quote: "Set aside a certain number of days, during which you shall be content with the scantiest and cheapest fare, with coarse and rough dress, saying to yourself the while: 'Is this the condition that I feared?'",
      explanation: "Voluntary discomfort involves deliberately embracing challenging conditions—cold showers, fasting, hard physical labor—to build resilience. This practice demonstrates that discomfort isn't harmful in itself and reduces your fear of potential hardships. By regularly facing voluntary challenges, you expand your comfort zone and develop confidence in your ability to handle whatever life presents.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "courage",
      dateAdded: "2023-09-06",
      day: 235
    },
    {
      id: "present-moment-awareness",
      title: "Present Moment Awareness",
      quote: "Every hour focus your mind attentively on the performance of the task in hand, with dignity, human sympathy, benevolence and freedom, and leave aside all other thoughts.",
      explanation: "This principle emphasizes full engagement with the current moment rather than dwelling on the past or worrying about the future. By bringing complete attention to what you're doing right now, you increase effectiveness and enjoyment while eliminating anxiety. This practice recognizes that the present moment is the only time in which you can actually take action and experience life directly.",
      source: "Meditations",
      author: "marcus",
      category: "self-mastery",
      dateAdded: "2023-09-13",
      day: 242
    },
    {
      id: "fear-setting",
      title: "Fear Setting",
      quote: "It is not death that a man should fear, but he should fear never beginning to live.",
      explanation: "Fear setting involves thoroughly analyzing what you fear might happen, what you could do to prevent it, and how you would recover if it did occur. This practice often reveals that feared outcomes are neither as likely nor as devastating as imagined. By thinking through contingencies, you reduce paralyzing anxiety and can take calculated risks that align with your values and goals.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "courage",
      dateAdded: "2023-09-20",
      day: 249
    },
    {
      id: "morning-reflection",
      title: "Morning Reflection",
      quote: "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.",
      explanation: "Morning reflection involves starting each day by preparing your mind for challenges. By anticipating potential frustrations—difficult people, unexpected obstacles—you reduce their emotional impact when encountered. This practice also includes setting intentions for virtuous responses and reviewing your guiding principles. This mental preparation ensures you face the day proactively rather than reactively.",
      source: "Meditations",
      author: "marcus",
      category: "discipline",
      dateAdded: "2023-09-27",
      day: 256
    },
    {
      id: "evening-examination",
      title: "Evening Examination",
      quote: "I will keep constant watch over myself and—most usefully—will put each day up for review.",
      explanation: "Evening examination is a daily practice of reviewing your actions and responses. By asking 'What did I do well today? Where did I fall short? How can I improve tomorrow?' you accelerate personal growth through consistent self-reflection. This practice builds self-awareness, reinforces successes, and identifies specific areas for improvement while embedding philosophical principles more deeply into daily life.",
      source: "On Anger",
      author: "seneca",
      category: "self-mastery",
      dateAdded: "2023-10-04",
      day: 263
    },
    {
      id: "philosophical-rehearsal",
      title: "Philosophical Rehearsal",
      quote: "Rehearse them in your mind: exile, torture, war, shipwreck. All the terms of our human lot should be before our eyes.",
      explanation: "Philosophical rehearsal involves mentally practicing virtuous responses to challenging situations before they occur. By imagining how your philosophical principles apply to potential difficulties, you develop automatic virtuous responses that don't require deliberation in the moment. This preparation bridges the gap between theoretical understanding and practical application in daily life.",
      source: "Letters from a Stoic",
      author: "seneca",
      category: "discipline",
      dateAdded: "2023-10-11",
      day: 270
    },
    {
      id: "view-from-nature",
      title: "The View From Nature",
      quote: "All that happens is as usual and familiar as the rose in spring and the crop in summer.",
      explanation: "The View From Nature recognizes that what seems disruptive or chaotic from our limited perspective is often part of larger natural patterns. By seeing events as expressions of nature rather than violations of how things 'should' be, you reduce resistance to reality. This viewpoint shifts your focus from 'why is this happening to me?' to 'what is the most constructive response to what is happening?'",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-10-18",
      day: 277
    },
    {
      id: "prosoche",
      title: "Prosoche (Mindful Attention)",
      quote: "Pay attention to what you're doing. Most mischief and mistakes happen because we don't attend to what we're engaged in.",
      explanation: "Prosoche is the practice of continuous mindful attention to your thoughts, judgments, and actions. By maintaining vigilant awareness of your mental processes, you catch unhelpful reactions before they develop momentum. This practice reveals the gap between your philosophical ideals and actual responses, allowing you to gradually align them through consistent attention and adjustment.",
      source: "Discourses",
      author: "epictetus",
      category: "self-mastery",
      dateAdded: "2023-10-25",
      day: 284
    },
    {
      id: "virtuous-circle",
      title: "The Virtuous Circle",
      quote: "Waste no more time arguing about what a good man should be. Be one.",
      explanation: "The Virtuous Circle recognizes that virtue isn't primarily developed through theoretical study but through action. By taking virtuous action, you develop character; improved character makes virtuous action more natural, creating a positive cycle. This principle emphasizes that philosophical growth comes from application rather than knowledge accumulation—you don't learn to swim by reading about swimming.",
      source: "Meditations",
      author: "marcus",
      category: "virtue",
      dateAdded: "2023-11-01",
      day: 291
    },
    {
      id: "physics-as-ethics",
      title: "Physics as Ethics",
      quote: "Constantly regard the universe as one living being, having one substance and one soul.",
      explanation: "Physics as Ethics connects understanding of the natural world with ethical action. By recognizing that humans are integral parts of a rational cosmos operating according to natural laws, you gain perspective on your place within the larger system. This worldview provides guidance for ethical decisions by aligning your choices with natural processes rather than fighting against the fundamental nature of reality.",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-11-08",
      day: 298
    },
    {
      id: "preferred-indifferents",
      title: "Preferred Indifferents",
      quote: "Make the best use of what is in your power, and take the rest as it happens.",
      explanation: "Preferred Indifferents recognizes that while virtue is the only true good, external outcomes can still be rationally preferred. Health, wealth, and reputation are 'preferred' over illness, poverty, and disrepute, but they don't determine your well-being. This nuanced approach avoids both detachment from practical concerns and unhealthy attachment to outcomes. You can pursue preferred outcomes energetically while maintaining equanimity if they don't materialize.",
      source: "Enchiridion",
      author: "epictetus",
      category: "perspective",
      dateAdded: "2023-11-15",
      day: 305
    },
    {
      id: "philanthropia",
      title: "Philanthropia (Love of Humanity)",
      quote: "Men exist for the sake of one another. Teach them then or bear with them.",
      explanation: "Philanthropia is the cultivation of goodwill toward all humans regardless of their behavior. This principle recognizes that people act according to their limited understanding, not innate malice. By extending compassion even to difficult people, you develop equanimity and effectiveness in relationships. This isn't naïveté about human flaws but a practical approach to maintaining inner tranquility amid human imperfection.",
      source: "Meditations",
      author: "marcus",
      category: "virtue",
      dateAdded: "2023-11-22",
      day: 312
    }
  ];
  
  // Filter principles based on search query and filters
  const filteredPrinciples = principles.filter(principle => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      principle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      principle.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      principle.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      categoryFilter === "all" || 
      principle.category === categoryFilter;
    
    // Author filter
    const matchesAuthor = 
      authorFilter === "all" || 
      principle.author === authorFilter;
    
    return matchesSearch && matchesCategory && matchesAuthor;
  });
  
  // Get author display name
  function getAuthorName(authorId: Principle["author"]) {
    switch (authorId) {
      case "jocko":
        return "Jocko Willink";
      case "goggins":
        return "David Goggins";
      case "marcus":
        return "Marcus Aurelius";
      case "seneca":
        return "Seneca";
      case "epictetus":
        return "Epictetus";
      case "cato":
        return "Cato";
      default:
        return "Other";
    }
  }
  
  // Get category icon
  function getCategoryIcon(category: Principle["category"]) {
    switch (category) {
      case "discipline":
        return <Clock className="h-5 w-5 text-indigo-600" />;
      case "resilience":
        return <Shield className="h-5 w-5 text-blue-600" />;
      case "perspective":
        return <Compass className="h-5 w-5 text-green-600" />;
      case "courage":
        return <Sword className="h-5 w-5 text-red-600" />;
      case "self-mastery":
        return <Brain className="h-5 w-5 text-purple-600" />;
      case "leadership":
        return <TrendingUp className="h-5 w-5 text-amber-600" />;
      case "virtue":
        return <Heart className="h-5 w-5 text-pink-600" />;
      default:
        return <Star className="h-5 w-5 text-yellow-600" />;
    }
  }
  
  // Get category display name and color
  function getCategoryInfo(category: Principle["category"]) {
    switch (category) {
      case "discipline":
        return { name: "Discipline", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
      case "resilience":
        return { name: "Resilience", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "perspective":
        return { name: "Perspective", color: "bg-green-100 text-green-800 border-green-200" };
      case "courage":
        return { name: "Courage", color: "bg-red-100 text-red-800 border-red-200" };
      case "self-mastery":
        return { name: "Self-Mastery", color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "leadership":
        return { name: "Leadership", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "virtue":
        return { name: "Virtue", color: "bg-pink-100 text-pink-800 border-pink-200" };
      default:
        return { name: "Other", color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  }
  
  return (
    <PageContainer title="Core Stoic Principles">
      {/* Introduction */}
      <div className="mb-8 bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          High ROI Principles for Maximum Gains
        </h2>
        <p className="text-muted-foreground mb-4">
          These core principles from stoic philosophy and modern "hard men" like Jocko Willink and David Goggins 
          represent timeless wisdom that produces maximum results in life. Applying just a few of these principles 
          consistently will transform your mental toughness, discipline, and ability to handle adversity.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Discipline
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Resilience
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Perspective
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Courage
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Self-Mastery
          </Badge>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Leadership
          </Badge>
          <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
            Virtue
          </Badge>
        </div>
      </div>
      
      {/* Daily Principle */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Daily Principle
        </h3>
        <Card className="border-2 border-primary/10">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-xl">{principles[0].title}</CardTitle>
                <CardDescription>Day 1 - {getAuthorName(principles[0].author)}</CardDescription>
              </div>
              {getCategoryIcon(principles[0].category)}
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
              "{principles[0].quote}"
            </blockquote>
            <p className="mb-4">{principles[0].explanation}</p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {principles[0].source}
              </span>
              <Badge variant="outline" className={getCategoryInfo(principles[0].category).color}>
                {getCategoryInfo(principles[0].category).name}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search principles..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={categoryFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setCategoryFilter("all")}
          >
            All Categories
          </Button>
          <Button 
            variant={authorFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setAuthorFilter("all")}
          >
            All Authors
          </Button>
        </div>
      </div>
      
      {/* Principles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {filteredPrinciples.map(principle => (
          <Card key={principle.id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>{principle.title}</CardTitle>
                  <CardDescription>{getAuthorName(principle.author)}</CardDescription>
                </div>
                {getCategoryIcon(principle.category)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                "{principle.quote}"
              </blockquote>
              <p className="text-sm mb-4">{principle.explanation}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {principle.source}
                </span>
                <Badge variant="outline" className={getCategoryInfo(principle.category).color}>
                  {getCategoryInfo(principle.category).name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Authors Section */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">Featured Authors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold mb-1">Jocko Willink</h4>
              <p className="text-slate-300 text-sm mb-4">
                Former Navy SEAL commander, author, and leadership consultant known for "Extreme Ownership" 
                and his no-excuses approach to discipline and responsibility.
              </p>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700">
                View Principles
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold mb-1">David Goggins</h4>
              <p className="text-slate-300 text-sm mb-4">
                Former Navy SEAL, ultramarathon runner, and author of "Can't Hurt Me" who transformed himself 
                from an overweight exterminator to one of the world's toughest men.
              </p>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700">
                View Principles
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold mb-1">Marcus Aurelius</h4>
              <p className="text-slate-300 text-sm mb-4">
                Roman Emperor and philosopher whose personal journal "Meditations" contains timeless stoic wisdom 
                on self-discipline, resilience, and maintaining perspective.
              </p>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700">
                View Principles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Books Section */}
      <h3 className="text-lg font-bold mb-4">Essential Reading</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">Discipline Equals Freedom</h4>
            <p className="text-sm text-muted-foreground mb-2">Jocko Willink</p>
            <p className="text-xs mb-4">
              Field manual for developing mental toughness, overcoming weakness, and living a disciplined life.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">Can't Hurt Me</h4>
            <p className="text-sm text-muted-foreground mb-2">David Goggins</p>
            <p className="text-xs mb-4">
              The story of mastering your mind and defying the odds through self-discipline and hard work.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">Meditations</h4>
            <p className="text-sm text-muted-foreground mb-2">Marcus Aurelius</p>
            <p className="text-xs mb-4">
              Personal writings of the Roman Emperor on Stoic philosophy and self-improvement.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">The Obstacle Is the Way</h4>
            <p className="text-sm text-muted-foreground mb-2">Ryan Holiday</p>
            <p className="text-xs mb-4">
              Modern guide to Stoic philosophy focused on turning trials into triumph.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}