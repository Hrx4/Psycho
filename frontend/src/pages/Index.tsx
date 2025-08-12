import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// const API_BASE_URL = 'http://localhost:8000' 
const API_BASE_URL = 'https://psycho-nu.vercel.app'

export default function Index() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Welcome to Psycholite",
      lastMessage: "Hello! How can I help you?",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          content: "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<string>("1");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isTyping]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastMessage: message,
              timestamp: new Date(),
            }
          : conv
      )
    );

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query : message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      // Create initial AI message
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        content: "",
        isUser: false,
        timestamp: new Date(),
      };

      // Add empty AI message to conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: "",
                timestamp: new Date(),
              }
            : conv
        )
      );

      setIsTyping(false);

      // Read stream
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Update AI message with accumulated content
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ),
                  lastMessage: accumulatedContent,
                  timestamp: new Date(),
                }
              : conv
          )
        );
      }
    } catch (error) {
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, errorMessage],
                lastMessage: errorMessage.content,
                timestamp: new Date(),
              }
            : conv
        )
      );
    }
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `New Chat ${conversations.length + 1}`,
      lastMessage: "New conversation started",
      timestamp: new Date(),
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    
    if (currentConversationId === id) {
      const remaining = conversations.filter((conv) => conv.id !== id);
      setCurrentConversationId(remaining[0]?.id || "");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex flex-1 flex-col">
        {currentConversation ? (
          <>
            {/* Header */}
            <div className="border-b border-border bg-card p-4">
              <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
                <Sparkles className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">
                  {currentConversation.title}
                </h1>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="max-w-4xl mx-auto">
                {currentConversation.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                    <div className="bg-gradient-primary rounded-full p-4 mb-4 shadow-elegant">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      How can I help you today?
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                      I'm here to assist you with questions, creative tasks, analysis, and more. 
                      Just start typing to begin our conversation!
                    </p>
                  </div>
                ) : (
                  currentConversation.messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  ))
                )}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No conversation selected
              </h2>
              <p className="text-muted-foreground mb-4">
                Create a new conversation to get started
              </p>
              <Button onClick={handleNewConversation} className="bg-gradient-primary hover:opacity-90 text-white shadow-elegant">
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}