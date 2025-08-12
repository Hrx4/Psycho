import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4 animate-message-in">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-chat-bubble-assistant text-chat-bubble-assistant-foreground">
        <Bot className="h-4 w-4" />
      </div>
      
      <div className="flex items-center bg-gradient-message rounded-2xl px-4 py-3 shadow-soft">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-typing"></div>
          <div 
            className="h-2 w-2 bg-muted-foreground rounded-full animate-typing"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div 
            className="h-2 w-2 bg-muted-foreground rounded-full animate-typing"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}