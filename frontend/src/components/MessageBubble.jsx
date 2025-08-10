import React from "react";

export default function MessageBubble({ message, timestamp, from_me, status }) {
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${from_me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs break-words p-3 m-1 rounded-lg shadow ${
          from_me ? "bg-green-200 text-right" : "bg-white text-left"
        }`}
      >
        <div>{message}</div>
        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between gap-2">
          <span>{formatTime(timestamp)}</span>
          {from_me && <span>✓ {status || "sent"}</span>}
        </div>
      </div>
    </div>
  );
}
