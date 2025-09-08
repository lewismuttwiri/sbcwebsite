// components/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  CiUser,
  CiChat2,
  CiMail,
  CiClock1,
  CiCircleCheck,
} from "react-icons/ci";
import { IoIosArrowRoundForward, IoIosRefresh } from "react-icons/io";
import { RiLoader3Line } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { FiMinimize2, FiX } from "react-icons/fi";
import Image from "next/image";

export interface Message {
  sender_type: "customer" | "receptionist" | "system";
  sender_name: string;
  content: string;
  timestamp: string;
}

interface ChatWidgetProps {
  customerName?: string;
  customerEmail?: string;
}

type ChatState = "closed" | "welcome" | "form" | "chat";

const ChatWidget: React.FC<ChatWidgetProps> = ({
  customerName = "",
  customerEmail = "",
}) => {
  const [chatState, setChatState] = useState<ChatState>("closed");
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isClosingChat, setIsClosingChat] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: customerName,
    email: customerEmail,
    enquiry: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadChatHistory = async (roomId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/chat/${roomId}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Chat history loaded:", data.messages);

        if (data.messages && Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((message: any) => ({
              sender_type: message.sender_type,
              sender_name: message.sender_name,
              content: message.message,
              timestamp: message.timestamp,
            }))
          );
        }

        if (data.messages) {
          setCustomerInfo((prev) => ({
            ...prev,
            name: data.messages.customer_name || prev.name,
            email: data.messages.customer_email || prev.email,
            enquiry: data.messages.enquiry || prev.enquiry,
          }));
        }
      } else if (response.status === 404) {
        console.log("Chat room not found or expired");
        setRoomId(null);
        setChatState("welcome");
        const url = new URL(window.location.href);
        url.searchParams.delete("chat_room");
        window.history.replaceState({}, "", url.toString());
      } else {
        console.error("Failed to load chat history:", response.status);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const apiUrl = process.env.NEXT_PUBLIC_HOST_URL;
  const socketUrl = React.useMemo(() => {
    if (!roomId) return null;
    const host =
      process.env.NODE_ENV === "production"
        ? window.location.host
        : "127.0.0.1:8000";
    const url = new URL(`${protocol}//${host}/ws/chat/${roomId}/`);
    console.log("Constructed WebSocket URL:", url.toString());
    return url.toString();
  }, [roomId]);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: (closeEvent) => {
        console.log("WebSocket reconnecting...", closeEvent);
        return true;
      },
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      onOpen: (event: Event) => {
        console.log("✅ WebSocket connection opened", {
          url: socketUrl,
          readyState: ReadyState.OPEN,
          timestamp: new Date().toISOString(),
        });
      },
      onError: (event: Event) => {
        console.error("❌ WebSocket error:", {
          type: event.type,
          url: socketUrl,
          readyState: readyState,
          timestamp: new Date().toISOString(),
        });
      },
      onClose: (event: CloseEvent) => {
        console.log("🔌 WebSocket connection closed:", {
          wasClean: event.wasClean,
          code: event.code,
          reason: event.reason,
          timestamp: new Date().toISOString(),
        });
      },
    }
  );

  useEffect(() => {
    if (!lastMessage?.data) return;

    try {
      const data = JSON.parse(lastMessage.data);
      console.log("📨 WebSocket message received in chat widget:", data);

      if (data.type === "chat_message" && data.message) {
        const newMessage: Message = {
          sender_type: data.sender_type || "system",
          sender_name: data.sender_name || "Unknown",
          content: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
      } else if (data.type === "test") {
        console.log("Test message received:", data.message);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      console.log("Raw message data:", lastMessage.data);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (roomId && chatState === "chat") {
      const url = new URL(window.location.href);
      url.searchParams.set("chat_room", roomId);
      window.history.replaceState({}, "", url.toString());
    }
  }, [roomId, chatState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createChatRoom = async () => {
    setIsLoading(true);

    const body = {
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      enquiry: customerInfo.enquiry,
    };

    console.log("Chat request:", body);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return console.error("Failed to create chat room", response.status);
      }

      const data = await response.json();
      console.log("Chat room created:", data);
      setRoomId(data.room_id);
      setChatState("chat");

      setMessages([
        {
          sender_type: "system",
          sender_name: "System",
          content:
            "Welcome! A customer service representative will be with you shortly.",
          timestamp: new Date().toISOString(),
        },
      ]);

      localStorage.setItem("chat_room", data.room_id);
    } catch (error) {
      console.error("Error creating chat room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || readyState !== ReadyState.OPEN || !roomId) {
      console.log("Cannot send message:", {
        inputEmpty: !inputValue.trim(),
        notConnected: readyState !== ReadyState.OPEN,
        noRoomId: !roomId,
      });
      return;
    }

    try {
      const messageData = {
        type: "chat_message",
        message: inputValue,
        sender_type: "customer",
        sender_name: customerInfo.name,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending message:", messageData);
      sendMessage(JSON.stringify(messageData));
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWelcomeScreen = () => {
    const existingRoomId = localStorage.getItem("chat_room");
    if (existingRoomId) {
      setRoomId(existingRoomId);
      setChatState("chat");
      loadChatHistory(existingRoomId);
      return;
    } else {
      setChatState("welcome");
    }
  };

  const handleStartChat = () => {
    if (customerName && customerEmail) {
      createChatRoom();
    } else {
      setChatState("form");
    }
  };

  const handleCustomerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.name.trim() && customerInfo.email.trim()) {
      createChatRoom();
    }
  };

  const handleRefreshMessages = () => {
    if (roomId) {
      loadChatHistory(roomId);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-[#0E0E96] rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <Image
            src="/images/logo/pepsi_logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Support
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Get instant help from our customer service team.
          <br />
          We typically respond within minutes.
        </p>
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center text-sm text-gray-500 justify-center">
          <CiCircleCheck className="w-4 h-4 text-green-500 mr-2" />
          Live chat support
        </div>
        <div className="flex items-center text-sm text-gray-500 justify-center">
          <CiClock1 className="w-4 h-4 text-blue-500 mr-2" />
          Average response time: 2 minutes
        </div>
      </div>

      <button
        onClick={handleStartChat}
        className="w-full bg-[#0E0E96] hover:bg-blue-800 text-white rounded-lg py-4 px-6 mt-8 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
      >
        <span className="font-semibold">Start New Chat</span>
        <IoIosArrowRoundForward className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderCustomerForm = () => (
    <div className="flex flex-col h-full scroll-y overflow-y-auto ">
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Let's get started
        </h2>
        <p className="text-sm text-gray-600">
          Please provide your details to begin the conversation
        </p>
      </div>

      <form
        onSubmit={handleCustomerFormSubmit}
        className="flex flex-col flex-1 p-6"
      >
        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CiUser className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CiMail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CiChat2 className="w-4 h-4 inline mr-2" />
              How can we help?
            </label>
            <textarea
              value={customerInfo.enquiry}
              onChange={(e) =>
                setCustomerInfo((prev) => ({
                  ...prev,
                  enquiry: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Briefly describe your question or issue..."
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="submit"
            disabled={
              !customerInfo.name.trim() ||
              !customerInfo.email.trim() ||
              !customerInfo.enquiry.trim() ||
              isLoading
            }
            className="w-full bg-[#0E0E96] hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-lg py-3 px-4 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <RiLoader3Line className="w-5 h-5 animate-spin mr-2" />
                Starting Chat...
              </>
            ) : (
              <>
                Start Chat
                <AiOutlineSend className="w-5 h-5 ml-2" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setChatState("welcome")}
            className="w-full border border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header with Refresh Button */}
      {roomId && (
        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Room ID: {roomId.slice(-8)}
          </span>
          <button
            onClick={handleRefreshMessages}
            disabled={isLoadingMessages}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center transition-colors"
          >
            <IoIosRefresh
              className={`w-3 h-3 mr-1 ${
                isLoadingMessages ? "animate-spin" : ""
              }`}
            />
            {isLoadingMessages ? "Loading..." : "Refresh"}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoadingMessages && messages.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center text-gray-500">
              <RiLoader3Line className="w-5 h-5 animate-spin mr-2" />
              Loading chat history...
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.timestamp}-${index}`}
            className={`flex ${
              message.sender_type === "customer"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                message.sender_type === "customer"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : message.sender_type === "system"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800 text-center mx-auto"
                  : "bg-white text-gray-800 rounded-bl-md border"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-1 opacity-70 ${
                  message.sender_type === "customer"
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={readyState !== ReadyState.OPEN}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || readyState !== ReadyState.OPEN}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-4 py-3 transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            <AiOutlineSend className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {readyState === ReadyState.CONNECTING && "Connecting..."}
          {readyState === ReadyState.OPEN && "Connected"}
          {readyState === ReadyState.CLOSED && "Disconnected"}
        </p>
      </div>
    </div>
  );

  function handleCloseChat(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    // Send a chat_closed message before closing
    if (readyState === ReadyState.OPEN && roomId) {
      const closeMessage = {
        type: "chat_closed",
        message: "Chat has been closed by the customer.",
        room_id: roomId,
        sender_type: "system",
        sender_name: "System",
        timestamp: new Date().toISOString(),
        closed_by: "customer",
      };
      sendMessage(JSON.stringify(closeMessage));

      // Close the WebSocket connection
      const ws = getWebSocket();
      if (ws) {
        ws.close(1000, "Chat closed by user");
      }
    }

    // Update UI state
    setIsClosingChat(true);
    setShowCloseConfirmation(false);
    setMessages([]);
    setCustomerInfo({
      name: customerName,
      email: customerEmail,
      enquiry: "",
    });
    localStorage.removeItem("chat_room");
    setRoomId(null);
    setChatState("closed");
  }

  return (
    <>
      {/* Chat Button - only shows when closed */}
      {chatState === "closed" && (
        <div className="fixed bottom-4 right-4 z-[9998]">
          <button
            onClick={() => handleWelcomeScreen()}
            className="bg-gradient-to-r from-[#0E0E96] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 group"
            aria-label="Open chat"
          >
            <CiChat2
              className="group-hover:scale-110 transition-transform"
              size={24}
            />
          </button>
        </div>
      )}

      {chatState !== "closed" && (
        <>
          {/* Mobile Full Screen Overlay */}
          <div className="md:hidden fixed inset-0 z-[9999] bg-white">
            <div className="flex flex-col h-[90vh]">
              <div className="relative z-[10000] border-b border-gray-200 bg-[#0E0E96] text-white py-4 px-5 flex justify-between items-center shadow-lg">
                <div>
                  <h3 className="font-semibold text-lg">Customer Support</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    {readyState === ReadyState.OPEN
                      ? "Online"
                      : "Connecting..."}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setChatState("closed")}
                    className="hover:bg-blue-500/20 p-2 rounded-lg transition-colors touch-manipulation"
                    aria-label="Close chat"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {chatState === "welcome" && renderWelcomeScreen()}
                {chatState === "form" && renderCustomerForm()}
                {chatState === "chat" && renderChat()}
              </div>
            </div>
          </div>

          {/* Desktop Floating Widget */}
          <div className="hidden md:block fixed bottom-4 right-4 z-[9999]">
            <div
              className={`bg-white rounded-xl shadow-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
                isMinimized
                  ? "h-14 w-80"
                  : "h-[576px] w-[26rem] lg:h-[576px] lg:w-[28rem]"
              }`}
            >
              <div className="relative z-[10000] border-b border-gray-200 bg-[#0E0E96] text-white py-4 px-5 flex justify-between items-center shadow-lg">
                <div>
                  <h3 className="font-semibold text-lg">
                    Customer Support full
                  </h3>
                  {!isMinimized && (
                    <p className="text-blue-100 text-sm opacity-90">
                      {readyState === ReadyState.OPEN
                        ? "Online"
                        : "Connecting..."}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                    aria-label="Minimize chat"
                  >
                    <FiMinimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setChatState("closed")}
                    className="hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                    aria-label="Close chat"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop Content */}
              {!isMinimized && (
                <div className="flex-1 overflow-hidden">
                  {chatState === "welcome" && renderWelcomeScreen()}
                  {chatState === "form" && renderCustomerForm()}
                  {chatState === "chat" && renderChat()}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Close Chat Confirmation Modal with highest z-index */}
      {showCloseConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001]">
          <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              End Chat Session?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to end this chat? This action cannot be
              undone, and you'll need to start a new chat for further
              assistance.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCloseConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isClosingChat}
              >
                Cancel
              </button>
              <button
                onClick={handleCloseChat}
                disabled={isClosingChat}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {isClosingChat ? (
                  <>
                    <RiLoader3Line className="w-4 h-4 animate-spin mr-2" />
                    Ending...
                  </>
                ) : (
                  "End Chat"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
