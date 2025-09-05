import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface MessageInputProps {
  inputValue: string;
  isTyping: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  inputValue, 
  isTyping, 
  onInputChange, 
  onKeyDown, 
  onSendMessage 
}) => {
  return (
    <div className="p-4 border-t border-border flex gap-2 bg-white dark:bg-slate-800 shadow-inner">
      <Input
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Escribe tu mensaje..."
        className="flex-1 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
        disabled={isTyping}
      />
      <Button 
        onClick={onSendMessage} 
        disabled={!inputValue.trim() || isTyping}
        variant="default"
        className="px-4"
        size="icon"
      >
        {isTyping ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default MessageInput;
