"use client";

import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface ChatSignalRProps {
  senderId: string; // Current user's userId
  receiverId: string; // The userId of the person they're chatting with
}

interface Message {
  id?: string;
  senderId: string;
  recipientId: string;
  content: string;
  timeSent: string;
}

const ChatSignalR: React.FC<ChatSignalRProps> = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Establish SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found in localStorage.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/chathub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [senderId, receiverId]);

  // Start SignalR connection and set up listeners
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("SignalR connected.");
        const groupName = `chat-${senderId}-${receiverId}`;
        connection.invoke("JoinGroup", groupName);

        connection.on("ReceiveMessage", (messageJson: string) => {
          try {
            // Parse the incoming message
            const message = JSON.parse(messageJson) as Message;
            setMessages((prev) => [...prev, message]);
          } catch (error) {
            console.error("Failed to parse incoming message. Ensure the backend sends valid JSON:", messageJson);
          }
        });

        connection.onclose((error) => {
          console.error("Connection closed:", error);
        });

        connection.onreconnecting((error) => {
          console.warn("Reconnecting:", error);
        });

        connection.onreconnected((connectionId) => {
          console.log("Reconnected with connectionId:", connectionId);
        });
      })
      .catch((error) => console.error("SignalR connection failed:", error));

    return () => {
      connection.stop().then(() => console.log("SignalR connection stopped."));
    };
  }, [connection, senderId, receiverId]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/chats/message-history/${senderId}/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: Message[] = await response.json();
          setMessages(data);
        } else {
          console.error("Failed to fetch message history");
        }
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  // Scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMsg.trim() || !connection) {
      console.warn("Message is empty or connection is not established.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found in localStorage.");
      return;
    }

    try {
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/chats/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          StudentId: senderId,
          ExpertId: receiverId,
          Message: newMsg,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // The new message object from the server
        setMessages((prev) => [...prev, data]);
        setNewMsg("");

        const groupName = `chat-${senderId}-${receiverId}`;
        await connection.invoke("SendMessageToGroup", groupName, JSON.stringify(data));
      } else {
        console.error("Failed to send message to DB");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold text-green-400 mb-2">Chat</h2>
      <div ref={chatContainerRef} className="mb-4 h-64 overflow-y-auto bg-gray-900 p-4 rounded">
  {messages.map((msg, index) => {
    const isSelf = msg.senderId === senderId;
    const formattedDate =
      msg.timeSent && !isNaN(new Date(msg.timeSent).getTime())
        ? new Date(msg.timeSent).toLocaleString()
        : "Invalid Date";

    return (
      <div
        key={index}
        className={`mb-2 flex ${isSelf ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`p-2 rounded-lg max-w-xs ${
            isSelf ? "bg-green-600 text-white" : "bg-gray-700 text-white"
          }`}
        >
          <p>{msg.content}</p>
          <div className="text-xs text-gray-300 mt-1">{formattedDate}</div>
        </div>
      </div>
    );
  })}
</div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSignalR;
