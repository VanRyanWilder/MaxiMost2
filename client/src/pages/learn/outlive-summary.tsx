import React from 'react';
import ContentPageLayout from '@/components/layout/ContentPageLayout'; // Corrected import path

const OutliveSummaryPage: React.FC = () => {
  return (
    <ContentPageLayout title="Outlive by Peter Attia: A Summary">
      <p className="text-lg text-muted-foreground mb-6 dark:text-gray-400">
        Detailed summary and key takeaways from Peter Attia's "Outlive" will be presented here.
        This section will explore concepts related to longevity, healthspan, and strategies for optimal physical and mental well-being.
      </p>
      {/* Placeholder content */}
      <div className="space-y-4">
        <p className="dark:text-gray-300">Key topics from "Outlive" that will be covered:</p>
        <ul className="list-disc list-inside space-y-1 dark:text-gray-300">
          <li>The Four Horsemen: Atherosclerotic cardiovascular disease, Cancer, Neurodegenerative disease, Metabolic dysfunction.</li>
          <li>Medicine 3.0: Proactive and personalized healthcare.</li>
          <li>The importance of exercise: Zone 2, VO2 max, strength, and stability.</li>
          <li>Nutritional biochemistry and personalized eating strategies.</li>
          <li>The science of sleep and its impact on health.</li>
          <li>Emotional health and its connection to longevity.</li>
        </ul>
        <p className="dark:text-gray-300">Chapter summaries, actionable advice, and connections to MaxiMost principles will be included. Content under development.</p>
      </div>
    </ContentPageLayout>
  );
};

export default OutliveSummaryPage;
