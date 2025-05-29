import { ReactNode } from 'react';

export interface ExpertLink {
  type: string;
  url: string;
}

export interface ExpertResource {
  title: string;
  type: string;
  url: string;
}

export interface Expert {
  id: number;
  name: string;
  title: string;
  bio: string;
  topics: string[];
  avatarUrl: string; // Assuming it might be used later
  expertise: number;
  evidenceBased: number;
  actionability: number;
  noNonsense: number;
  links: ExpertLink[];
  resources: ExpertResource[];
  category: string;
  featured: boolean;
}

export interface ExpertCategory {
  id: string;
  name: string;
  icon?: ReactNode; // Made icon optional as it's not on "all"
}

export const expertsData: Expert[] = [
  {
    id: 1,
    name: "Dr. Peter Attia",
    title: "Longevity & Performance Doctor",
    bio: "Focusing on the science of longevity, performance optimization, and extending healthspan. Former surgeon, engineer, and ultra-endurance athlete.",
    topics: ["Longevity", "Performance", "Nutrition", "Exercise Science", "Health Optimization"],
    avatarUrl: "",
    expertise: 9.8,
    evidenceBased: 9.7,
    actionability: 9.5,
    noNonsense: 9.6,
    links: [
      { type: "website", url: "https://peterattiamd.com" },
      { type: "podcast", url: "https://peterattiamd.com/podcast" },
      { type: "twitter", url: "https://twitter.com/PeterAttiaMD" },
      { type: "youtube", url: "https://www.youtube.com/c/PeterAttiaMD" }
    ],
    resources: [
      { title: "Outlive: The Science and Art of Longevity", type: "book", url: "https://www.amazon.com/Outlive-Longevity-Peter-Attia-MD/dp/0593236599?tag=maximost-20" },
      { title: "The Drive Podcast", type: "podcast", url: "https://peterattiamd.com/podcast" },
      { title: "Exercise for Longevity", type: "article", url: "https://peterattiamd.com/exercise-for-longevity" }
    ],
    category: "Longevity",
    featured: true
  },
  {
    id: 2,
    name: "Dr. Andrew Huberman",
    title: "Neuroscientist & Professor",
    bio: "Professor of neurobiology at Stanford School of Medicine. Translates complex neuroscience into practical protocols for enhancing performance, health, and well-being.",
    topics: ["Neuroscience", "Sleep", "Stress", "Focus", "Health Optimization"],
    avatarUrl: "",
    expertise: 9.7,
    evidenceBased: 9.6,
    actionability: 9.8,
    noNonsense: 9.7,
    links: [
      { type: "website", url: "https://hubermanlab.com" },
      { type: "podcast", url: "https://hubermanlab.com/category/podcast-episodes" },
      { type: "instagram", url: "https://www.instagram.com/hubermanlab" },
      { type: "youtube", url: "https://www.youtube.com/c/AndrewHubermanLab" }
    ],
    resources: [
      { title: "Huberman Lab Podcast", type: "podcast", url: "https://hubermanlab.com/category/podcast-episodes" },
      { title: "Master Your Sleep", type: "toolkit", url: "https://hubermanlab.com/toolkit-for-sleep" },
      { title: "The Science of Setting & Achieving Goals", type: "article", url: "https://hubermanlab.com/the-science-of-setting-achieving-goals" }
    ],
    category: "Neuroscience",
    featured: true
  },
  {
    id: 3,
    name: "Dr. Rhonda Patrick",
    title: "Biochemist & Researcher",
    bio: "Specializes in the impact of micronutrients on metabolic health, aging, and stress resistance. Known for translating complex research into practical health information.",
    topics: ["Nutrition", "Micronutrients", "Aging", "Metabolism", "Genetics"],
    avatarUrl: "",
    expertise: 9.6,
    evidenceBased: 9.8,
    actionability: 9.3,
    noNonsense: 9.5,
    links: [
      { type: "website", url: "https://www.foundmyfitness.com" },
      { type: "podcast", url: "https://www.foundmyfitness.com/episodes" },
      { type: "twitter", url: "https://twitter.com/foundmyfitness" },
      { type: "youtube", url: "https://www.youtube.com/user/FoundMyFitness" }
    ],
    resources: [
      { title: "Found My Fitness Podcast", type: "podcast", url: "https://www.foundmyfitness.com/episodes" },
      { title: "Micronutrient Research", type: "research", url: "https://www.foundmyfitness.com/topics/micronutrients" },
      { title: "Sauna Use for Longevity", type: "article", url: "https://www.foundmyfitness.com/topics/sauna" }
    ],
    category: "Nutrition",
    featured: true
  },
  {
    id: 4,
    name: "Dr. Matthew Walker",
    title: "Sleep Scientist & Professor",
    bio: "Professor of neuroscience and psychology at UC Berkeley, and founder of the Center for Human Sleep Science. World-renowned expert on sleep and its impact on health.",
    topics: ["Sleep", "Circadian Rhythm", "Brain Health", "Longevity"],
    avatarUrl: "",
    expertise: 9.8,
    evidenceBased: 9.7,
    actionability: 9.6,
    noNonsense: 9.4,
    links: [
      { type: "website", url: "https://www.sleepdiplomat.com" },
      { type: "twitter", url: "https://twitter.com/sleepdiplomat" },
      { type: "youtube", url: "https://www.youtube.com/channel/UC2_fCWVkuQJuHw6MnKt5Iuw" }
    ],
    resources: [
      { title: "Why We Sleep", type: "book", url: "https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144324?tag=maximost-20" },
      { title: "Sleep is Non-Negotiable", type: "talk", url: "https://www.youtube.com/watch?v=c1yGw_hU5C4" },
      { title: "Sleep for Cognitive Enhancement", type: "research", url: "https://www.sleepdiplomat.com/resources" }
    ],
    category: "Sleep",
    featured: false
  },
  {
    id: 5,
    name: "Dr. Dominic D'Agostino",
    title: "Ketogenic Diet Researcher",
    bio: "Associate Professor at the University of South Florida, researching the mechanisms of metabolic therapies, including the ketogenic diet, ketone supplements, and hyperbaric oxygen.",
    topics: ["Ketogenic Diet", "Metabolism", "Brain Health", "Nutrition", "Performance"],
    avatarUrl: "",
    expertise: 9.5,
    evidenceBased: 9.6,
    actionability: 9.2,
    noNonsense: 9.3,
    links: [
      { type: "website", url: "https://www.ketonutrition.org" },
      { type: "instagram", url: "https://www.instagram.com/dominic.dagostino.kt" },
      { type: "twitter", url: "https://twitter.com/DominicDAgosti2" }
    ],
    resources: [
      { title: "Ketone Supplementation Research", type: "research", url: "https://www.ketonutrition.org/research" },
      { title: "Therapeutic Applications of the Ketogenic Diet", type: "article", url: "https://www.ketonutrition.org/applications" },
      { title: "Metabolism & Ketones", type: "talk", url: "https://www.youtube.com/watch?v=Dan8IjvPkdU" }
    ],
    category: "Nutrition",
    featured: false
  },
  {
    id: 6,
    name: "Kelly Starrett",
    title: "Physical Therapist & Mobility Expert",
    bio: "Physical therapist, coach, and founder of The Ready State. Pioneer in performance-based injury prevention and mobility training with a focus on athletes and everyday people.",
    topics: ["Mobility", "Movement", "Recovery", "Physical Therapy", "Performance"],
    avatarUrl: "",
    expertise: 9.4,
    evidenceBased: 9.3,
    actionability: 9.8,
    noNonsense: 9.6,
    links: [
      { type: "website", url: "https://thereadystate.com" },
      { type: "instagram", url: "https://www.instagram.com/thereadystate" },
      { type: "youtube", url: "https://www.youtube.com/c/TheReadyState" }
    ],
    resources: [
      { title: "Becoming a Supple Leopard", type: "book", url: "https://www.amazon.com/Becoming-Supple-Leopard-2nd-Performance/dp/1628600837?tag=maximost-20" },
      { title: "MobilityWOD", type: "program", url: "https://thereadystate.com/pages/mobility-work" },
      { title: "Desk Bound: Standing Up to a Sitting World", type: "book", url: "https://www.amazon.com/Deskbound-Standing-Up-Sitting-World/dp/1628600586?tag=maximost-20" }
    ],
    category: "Physical Training",
    featured: false
  },
  {
    id: 7,
    name: "Dr. Satchin Panda",
    title: "Circadian Rhythm Researcher",
    bio: "Professor at the Salk Institute and leading expert on circadian rhythms. Pioneer in time-restricted eating research and its impact on metabolism, longevity, and disease prevention.",
    topics: ["Circadian Rhythm", "Time-Restricted Eating", "Sleep", "Metabolism"],
    avatarUrl: "",
    expertise: 9.7,
    evidenceBased: 9.8,
    actionability: 9.4,
    noNonsense: 9.3,
    links: [
      { type: "website", url: "https://www.mycircadianclock.org" },
      { type: "twitter", url: "https://twitter.com/SatchinPanda" }
    ],
    resources: [
      { title: "The Circadian Code", type: "book", url: "https://www.amazon.com/Circadian-Code-Supercharge-Transform-Midnight/dp/163565243X?tag=maximost-20" },
      { title: "Time-Restricted Eating Research", type: "research", url: "https://www.mycircadianclock.org/research" },
      { title: "Circadian Rhythm and Health", type: "talk", url: "https://www.youtube.com/watch?v=erBJuxVR7IE" }
    ],
    category: "Sleep",
    featured: false
  },
  {
    id: 8,
    name: "Dr. Andy Galpin",
    title: "Exercise Physiologist & Professor",
    bio: "Professor of kinesiology and director of the Biochemistry and Molecular Exercise Physiology Laboratory. Expert in human performance optimization through training methodology.",
    topics: ["Exercise Science", "Strength Training", "Muscle Physiology", "Recovery", "Performance"],
    avatarUrl: "",
    expertise: 9.6,
    evidenceBased: 9.5,
    actionability: 9.7,
    noNonsense: 9.8,
    links: [
      { type: "website", url: "https://www.andygalpin.com" },
      { type: "instagram", url: "https://www.instagram.com/drandygalpin" },
      { type: "twitter", url: "https://twitter.com/DrAndyGalpin" },
      { type: "youtube", url: "https://www.youtube.com/@AndyGalpin" }
    ],
    resources: [
      { title: "Unplugged", type: "book", url: "https://www.amazon.com/Unplugged-Evolve-Technology-Upgrade-Fitness/dp/1628602619?tag=maximost-20" },
      { title: "Training Methods Research", type: "research", url: "https://www.andygalpin.com/research" },
      { title: "Hybrid Training Approach", type: "article", url: "https://www.andygalpin.com/hybrid-approach" }
    ],
    category: "Physical Training",
    featured: false
  }
];

