
"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { Send } from "lucide-react";
import { Textarea } from "./textarea";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}

interface ChatContextProps {
  messages: Message[];
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const ChatContext = React.createContext<ChatContextProps | null>(null);

export const Chat = ({
  messages,
  user,
  onSend,
  isLoading,
  children,
}: React.PropsWithChildren<ChatContextProps>) => {
  return (
    <ChatContext.Provider
      value={{
        messages,
        user,
        onSend,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatList = () => {
  const { messages, user } = useChat();
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto p-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{
              opacity: { duration: 0.2 },
              layout: {
                type: "spring",
                bounce: 0.3,
                duration: 0.3,
              },
            }}
          >
            <ChatMessage message={message} user={user} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
  user: { id: string; name: string; avatar: string };
}

export const ChatMessage = ({ message, user }: ChatMessageProps) => {
    const isUser = message.role === "user";
    const [avatarSrc, setAvatarSrc] = React.useState(getAvatarSrc());

    const getAvatarSrc = () => {
      if (message.role === 'user') return user.avatar;
      if (message.role === 'assistant') return '/bot-avatar.png'; // Example for bot
      return null;
    }

    const handleAvatarError = () => {
        const fallback = getAvatarFallback();
        if(fallback) {
            setAvatarSrc(`https://placehold.co/32x32/A8A29E/3F3F46.png?text=${fallback}`);
        }
    }
  
    const getAvatarFallback = () => {
        if (message.role === 'user') return user.name.charAt(0);
        if (message.role === 'assistant') return 'B';
        return null;
    }
    
    if (message.role === 'system') {
        return (
            <div className="flex items-center justify-center my-4">
                <p className="text-xs text-muted-foreground px-4 py-1 rounded-full bg-muted">
                    {message.content}
                </p>
            </div>
        )
    }

    return (
      <div
        className={cn(
          "flex items-start gap-3 my-4",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        {!isUser && (
            <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc || ''} alt="Avatar" onError={handleAvatarError} />
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
            </Avatar>
        )}
        <div
          className={cn(
            "max-w-[75%] rounded-lg p-3 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.content}
        </div>
        {isUser && (
            <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc || ''} alt={user.name} onError={handleAvatarError} />
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
            </Avatar>
        )}
      </div>
    );
  };
  
export const ChatInput = () => {
    const { onSend, isLoading } = useChat();
    const [value, setValue] = React.useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim()) {
        onSend(value.trim());
        setValue("");
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a message..."
            className="pr-12 resize-none"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={isLoading || !value.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    );
};
