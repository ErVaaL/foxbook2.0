import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import axios from "axios";
import { API_ENDPOINTS, API_MESSAGES_BASE_URL } from "../../config";
import Loader from "../Loader";

type ChatWindowProps = {
  friend: {
    id: string;
    username: string;
    avatar: string;
  };
  onClose: () => void;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ friend, onClose }) => {
  const [message, setMessage] = useState("");
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!token || !friend.id) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_MESSAGES_BASE_URL}${API_ENDPOINTS.CONVERSATIONS(friend.id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch messages");
        const messages = response.data.messages;
        if (!messages) {
          setMessages([]);
        } else {
          setMessages(messages);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token, friend.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!token || !friend.id || !userId) return;
    const messageBody = {
      receiver_id: friend.id,
      sender_id: userId,
      content: message,
    };
    let newMessage: Message;
    try {
      const response = await axios.post(
        `${API_MESSAGES_BASE_URL}`,
        messageBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status !== 201) throw new Error("Failed to send message");
      newMessage = response.data.message;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
    } finally {
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4">
        <Loader size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-2/3 right-1/4 max-w-md mx-auto bg-white dark:bg-[#2a2a2a] shadow-lg p-4 rounded-lg w-96">
      <div className="flex justify-between items-center border-b pb-2">
        <div className="flex items-center gap-2">
          <img
            src={friend.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-xl font-bold dark:text-gray-300">
            @{friend.username}
          </h2>
        </div>
        <button className="text-red-500" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-2 flex flex-col space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-xs break-words rounded-lg shadow ${
                msg.sender_id === userId
                  ? "bg-orange-500 dark:bg-darkgoldenrod dark:text-white self-end"
                  : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start"
              }`}
            >
              {msg.content}
              <div className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t pt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
