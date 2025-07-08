import React from 'react';
import { PageContainer } from '@/components/layout/page-container';

const StoicPrinciplesPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-4">Stoic Principles</h1>
        <p className="text-muted-foreground">
          An overview of key Stoic philosophies and their practical application in daily life for resilience and virtue.
        </p>
        {/* Placeholder content */}
        <div className="mt-6 space-y-4">
          <p>This section will explore concepts like the dichotomy of control, negative visualization, and virtuous living.</p>
          <p>Content under development.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default StoicPrinciplesPage;
