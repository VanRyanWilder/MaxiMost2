import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Beaker, 
  ExternalLink,
  Trophy,
  User,
  Quote,
} from "lucide-react";

interface ExpertInsight {
  expert: string;
  insight: string;
}

interface TopSupplement {
  id: number;
  name: string;
  benefits: string;
  expertInsights: ExpertInsight[];
  dosage: string;
  amazonLink: string;
}

export default function SupplementsPage() {
  // Top 10 supplements data with expert insights
  const topSupplements: TopSupplement[] = [
    {
      id: 1,
      name: "Omega-3 Fatty Acids (EPA and DHA)",
      benefits: "Reduces inflammation, supports heart and brain health, aids recovery.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Highlights omega-3s for their anti-inflammatory properties and cognitive benefits, key for recovery and mental clarity."
        },
        {
          expert: "Peter Attia",
          insight: "Recommends them for cardiovascular health, vital for endurance athletes."
        },
        {
          expert: "Ben Greenfield",
          insight: "Suggests omega-3s to reduce joint inflammation and enhance performance in high-intensity sports."
        }
      ],
      dosage: "2-4g daily, with ~2g EPA for optimal anti-inflammatory effects.",
      amazonLink: "https://www.amazon.com/dp/B01GV4O37E?tag=maximusgains-20"
    },
    {
      id: 2,
      name: "Vitamin D3",
      benefits: "Boosts bone health, immunity, and muscle function.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Stresses its role in immune support and injury prevention for athletes with heavy training loads."
        },
        {
          expert: "Kelly Starrett",
          insight: "Advocates for vitamin D to maintain bone density and aid recovery, especially for runners."
        },
        {
          expert: "Cate Shanahan",
          insight: "Notes its importance for calcium absorption and preventing stress fractures."
        }
      ],
      dosage: "4,000-5,000 IU/day, adjusted based on blood levels.",
      amazonLink: "https://www.amazon.com/dp/B0032BH76O?tag=maximusgains-20"
    },
    {
      id: 3,
      name: "Magnesium",
      benefits: "Promotes muscle relaxation, sleep quality, and energy production.",
      expertInsights: [
        {
          expert: "Peter Attia",
          insight: "Uses magnesium for better sleep and muscle recovery, critical for intense training schedules."
        },
        {
          expert: "Phil Maffetone",
          insight: "Recommends it to prevent cramps and support endurance performance."
        },
        {
          expert: "Stuart McGill",
          insight: "Emphasizes its role in muscle relaxation and spine health for injury prevention."
        }
      ],
      dosage: "1g daily, preferably as magnesium glycinate or citrate.",
      amazonLink: "https://www.amazon.com/dp/B07RM7VXFV?tag=maximusgains-20"
    },
    {
      id: 4,
      name: "Creatine Monohydrate",
      benefits: "Enhances muscle strength, power, and cognitive performance.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Praises creatine for physical and mental benefits, especially under fatigue."
        },
        {
          expert: "Andy Galpin",
          insight: "Recommends it for strength gains and recovery in high-intensity athletes."
        },
        {
          expert: "Brad Schoenfeld",
          insight: "Supports its use for muscle growth and resilience against injuries."
        }
      ],
      dosage: "5-10g daily.",
      amazonLink: "https://www.amazon.com/dp/B00E9M4XEE?tag=maximusgains-20"
    },
    {
      id: 5,
      name: "Probiotics",
      benefits: "Improves gut health, immunity, and mental well-being.",
      expertInsights: [
        {
          expert: "Peter Attia",
          insight: "Values probiotics for gut health and metabolic benefits, aiding recovery."
        },
        {
          expert: "Rhonda Patrick",
          insight: "Notes their role in reducing gut inflammation, essential for athletes with high nutritional needs."
        },
        {
          expert: "Ben Greenfield",
          insight: "Suggests probiotics to optimize nutrient absorption and prevent GI issues in endurance events."
        }
      ],
      dosage: "10-50 billion CFU daily, depending on the product.",
      amazonLink: "https://www.amazon.com/dp/B079HVWH31?tag=maximusgains-20"
    },
    {
      id: 6,
      name: "Curcumin (with Piperine)",
      benefits: "Reduces inflammation, supports joint and metabolic health.",
      expertInsights: [
        {
          expert: "Peter Attia",
          insight: "Takes curcumin for its anti-inflammatory effects, speeding up recovery."
        },
        {
          expert: "Kelly Starrett",
          insight: "Recommends it for joint mobility and managing repetitive stress injuries."
        },
        {
          expert: "Cate Shanahan",
          insight: "Highlights its role in reducing systemic inflammation and aiding tissue repair."
        }
      ],
      dosage: "500-1,000mg daily in bioavailable forms.",
      amazonLink: "https://www.amazon.com/dp/B01DBTFO98?tag=maximusgains-20"
    },
    {
      id: 7,
      name: "B Vitamins (Methylated Forms: B-12, Folate, B6)",
      benefits: "Supports energy production, brain health, and recovery.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Uses methylated B vitamins for cognitive and energy support during stress."
        },
        {
          expert: "Rhonda Patrick",
          insight: "Emphasizes their importance for cellular repair and recovery."
        },
        {
          expert: "Phil Maffetone",
          insight: "Recommends them for endurance athletes to enhance aerobic metabolism."
        }
      ],
      dosage: "Low-dose methylated forms, tailored to individual needs.",
      amazonLink: "https://www.amazon.com/dp/B01769WCUU?tag=maximusgains-20"
    },
    {
      id: 8,
      name: "Sulforaphane",
      benefits: "Provides antioxidant support, aids detoxification, and boosts brain health.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Advocates for sulforaphane's neuroprotective and anti-inflammatory effects, enhancing cognitive resilience."
        },
        {
          expert: "Ben Greenfield",
          insight: "Recommends it for detoxification, especially for athletes facing environmental stressors."
        }
      ],
      dosage: "20-40mg daily, from broccoli sprouts or supplements.",
      amazonLink: "https://www.amazon.com/dp/B01D15LMCK?tag=maximusgains-20"
    },
    {
      id: 9,
      name: "NMN/NR (Nicotinamide Mononucleotide/Nicotinamide Riboside)",
      benefits: "Boosts cellular energy and supports longevity.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Takes NMN for cellular health, potentially aiding recovery and endurance."
        },
        {
          expert: "Peter Attia",
          insight: "Explores NAD+ precursors for metabolic benefits, relevant to ultra-marathoners."
        },
        {
          expert: "David Sinclair",
          insight: "Pioneers its use for cellular resilience and longevity."
        }
      ],
      dosage: "250-500mg daily.",
      amazonLink: "https://www.amazon.com/dp/B07PBG6KLN?tag=maximusgains-20"
    },
    {
      id: 10,
      name: "Electrolytes (e.g., LMNT)",
      benefits: "Maintains hydration, muscle function, and performance.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Uses LMNT for hydration during intense workouts."
        },
        {
          expert: "Chris Hinshaw",
          insight: "Recommends electrolytes to prevent cramping and sustain performance in endurance sports."
        },
        {
          expert: "Tim Noakes",
          insight: "His hydration research underscores their importance for ultra-marathoners."
        }
      ],
      dosage: "1-2 packets daily, adjusted for activity level.",
      amazonLink: "https://www.amazon.com/dp/B07KDRL5LL?tag=maximusgains-20"
    }
  ];

  return (
    <PageContainer title="Top 10 Supplements - Maximum ROI for Health & Performance">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-10 w-10 text-amber-500" />
          <h1 className="text-3xl font-bold">Top 10 Supplements with Expert Insights</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl text-lg">
          These are the highest-ROI supplements backed by scientific research and recommended by leading health experts. 
          Each provides significant benefits with minimal downsides when used appropriately.
        </p>
      </div>
      
      <div className="space-y-16">
        {topSupplements.map((supplement) => (
          <div key={supplement.id} className="relative border-l-4 border-primary pl-6 pb-6">
            <div className="absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
              {supplement.id}
            </div>
            <div className="pt-2">
              <h3 className="text-2xl font-bold mb-4">{supplement.name}</h3>
              
              <div className="flex flex-col gap-6">
                <Card className="overflow-hidden border-none shadow-md">
                  <CardContent className="p-5 bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Benefits</h4>
                    </div>
                    <p className="text-green-700">{supplement.benefits}</p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md">
                  <CardContent className="p-5 bg-blue-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Beaker className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Recommended Dosage</h4>
                    </div>
                    <p className="text-blue-700">{supplement.dosage}</p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md">
                  <CardContent className="p-5 bg-purple-50">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Expert Insights</h4>
                    </div>
                    <div className="space-y-4">
                      {supplement.expertInsights.map((insight, index) => (
                        <div key={index} className="pl-4 border-l-2 border-purple-300">
                          <div className="flex items-center gap-2">
                            <Quote className="h-4 w-4 text-purple-500" />
                            <span className="font-semibold text-purple-700">{insight.expert}</span>
                          </div>
                          <p className="mt-1 text-sm text-purple-700">{insight.insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <a 
                    href={supplement.amazonLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors shadow-md"
                  >
                    <span>Buy on Amazon</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
