"use client";

import { useState } from "react";
import Link from "next/link";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("reserved");

  // Mock reservation data
  const reservations = [
    {
      id: 1,
      title: "Slowdive - Souvlaki",
      code: "ABC123",
      pickup: "Saturday 3pm @ Reckless Records",
      status: "confirmed",
      image: "/albums/3.jpg",
    },
    {
      id: 2,
      title: "My Bloody Valentine - Loveless",
      code: "XYZ789",
      pickup: "Pending coordination",
      status: "pending",
      image: "/albums/1.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/">
            <h1 className="text-2xl font-normal cursor-pointer text-gray-900">
              OFF/BEAT
            </h1>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-gray-600 font-normal">Y</span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-normal text-gray-900 mb-2">You</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-normal">12 Transactions</span>
                <span>·</span>
                <span>Joined 2024</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="px-4 py-2 border border-gray-300 text-sm font-normal text-gray-700 hover:bg-gray-50 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tab Menu */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("reserved")}
              className={`py-3 border-b-2 font-normal text-sm transition ${
                activeTab === "reserved"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reserved
            </button>
            <button
              onClick={() => setActiveTab("collection")}
              className={`py-3 border-b-2 font-normal text-sm transition ${
                activeTab === "collection"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`py-3 border-b-2 font-normal text-sm transition ${
                activeTab === "wishlist"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 border-b-2 font-normal text-sm transition ${
                activeTab === "history"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "reserved" && (
          <div className="space-y-6">
            <h3 className="text-base font-normal text-gray-500 mb-6">
              Active Reservations
            </h3>

            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white border border-gray-200 p-6"
              >
                <div className="flex gap-6">
                  {/* Album Cover */}
                  <img
                    src={reservation.image}
                    alt={reservation.title}
                    className="w-24 h-24 object-cover flex-shrink-0 rounded-lg"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="font-normal text-gray-900 mb-3 text-base">
                      {reservation.title}
                    </h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Code</span>
                        <span className="font-mono font-normal text-gray-900 bg-gray-100 px-2 py-1">
                          {reservation.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Pickup</span>
                        <span className="text-gray-900 font-normal">
                          {reservation.pickup}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-normal ${
                            reservation.status === "confirmed"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {reservation.status === "confirmed"
                            ? "Confirmed"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/messages"
                      className="px-6 py-2 text-white text-sm font-normal hover:opacity-90 transition text-center"
                      style={{ backgroundColor: "#2274A5" }}
                    >
                      Messages
                    </Link>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-normal hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "collection" && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">Your collection is empty</p>
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Browse records
            </Link>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">Your wishlist is empty</p>
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Browse records
            </Link>
          </div>
        )}

        {activeTab === "history" && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No transaction history yet</p>
          </div>
        )}
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
            <Link
              href="/messages"
              className="flex flex-col items-center gap-1 text-gray-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="text-xs font-normal">Messages</span>
            </Link>
            <button className="flex flex-col items-center gap-1 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-normal">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
