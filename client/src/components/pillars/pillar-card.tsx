import { ReactNode } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillarCardProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  tags: string[];
  count: number;
  path: string;
}

export function PillarCard({ id, title, description, icon, color, tags, count, path }: PillarCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md", 
      `hover:border-l-4 ${color}`
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className={cn("p-2 rounded-lg", 
            color.replace("border", "bg").replace("500", "100"),
            color.replace("border", "text").replace("500", "600")
          )}>
            {icon}
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {count} {count === 1 ? "item" : "items"}
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={path}>
          <Button className="w-full gap-1" variant="outline">
            <span>View Resources</span> <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}