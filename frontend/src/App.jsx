import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mobileViewMode, setMobileViewMode] = useState("sidebar"); // "sidebar" or "chat"

  const API_BASE = "http://localhost:5000/api";

  const fetchChats = () => {
    axios
      .get(`${API_BASE}/messages`)
      .then((res) => {
        setChats(res.data);
        // Auto-select first chat if none selected (desktop experience)
        if (!selectedId && res.data.length > 0) {
          setSelectedId(res.data[0].wa_id);
        }
      })
      .catch((err) => console.error("Error fetching chats:", err));
  };

  const fetchMessages = (wa_id) => {
    axios
      .get(`${API_BASE}/messages/${wa_id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
      setMobileViewMode("chat");
    }
  }, [selectedId]);

  const handleSelectChat = (id) => {
    setSelectedId(id);
    setMobileViewMode("chat");
  };

  const handleSend = (wa_id, text) => {
    if (!text.trim()) return;

    const chatObj = chats.find((c) => c.wa_id === wa_id);
    const name = chatObj?.name || "unknown";

    axios
      .post(`${API_BASE}/messages`, {
        wa_id,
        message: text,
        from_me: true,
        name,
      })
      .then((res) => {
        const newMsg = res.data;
        setMessages((prev) => [...prev, newMsg]);
        fetchChats();
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex flex-1">
        {/* Sidebar (1/3) */}
        <div className="w-1/3 border-r bg-gray-100 overflow-y-auto">
          <Sidebar
            chats={chats}
            onSelect={handleSelectChat}
            selectedId={selectedId}
          />
        </div>

        {/* Chat Window (2/3) */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedId ? (
            <ChatWindow
              chat={{ wa_id: selectedId, messages }}
              onSend={handleSend}
              onBack={() => setMobileViewMode("sidebar")}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`
          bg-gray-100 border-r overflow-y-auto md:hidden
          fixed inset-y-0 left-0 z-30 w-full
          transform transition-transform duration-300 ease-in-out
          ${mobileViewMode === "sidebar" ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          chats={chats}
          onSelect={handleSelectChat}
          selectedId={selectedId}
        />
      </div>

      {/* MOBILE CHAT WINDOW */}
      <div
        className={`
          fixed inset-0 z-20 bg-white md:hidden
          flex flex-col h-full w-full
          transform transition-transform duration-300 ease-in-out
          ${mobileViewMode === "chat" ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <ChatWindow
          chat={{ wa_id: selectedId, messages }}
          onSend={handleSend}
          onBack={() => setMobileViewMode("sidebar")}
        />
      </div>
    </div>
  );
}
