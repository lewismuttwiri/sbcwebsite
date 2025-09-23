"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Loader2,
  RefreshCw,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useWebSocket, { ReadyState } from "react-use-websocket";
import React from "react";
// import { Message } from "@/components/ChatWidget";

interface Message {
  id: string;
  message: string;
  room_id: string;
  sender_name: string;
  sender_type: "customer" | "receptionist" | "system";
  timestamp: string;
}

interface ChatDetails {
  created_at: string;
  customer_email: string;
  customer_name: string;
  enquiry: string;
  id: string;
  is_active: boolean;
  receptionist: string;
}

interface ChatSocketMessage {
  room_id: string;
  id: string;
  type:
    | "chat_message"
    | "info"
    | "test"
    | "chat_closed"
    | "user_joined"
    | "user_left"
    | string;
  message?: string;
  sender_type?: "customer" | "receptionist" | "system";
  sender_name?: string;
  timestamp?: string;
  closed_by?: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isClosingChat, setIsClosingChat] = useState(false);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [shouldConnect, setShouldConnect] = useState(true);
  const [userRole, setUserRole] = useState<number | null>(null);

  const chatId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = localStorage.getItem("user");
        if (response) {
          setUserRole(JSON.parse(response).entity.user_role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) {
        setError("Chat ID not found");
        setIsLoading(false);
        return;
      }

      await loadChatHistory();
    };

    fetchChatData();
  }, [chatId]);

  const loadChatHistory = async () => {
    if (!chatId) return;

    setIsLoadingMessages(true);
    try {
      setError(null);
      console.log("Fetching chat data for chatId:", chatId);

      const [chatDataResponse, chatDetailsResponse] = await Promise.all([
        fetch(`/api/chat/${chatId}/`),
        fetch(`/api/chat/messages/${chatId}/`),
      ]);

      if (!chatDataResponse.ok || !chatDetailsResponse.ok) {
        if (
          chatDataResponse.status === 404 ||
          chatDetailsResponse.status === 404
        ) {
          throw new Error("Chat not found or has been deleted");
        }
        throw new Error(
          `Failed to fetch chat: ${chatDataResponse.status} ${chatDetailsResponse.status}`
        );
      }

      const chatData = await chatDataResponse.json();
      const chatDetails: ChatDetails[] = await chatDetailsResponse.json();
      console.log("Chat data received:", chatData);
      console.log("Chat details received:", chatDetails);

      setChatDetails(chatDetails[0]);
      console.log("Chat details set:", chatDetails);

      if (chatData.messages && Array.isArray(chatData.messages)) {
        setMessages(chatData.messages);
        console.log("Messages loaded:", chatData.messages.length);
      } else {
        setMessages([]);
        console.log("No messages found in chat data");
      }

      if (
        chatDetails[0].is_active &&
        (chatDetails[0].is_active || chatDetails[0].is_active === "expired")
      ) {
        setMessages((prev) => {
          const hasStatusMessage = prev.some(
            (msg) =>
              msg.sender_type === "system" &&
              msg.message.includes(
                chatDetails[0].is_active ? "closed" : "expired"
              )
          );

          if (hasStatusMessage) return prev;
          return [...prev];
        });
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setError(error instanceof Error ? error.message : "Failed to load chat");
    } finally {
      setIsLoading(false);
      setIsLoadingMessages(false);
    }
  };

  const handleCloseChat = async () => {
    if (!chatId) return;

    setIsClosingChat(true);

    try {
      setShouldConnect(false);

      localStorage.removeItem("chat_room");

      if (readyState === ReadyState.OPEN) {
        const closeMessage: ChatSocketMessage = {
          type: "chat_closed",
          message: "This chat has been closed by the support agent.",
          room_id: chatId,
          id: `close-${Date.now()}`,
          sender_type: "system",
          sender_name: "System",
          timestamp: new Date().toISOString(),
          closed_by: "support_agent",
        };
        sendMessage(JSON.stringify(closeMessage));
      }

      const closureMessage: Message = {
        sender_type: "system",
        sender_name: "System",
        message: "This chat has been closed by the support agent.",
        timestamp: new Date().toISOString(),
        id: `close-${Date.now()}`,
        room_id: chatId,
      };
      setMessages((prev) => [...prev, closureMessage]);

      const websocket = getWebSocket();
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close(
          1000,
          "This chat has been closed by the support agent."
        );
      }

      const response = await fetch(`/api/chat/close/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (chatDetails) {
        setChatDetails({
          ...chatDetails,
          is_active: false,
        });
      }

      console.log("Chat closed successfully");
    } catch (error) {
      console.error("Error closing chat:", error);
      setError("An error occurred while closing the chat. Please try again.");

      if (chatDetails?.is_active) {
        setShouldConnect(true);
      }
    } finally {
      setIsClosingChat(false);
      setShowCloseConfirmation(false);
    }
  };

  const socketUrl = React.useMemo(() => {
    if (!chatId || typeof window === "undefined") return null;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host =
      process.env.NODE_ENV === "production"
        ? window.location.host
        : "127.0.0.1:8000";

    const url = `${protocol}//${host}/ws/chat/${chatId}/`;
    console.log("Constructed WebSocket URL:", url);
    return url;
  }, [chatId]);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl && !isLoading && shouldConnect ? socketUrl : null,
    {
      shouldReconnect: (closeEvent) => {
        console.log("WebSocket reconnecting...", closeEvent);
        return shouldConnect && chatDetails?.is_active === true;
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
      const data: ChatSocketMessage = JSON.parse(lastMessage.data);
      console.log("📨 WebSocket message received in chat page:", data);

      switch (data.type) {
        case "chat_message":
          if (data.message && data.sender_type) {
            const newMessage: Message = {
              sender_type: data.sender_type,
              sender_name: chatDetails?.customer_name || "Unknown",
              message: data.message,
              timestamp: data.timestamp || new Date().toISOString(),
              id: data.id,
              room_id: data.room_id,
            };

            console.log("Adding new message:", newMessage);
            setMessages((prev) => [...prev, newMessage]);
          }
          break;

        case "chat_closed":
          // Disable reconnection when chat is closed
          setShouldConnect(false);

          const closureMessage: Message = {
            sender_type: "system",
            sender_name: "System",
            message: `Chat has been ${
              data.closed_by === "customer" ? "ended by the customer" : "closed"
            }.`,
            timestamp: data.timestamp || new Date().toISOString(),
            id: "",
            room_id: "",
          };

          setMessages((prev) => [...prev, closureMessage]);

          if (chatDetails) {
            setChatDetails({
              ...chatDetails,
              is_active: false,
            });
          }
          break;

        // ... rest of your cases remain the same
        case "info":
          console.log("Info message:", data.message);
          break;

        case "test":
          console.log("Test message received:", data.message);
          break;

        case "user_joined":
          console.log("User joined:", data.message);
          break;

        case "user_left":
          console.log("User left:", data.message);
          break;

        default:
          console.log("Unknown message type:", data.type, data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      console.log("Raw message data:", lastMessage.data);
    }
  }, [lastMessage, chatDetails]);

  useEffect(() => {
    const scrollableContainer =
      messagesEndRef.current?.closest(".overflow-y-auto");
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (
      !inputValue.trim() ||
      readyState !== ReadyState.OPEN ||
      !chatId ||
      chatDetails?.is_active !== true
    ) {
      console.log("Cannot send message:", {
        inputEmpty: !inputValue.trim(),
        notConnected: readyState !== ReadyState.OPEN,
        noChatId: !chatId,
        chatInactive: chatDetails?.is_active !== true,
      });
      return;
    }

    try {
      const messageData = {
        type: "chat_message",
        message: inputValue,
        sender_type: "receptionist" as const,
        sender_name: "Support Agent",
        timestamp: new Date().toISOString(),
      };

      sendMessage(JSON.stringify(messageData));
      setInputValue("");

      console.log("Message sent:", messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (chatDetails && !chatDetails.is_active) {
      setShouldConnect(false);
    }
  }, [chatDetails?.is_active]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRefreshMessages = () => {
    loadChatHistory();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 7 || userRole == null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">
            You are not authorized to view this chat.
          </p>
          <Button onClick={() => router.push("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error: {error}</p>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/chat")}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!chatDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="mb-4">Chat not found</p>
          <Button onClick={() => router.push("/chat")}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isActive = chatDetails.is_active === true;
  const isClosed = chatDetails.is_active === false;

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/chat")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold">
              {chatDetails.customer_name}
            </h1>
            {/* Status Indicator */}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : isClosed
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {isClosed && <UserX className="w-3 h-3 mr-1" />}
              {isActive ? "Active" : "Closed"}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Mail className="w-3 h-3 mr-1" />
            {chatDetails.customer_email}
          </div>

          {chatDetails.enquiry && (
            <p className="text-sm text-muted-foreground">
              <strong>Enquiry:</strong> {chatDetails.enquiry}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">
            Started: {formatDate(chatDetails.created_at)}
          </p>

          {isClosed && (
            <p className="text-xs text-muted-foreground">
              Closed: {chatDetails.is_active === false ? "Closed" : "Expired"}
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">
            {readyState === ReadyState.CONNECTING && "Connecting..."}
            {readyState === ReadyState.OPEN && "Connected"}
            {readyState === ReadyState.CLOSED && "Disconnected"}
            {readyState === ReadyState.CLOSING && "Disconnecting..."}
          </p>
          <p className="text-xs text-muted-foreground">
            Room: {chatId ? chatId.toString().slice(-8) : "N/A"}
          </p>
        </div>
      </div>

      <Card className="flex flex-col h-0 flex-1 min-h-0">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Chat Messages</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshMessages}
                disabled={isLoadingMessages}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${
                    isLoadingMessages ? "animate-spin" : ""
                  }`}
                />
                {isLoadingMessages ? "Loading..." : "Refresh"}
              </Button>

              {isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCloseConfirmation(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Close Chat
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-muted-foreground">Loading chat history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.length > 0 && (
                <div className="text-center py-2">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {messages.length} message{messages.length !== 1 ? "s" : ""}{" "}
                    loaded
                  </span>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={message.id || `${message.timestamp}-${index}`}
                  className={`flex ${
                    message.sender_type === "receptionist"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender_type === "receptionist"
                        ? "bg-primary text-primary-foreground"
                        : message.sender_type === "system"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200 text-center mx-auto"
                        : "bg-muted"
                    }`}
                    ref={messagesEndRef}
                  >
                    {message.sender_type !== "system" && (
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-medium opacity-70">
                          {message.sender_name}
                        </p>
                        <p className="text-xs opacity-70 ml-2">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    )}
                    <p className="text-sm">{message.message}</p>
                    {message.sender_type === "system" && (
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
          <div />
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isActive ? "Type your message..." : "Chat has ended"}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 cursor-pointer focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100"
              disabled={readyState !== ReadyState.OPEN || !isActive}
            />
            <button
              onClick={handleSendMessage}
              disabled={
                !inputValue.trim() ||
                readyState !== ReadyState.OPEN ||
                !isActive
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-4 py-3 transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {!isActive ? (
              isClosed ? (
                "Chat has been closed"
              ) : (
                "Chat has expired"
              )
            ) : (
              <>
                {readyState === ReadyState.CONNECTING && "Connecting..."}
                {readyState === ReadyState.OPEN &&
                  "Connected - Ready to send messages"}
                {readyState === ReadyState.CLOSED && "Disconnected"}
              </>
            )}
          </p>
        </div>
      </Card>

      {showCloseConfirmation && (
        <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-gray-200 rounded-lg p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Close Chat Session?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to close this chat? The customer will be
              notified and won't be able to send new messages. This action
              cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCloseConfirmation(false)}
                disabled={isClosingChat}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCloseChat}
                disabled={isClosingChat}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white"
              >
                {isClosingChat ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Closing...
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    Close Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
