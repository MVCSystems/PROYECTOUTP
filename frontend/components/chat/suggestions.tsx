import React from "react";
import { Badge } from "@/components/ui/badge";

interface SuggestionsProps {
  suggestions?: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions = [], onSuggestionClick }) => {
  if (!suggestions.length) return null;
  
  return (
    <div className="p-3 border-t border-border flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-900/30">
      {suggestions.map((suggestion, index) => (
        <Badge 
          key={`suggestion-${index}-${Math.random().toString(36).substring(2, 9)}`} 
          variant="secondary" 
          className="cursor-pointer hover:bg-primary/10 transition-colors shadow-sm py-1.5 px-3"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Badge>
      ))}
    </div>
  );
};

export default Suggestions;
