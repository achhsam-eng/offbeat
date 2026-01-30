"use client";

import Link from "next/link";

export default function Messages() {
  // Mock conversation data
  const messages = [
    {
      id: 1,
      sender: "seller",
      name: "Alex",
      text: "Hey! Thanks for reserving the record. When works for you to meet up?",
      time: "2:15 PM",
    },
    {
      id: 2,
      sender: "buyer",
      name: "You",
      text: "Hi! I'm free this weekend. How about Saturday afternoon?",
      time: "2:18 PM",
    },
    {
      id: 3,
      sender: "seller",
      name: "Alex",
      text: "Saturday works! I can meet at the Reckless Records on Milwaukee around 3pm if that's good?",
      time: "2:22 PM",
    },
    {
      id: 4,
      sender: "buyer",
      name: "You",
      text: "Perfect! See you there at 3pm. I'll bring the pickup code.",
      time: "2:25 PM",
    },
    {
      id: 5,
      sender: "seller",
      name: "Alex",
      text: "Sounds good! I'll have the record ready. Looking forward to it 👍",
      time: "2:26 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-normal text-gray-900">Messages</h1>
        </div>
      </div>

      {/* Conversation Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-normal text-sm">A</span>
          </div>
          <div>
            <p className="font-normal text-gray-900">Alex</p>
            <p className="text-xs text-gray-500">Re: Slowdive - Souvlaki</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "buyer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 ${
                message.sender === "buyer"
                  ? "text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
              style={
                message.sender === "buyer" ? { backgroundColor: "#2274A5" } : {}
              }
            >
              <p className="text-sm font-normal">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "buyer" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}

        {/* Pickup Code Reminder */}
        <div className="bg-white border border-gray-200 p-4 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-lg">ℹ️</span>
            <div>
              <p className="text-sm font-normal text-gray-900 mb-2">
                Don't forget your pickup code
              </p>
              <p className="text-sm text-gray-600 mb-3 font-normal">
                Show this code to the seller when you meet to complete the
                transaction.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-3 inline-block">
                <p className="text-xs text-gray-500 mb-1">Your code</p>
                <p className="text-lg font-mono font-normal text-gray-900 tracking-wider">
                  ABC123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 text-gray-900 text-sm"
            />
            <button
              className="text-white px-6 py-2 font-normal hover:opacity-90 transition text-sm"
              style={{ backgroundColor: "#2274A5" }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-gray-800"
        style={{ backgroundColor: "#1E1E1E" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-gray-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs font-normal">Home</span>
            </Link>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-normal">Sell</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="text-xs font-normal">Messages</span>
            </button>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 text-gray-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-normal">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
