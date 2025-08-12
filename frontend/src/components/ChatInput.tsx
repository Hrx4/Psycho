import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="min-h-[60px] max-h-[200px] resize-none bg-chat-input text-chat-input-foreground border-border focus:ring-primary"
          disabled={disabled}
        />
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className="bg-gradient-primary hover:opacity-90 text-white px-4 h-[60px] shadow-elegant"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}