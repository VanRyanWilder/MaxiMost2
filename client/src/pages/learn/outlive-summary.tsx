import React from 'react';
import { PageContainer } from '@/components/layout/page-container';

const OutliveSummaryPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-4">Outlive by Peter Attia: A Summary</h1>
        <p className="text-muted-foreground">
          Detailed summary and key takeaways from Peter Attia's "Outlive" will be presented here.
          This section will explore concepts related to longevity, healthspan, and strategies for optimal physical and mental well-being.
        </p>
        {/* Placeholder content */}
        <div className="mt-6 space-y-4">
          <p>Chapter summaries, actionable advice, and connections to MaxiMost principles will be included.</p>
          <p>Stay tuned for updates!</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default OutliveSummaryPage;
