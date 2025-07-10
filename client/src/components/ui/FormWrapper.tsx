import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"; // Use the updated Card

interface FormWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  cardClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

export const FormWrapper = React.forwardRef<HTMLDivElement, FormWrapperProps>(
  ({
    className,
    title,
    description,
    children,
    footerContent,
    cardClassName,
    contentClassName,
    headerClassName,
    footerClassName,
    ...props
  }, ref) => {
    return (
      <Card ref={ref} className={cn("w-full", cardClassName, className)} {...props}>
        {(title || description) && (
          <CardHeader className={headerClassName}>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={contentClassName}>
          {children}
        </CardContent>
        {footerContent && (
          <CardFooter className={footerClassName}>
            {footerContent}
          </CardFooter>
        )}
      </Card>
    );
  }
);
FormWrapper.displayName = "FormWrapper";
