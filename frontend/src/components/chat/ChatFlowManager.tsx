"use client";

import React, { useState, useEffect } from "react";
import { Message } from "../ChatWidget";
import WelcomeChatFlow from "./WelcomeChatFlow";

interface ChatFlowManagerProps {
  customerName: string;
  customerEmail: string;
  onSendMessage: (message: string) => void;
  onTransferToAgent: () => void;
  isBotMode: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatFlowManager: React.FC<ChatFlowManagerProps> = ({
  customerName,
  customerEmail,
  onSendMessage,
  onTransferToAgent,
  isBotMode,
  messages,
  setMessages,
}) => {
  // Handle welcome screen option selection
  const handleOptionSelect = (option: any) => {
    const userMessage: Message = {
      sender_type: "customer",
      sender_name: customerName || "Guest",
      content: option.title,
      timestamp: new Date().toISOString(),
    };

    const botResponse: Message = {
      sender_type: "receptionist",
      sender_name: "Chat Bot",
      content: option.response,
      timestamp: new Date().toISOString(),
    };

    const satisfactionMessage: Message = {
      sender_type: "system",
      sender_name: "System",
      content: "satisfaction-check",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      botResponse,
      satisfactionMessage,
    ]);

    if (option.action) {
      option.action();
    }
  };

  // Handle satisfaction response
  const handleSatisfactionResponse = (isSatisfied: boolean) => {
    const responseMessage: Message = {
      sender_type: "receptionist",
      sender_name: isBotMode ? "Chat Bot" : "Support Agent",
      content: isSatisfied
        ? "Great! Is there anything else I can help you with?"
        : "I'll connect you with a support agent who can assist you further. Please wait a moment...",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, responseMessage]);

    if (!isSatisfied) {
      // Show a small delay before transferring to agent
      setTimeout(() => {
        onTransferToAgent();
      }, 1500);
    }
  };

  // Handle incoming messages and check for satisfaction check
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content === "satisfaction-check") {
      // Show satisfaction buttons
      const buttons = (
        <div className="flex space-x-3 mt-2">
          <button
            onClick={() => handleSatisfactionResponse(true)}
            className="px-4 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            Yes, that helps!
          </button>
          <button
            onClick={() => handleSatisfactionResponse(false)}
            className="px-4 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            No, I need more help
          </button>
        </div>
      );

      // Add buttons to the last message
      const updatedMessages = [...messages];
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        buttons,
      };
      setMessages(updatedMessages);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {isBotMode && messages.length === 0 ? (
        <WelcomeChatFlow onSelect={handleOptionSelect} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender_type === "customer" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender_type === "customer"
                    ? "bg-blue-500 text-white"
                    : msg.sender_type === "system"
                    ? "bg-yellow-50 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {msg.sender_name}
                </div>
                <div className="text-sm">{msg.content}</div>
                {msg.buttons}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatFlowManager;
