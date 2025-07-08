import React from 'react';
import ContentPageLayout from '@/components/layout/ContentPageLayout'; // Corrected import path

const StoicPrinciplesPage: React.FC = () => {
  return (
    <ContentPageLayout title="Stoic Principles">
      <p className="text-lg text-muted-foreground mb-6">
        An overview of key Stoic philosophies and their practical application in daily life for resilience and virtue.
      </p>
      {/* Placeholder content */}
      <div className="space-y-4">
        <p>This section will explore concepts like the dichotomy of control, negative visualization, and virtuous living.</p>
        <p>Key themes to be covered:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>The Dichotomy of Control: Focusing on what you can influence.</li>
          <li>Amor Fati: Loving your fate, whatever it may be.</li>
          <li>Premeditatio Malorum: The premeditation of evils.</li>
          <li>Virtue as the Sole Good: Wisdom, Justice, Courage, Temperance.</li>
          <li>The View from Above: Seeing things from a cosmic perspective.</li>
        </ul>
        <p>Content under development. More detailed explanations and practical exercises will be added soon.</p>
      </div>
    </ContentPageLayout>
  );
};

export default StoicPrinciplesPage;
