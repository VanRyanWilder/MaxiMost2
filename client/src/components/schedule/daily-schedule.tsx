import { Button } from "@/components/ui/button";

interface ScheduleEvent {
  time: string;
  title: string;
  description: string;
  type: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
}

interface ScheduleBlock {
  title: string;
  color: string;
  events: ScheduleEvent[];
}

export function DailySchedule() {
  const scheduleBlocks: ScheduleBlock[] = [
    {
      title: "Morning",
      color: "border-primary",
      events: [
        {
          time: "5:00 AM",
          title: "Wake Up",
          description: "No snoozing, immediate exposure to sunlight",
          type: "blue"
        },
        {
          time: "5:15 AM",
          title: "Meditation & Prayer",
          description: "10 minutes of focused meditation",
          type: "purple"
        },
        {
          time: "5:30 AM",
          title: "Workout",
          description: "30 min strength training - Push day",
          type: "green"
        },
        {
          time: "6:15 AM",
          title: "Cold Shower & Supplements",
          description: "2-minute cold exposure & morning supplement stack",
          type: "yellow"
        }
      ]
    },
    {
      title: "Afternoon",
      color: "border-warning",
      events: [
        {
          time: "12:30 PM",
          title: "Lunch",
          description: "High protein, low carb meal",
          type: "green"
        },
        {
          time: "2:00 PM",
          title: "Cognitive Training",
          description: "20 minutes of dual N-back exercises",
          type: "purple"
        }
      ]
    },
    {
      title: "Evening",
      color: "border-secondary",
      events: [
        {
          time: "6:00 PM",
          title: "Dinner",
          description: "Last meal of the day",
          type: "green"
        },
        {
          time: "7:30 PM",
          title: "Reading",
          description: "30 minutes of Stoic philosophy",
          type: "blue"
        },
        {
          time: "9:00 PM",
          title: "Journal & Brain Dump",
          description: "Review the day, gratitude practice",
          type: "purple"
        },
        {
          time: "9:30 PM",
          title: "Sleep Preparation",
          description: "No screens, evening supplements, cool room",
          type: "red"
        }
      ]
    }
  ];

  const getEventBgColor = (type: string) => {
    switch (type) {
      case 'blue': return 'bg-blue-50';
      case 'purple': return 'bg-purple-50';
      case 'green': return 'bg-green-50';
      case 'yellow': return 'bg-yellow-50';
      case 'red': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl">Today's Schedule</h3>
        <div className="flex space-x-2">
          <Button size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Event
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {scheduleBlocks.map((block, blockIndex) => (
          <div key={blockIndex} className={`border-l-4 ${block.color} pl-4`}>
            <h4 className="font-semibold text-lg mb-2">{block.title}</h4>
            <div className="space-y-3">
              {block.events.map((event, eventIndex) => (
                <div key={eventIndex} className="flex">
                  <div className="w-20 text-sm text-gray-500">{event.time}</div>
                  <div className={`flex-1 ${getEventBgColor(event.type)} p-3 rounded-lg`}>
                    <h5 className="font-medium">{event.title}</h5>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
