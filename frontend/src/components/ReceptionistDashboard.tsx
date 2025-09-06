"use client";

import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Bell, MessageSquare } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ChatNotification {
  room_id: string;
  customer_name: string;
  customer_email: string;
}

const ReceptionistDashboard: React.FC = () => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);

  const { lastMessage } = useWebSocket("ws://localhost:8000/ws/receptionist/", {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === "new_chat_notification") {
        setNotifications((prev) => [
          ...prev,
          {
            room_id: data.room_id,
            customer_name: data.customer_name,
            customer_email: data.customer_email,
          },
        ]);

        // Show browser notification
        if (Notification.permission === "granted") {
          new Notification("New Chat Request", {
            body: `${data.customer_name} has started a new chat`,
            icon: "/chat-icon.png",
          });
        }
      }
    }
  }, [lastMessage]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleJoinChat = (roomId: string) => {
    localStorage.setItem("room_id", roomId);
    window.open(`/receptionist/chat/${roomId}`, "_blank");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Receptionist Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Bell className="mr-2" />
          <h2 className="text-lg font-semibold">
            New Chat Requests ({notifications.length})
          </h2>
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500">No new chat requests</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {notification.customer_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {notification.customer_email}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinChat(notification.room_id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <MessageSquare className="mr-2" size={16} />
                  Join Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
