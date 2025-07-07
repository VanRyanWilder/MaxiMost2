import React from 'react';
import { Link } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Assuming shadcn/ui Card
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode; // Optional icon for the card
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({ title, description, link, icon, className }) => {
  return (
    <Card className={`flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg ${className}`}>
      <CardHeader>
        <div className="flex items-center mb-3">
          {icon && <div className="mr-3 text-primary">{icon}</div>}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={link}>
          <Button variant="outline" className="w-full group">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
