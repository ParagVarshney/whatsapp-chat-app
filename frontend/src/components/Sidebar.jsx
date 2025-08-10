import React from "react";

export default function Sidebar({ chats, onSelect, selectedId, className = "" }) {
  return (
    <div
      className={`bg-gray-100 border-r overflow-y-auto w-full md:w-1/3 h-full ${className}`}
    >
      <h2 className="p-4 text-xl font-semibold border-b">Chats</h2>
      {chats.length === 0 ? (
        <div className="p-4 text-gray-500">No chats available</div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id || chat.wa_id}
            onClick={() => onSelect(chat.wa_id)}
            className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors ${
              selectedId === chat.wa_id ? "bg-blue-200 font-bold" : ""
            }`}
          >
            <div>{chat?.name || "Unknown"}</div>
            <div className="text-sm text-gray-500 truncate">
              {chat.wa_id || "Unknown ID"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
