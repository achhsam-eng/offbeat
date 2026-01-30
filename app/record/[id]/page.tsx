"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface RecordData {
  title: string;
  year: number;
  format: string[];
  coverImage: string;
  label: string;
  country: string;
  genre: string[];
  style: string[];
  wantCount: number;
  haveCount: number;
  lowestPrice: number | null;
  numForSale: number;
}

interface ApiResponse {
  success: boolean;
  record: RecordData;
  explanation: string;
  error?: string;
}

export default function RecordDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [reservationCode, setReservationCode] = useState("");

  // Get the title from URL params
  const recordTitle = searchParams.get("title") || "Radiohead OK Computer";

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch("/api/analyze-record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: recordTitle }),
        });

        const result = await response.json();

        if (result.success) {
          setData(result);
        } else {
          setError(result.error || "Failed to load record");
        }
      } catch (err) {
        setError("Failed to load record");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordTitle]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleReserve = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReservationCode(code);
    setIsReserved(true);
    setShowReserveModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { record, explanation } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/">
            <h1 className="text-3xl font-bold mb-4 cursor-pointer text-gray-900">
              OFF/BEAT
            </h1>
          </Link>

          <div className="relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>
        </div>
      </div>

      {/* Record Image and Details - Two Column Layout on Desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className="bg-white rounded-lg overflow-hidden">
            <img
              src={record.coverImage}
              alt={record.title}
              className="w-full h-auto"
            />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-normal mb-3 text-gray-900">
                {record.title}
              </h1>

              {record.lowestPrice && (
                <p className="text-2xl font-normal text-gray-900">
                  ${record.lowestPrice}
                </p>
              )}
            </div>

            {/* Record Details - Minimal */}
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500">Year</span>
                <span className="text-gray-900">{record.year}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500">Label</span>
                <span className="text-gray-900">{record.label}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500">Format</span>
                <span className="text-gray-900">
                  {record.format?.join(", ")}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500">Country</span>
                <span className="text-gray-900">{record.country}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500">Genre</span>
                <span className="text-gray-900">
                  {record.genre?.join(", ")}
                </span>
              </div>
            </div>

            {/* Community Stats - Minimal */}
            <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <span className="text-gray-500">Community</span>
                <span className="text-gray-900">
                  {record.haveCount.toLocaleString()} own ·{" "}
                  {record.wantCount.toLocaleString()} want
                </span>
              </div>
              {record.numForSale > 0 && (
                <div className="flex gap-2">
                  <span className="text-gray-500">Available</span>
                  <span className="text-gray-900">
                    {record.numForSale} for sale
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleReserve}
                disabled={isReserved}
                className={`w-full ${
                  isReserved
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:opacity-90"
                } text-white py-4 font-medium transition text-base`}
                style={!isReserved ? { backgroundColor: "#2274A5" } : {}}
              >
                {isReserved ? "Reserved" : "Reserve"}
              </button>
              <button
                className="w-full bg-white border-2 py-4 font-medium hover:bg-gray-50 transition text-base"
                style={{ borderColor: "#2274A5", color: "#2274A5" }}
              >
                Offer
              </button>
            </div>

            {/* Seller Description - Minimal */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm text-gray-500 mb-2">Seller Description</h3>
              <p className="text-gray-900 text-sm leading-relaxed font-normal">
                Moderate wear and surface noise. Clean labels. Ships within 2
                business days.
              </p>
            </div>

            {/* Seller Info - Minimal */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">User</p>
                  <p className="text-xs text-gray-500">12 transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Market Insights - Minimal Full Width */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 border-t border-gray-200 pt-8">
        <div className="max-w-3xl">
          <h2 className="text-sm text-gray-500 mb-4">Market Insights</h2>
          <p className="text-gray-900 text-sm leading-relaxed font-normal">
            {explanation}
          </p>
        </div>
      </div>
      {/* Reserve Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Record Reserved! 🎉
            </h3>
            <p className="text-gray-700 mb-4">
              The seller has been notified. Check your messages to coordinate
              pickup.
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your pickup code:</p>
              <p className="text-3xl font-bold text-gray-900 tracking-wider">
                {reservationCode}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Show this code to the seller when you meet
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowReserveModal(false)}
                className="bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
              <Link
                href="/messages"
                className="bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-center"
              >
                View Messages
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-gray-800"
        style={{ backgroundColor: "#1E1E1E" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-4 py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">Sell</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="text-xs font-medium">Messages</span>
            </button>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 text-gray-400"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
