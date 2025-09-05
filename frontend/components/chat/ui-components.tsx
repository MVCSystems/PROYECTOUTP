import React from "react";

type BenefitProps = {
  title: string;
  description: string;
};

export const Benefit: React.FC<BenefitProps> = ({ title, description }) => (
  <div className="p-3 border border-border/50 rounded-lg bg-background transition-colors shadow">
    <h3 className="font-medium text-primary text-sm mb-1">{title}</h3>
    <p className="text-xs text-foreground">
      {description}
    </p>
  </div>
);

type FAQProps = {
  question: string;
  answer: string;
};

export const FAQ: React.FC<FAQProps> = ({ question, answer }) => (
  <div className="border-b border-border pb-3 transition-colors">
    <h3 className="font-medium mb-1 text-sm text-foreground">
      {question}
    </h3>
    <p className="text-xs text-muted-foreground">
      {answer}
    </p>
  </div>
);
