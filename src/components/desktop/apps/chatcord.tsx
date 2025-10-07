
'use client';

import { useState } from "react";
import {
  Chat,
  ChatList,
  ChatMessage,
  ChatInput,
  Message,
} from "@/components/ui/chat";
import { useUserProfileContext } from "@/context/user-profile-context";

const initialMessages: Message[] = [
  {
    id: "1",
    role: "system",
    content: "Welcome to ChatCord! This is the beginning of your conversation.",
  },
];

export default function ChatCordApp() {
  const [messages, setMessages] = useState(initialMessages);
  const { activeProfile } = useUserProfileContext();

  const handleSend = (value: string) => {
    if (!activeProfile) return;

    const newMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: value,
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);

    // Simulate a bot response
    setTimeout(() => {
        const botMessage: Message = {
            id: String(Date.now()),
            role: "assistant",
            content: `Hello ${activeProfile.username}, you said: "${value}"`,
            createdAt: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="h-full w-full flex flex-col">
        <Chat
            messages={messages}
            user={{
                id: activeProfile?.id || 'user',
                name: activeProfile?.username || 'User',
                avatar: activeProfile?.avatarUrl || '',
            }}
            onSend={handleSend}
            >
            <ChatList />
            <ChatInput />
        </Chat>
    </div>
  );
}
