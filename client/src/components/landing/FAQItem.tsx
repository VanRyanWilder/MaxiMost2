import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"; // Using Accordion components from shadcn/ui

interface FAQItemProps {
  question: string;
  answer: string;
  value: string; // Required for AccordionItem, needs to be unique within an Accordion
  className?: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  value, // Each FAQItem will need a unique value prop (e.g., "item-1", "item-2")
  className,
}) => {
  return (
    <AccordionItem value={value} className={`border-white/20 hover:bg-white/5 transition-colors duration-300 rounded-md ${className}`}> {/* Added hover effect & rounded */}
      <AccordionTrigger className="text-left hover:no-underline text-white text-lg font-semibold px-4 py-3"> {/* Adjusted padding */}
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-neutral-300 pt-2 pb-4 px-4"> {/* Adjusted padding */}
        {/* Using dangerouslySetInnerHTML assuming answer might contain simple HTML like <br> or links.
            If answer is plain text, <p>{answer}</p> is safer.
            For this example, we will use a <p> tag for safety.
            If HTML is needed, sanitization would be important. */}
        <p className="whitespace-pre-line">{answer}</p>
      </AccordionContent>
    </AccordionItem>
  );
};

// Example Usage (in a page component):
// import { Accordion } from "@/components/ui/accordion";
// import { FAQItem } from "@/components/landing/FAQItem";
//
// const faqs = [
//   {
//     value: "item-1",
//     question: "What makes Maximost different?",
//     answer: "Maximost isn't just a habit tracker..."
//   },
//   // ... other FAQs
// ];
//
// <Accordion type="single" collapsible className="w-full">
//   {faqs.map(faq => (
//     <FAQItem key={faq.value} value={faq.value} question={faq.question} answer={faq.answer} />
//   ))}
// </Accordion>
