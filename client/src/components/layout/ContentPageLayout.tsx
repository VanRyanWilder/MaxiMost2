import React from 'react';
import { PageContainer } from '@/components/layout/page-container'; // Using the existing PageContainer for max-width and centering

interface ContentPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({ title, children }) => {
  return (
    <PageContainer> {/* Ensures content is centered and has a max-width from AppLayout's context */}
      <div className="py-8 md:py-12"> {/* Vertical padding for the content page */}
        <article className="prose dark:prose-invert lg:prose-xl mx-auto"> {/* Tailwind Typography for styling, centered text column */}
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              {title}
            </h1>
            {/* Placeholder for potential subtitle or metadata if needed in the future */}
            {/* <p className="text-lg text-muted-foreground">Optional subtitle or author info here.</p> */}
          </header>

          {/* Main content area */}
          <div className="text-foreground">
            {children}
          </div>
        </article>
      </div>
    </PageContainer>
  );
};

export default ContentPageLayout;
