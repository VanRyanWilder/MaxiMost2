import React from 'react';
import { PageContainer } from '@/components/layout/page-container';

const DangersOfSugarPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-4">The Dangers of Sugar</h1>
        <p className="text-muted-foreground">
          This page will detail the health risks associated with high sugar consumption.
        </p>
        {/* Placeholder content */}
        <div className="mt-6 space-y-4">
          <p>Topics covered will include metabolic health, inflammation, hidden sugars, and strategies for reduction.</p>
          <p>Content coming soon.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default DangersOfSugarPage;
