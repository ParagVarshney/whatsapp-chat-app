import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ chat, onSend, onBack }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  if (!chat || !chat.wa_id) {
    return (
      <div className="w-full flex items-center justify-center text-gray-500 h-full">
        Select a chat to start messaging
      </div>
    );
  }

  const handleSend = () => {
    if (message.trim()) {
      onSend(chat.wa_id, message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      
      <div className="p-2 border-b bg-white md:hidden">
        <button
          onClick={onBack}
          className="text-green-600 font-semibold hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ minHeight: 0 }}
      >
        {(chat.messages || []).map((msg) => (
          <MessageBubble key={msg.msg_id || msg._id} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:border-green-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
