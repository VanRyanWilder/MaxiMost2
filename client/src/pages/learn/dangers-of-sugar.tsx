import React from 'react';
import ContentPageLayout from '@/components/layout/ContentPageLayout'; // Corrected import path

const DangersOfSugarPage: React.FC = () => {
  return (
    <ContentPageLayout title="The Dangers of Sugar">
      <p className="text-lg text-muted-foreground mb-6">
        This page will detail the health risks associated with high sugar consumption and provide actionable insights.
      </p>
      {/* Placeholder content */}
      <div className="space-y-4">
        <p>Key areas to be discussed:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Impact on Metabolic Health (Insulin Resistance, Type 2 Diabetes).</li>
          <li>Link to Chronic Inflammation and Disease.</li>
          <li>Hidden Sugars in Common Foods and Beverages.</li>
          <li>Effects on Brain Function and Mood.</li>
          <li>Strategies for Reducing Sugar Intake and Healthier Alternatives.</li>
        </ul>
        <p>Detailed information, scientific backing, and practical tips will be provided soon.</p>
      </div>
    </ContentPageLayout>
  );
};

export default DangersOfSugarPage;