// Note: The 'icon' property for categories in the original component used Lucide React components directly.
// In a .ts data file, we can't store JSX elements directly if this file isn't treated as a .tsx module by the bundler
// and if we want to keep it pure data. For simplicity, I'm defining the 'icon' prop as optional in the interface.
// The component using this data will need to map category IDs to actual Icon components.
// Alternatively, if this file is `experts-data.tsx`, we could import Lucide icons and use them.
// For now, I'll keep it as a .ts file and make icon optional or string-based if preferred.
// Re-evaluating: Since the original component directly embedded Lucide icons, and this data is tightly coupled
// to that component, it's reasonable to make this a .tsx file or ensure ReactNode is handled.
// I'll include `ReactNode` and assume the consuming component can handle it or it's a .tsx file.

export const expertCategories: ExpertCategory[] = [ // Renamed from 'categories' to avoid conflict if imported directly
  { id: "all", name: "All Experts" },
  { id: "Longevity", name: "Longevity" /* icon: <Calendar className="w-4 h-4" /> */ },
  { id: "Neuroscience", name: "Neuroscience" /* icon: <Brain className="w-4 h-4" /> */ },
  { id: "Physical Training", name: "Physical Training" /* icon: <Dumbbell className="w-4 h-4" /> */ },
  { id: "Nutrition", name: "Nutrition" /* icon: <Utensils className="w-4 h-4" /> */ },
  { id: "Sleep", name: "Sleep" /* icon: <Activity className="w-4 h-4" /> */ }
];
// The icons themselves (Lucide components) will be added back in the .tsx component that consumes this data,
// or this file can be renamed to .tsx and import Lucide icons. For a pure data file, we avoid JSX.
// I've commented out the icons for now to make it a pure .ts data file.
