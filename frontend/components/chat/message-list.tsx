import React from "react";
import { MessageType } from "@/types/chatbot";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: MessageType[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20" style={{ height: "500px" }}>
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-foreground rounded-tl-none border border-border/30'
            }`}
          >
            {message.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="whitespace-pre-line">{message.text}</div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
