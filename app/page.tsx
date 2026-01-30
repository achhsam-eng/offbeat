"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Record {
  id: number;
  title: string;
  price: number;
  condition: string;
  pressing: string;
  image: string;
}

// Mock data as fallback
const mockRecords: Record[] = [
  {
    id: 1,
    title: "My Bloody Valentine - Loveless",
    price: 38,
    condition: "VG+",
    pressing: "Creation, 1991",
    image: "/albums/1.jpg",
  },
  {
    id: 2,
    title: "Dean Blunt, Elias Rønnenfelt - lucre",
    price: 28,
    condition: "NM",
    pressing: "Rough Trade, 2024",
    image: "/albums/2.jpg",
  },
  {
    id: 3,
    title: "Slowdive - Souvlaki",
    price: 42,
    condition: "NM",
    pressing: "Creation, 1993",
    image: "/albums/3.jpg",
  },
  {
    id: 4,
    title: "MIKE - Showbiz!",
    price: 32,
    condition: "NM",
    pressing: "10k, 2023",
    image: "/albums/4.jpg",
  },
  {
    id: 5,
    title: "The Cure - Disintegration",
    price: 35,
    condition: "VG+",
    pressing: "Fiction, 1989",
    image: "/albums/5.jpg",
  },
  {
    id: 6,
    title: "Niontay - Fada<3of$",
    price: 25,
    condition: "NM",
    pressing: "Self-Released, 2024",
    image: "/albums/6.jpg",
  },
  {
    id: 7,
    title: "Sonic Youth - Daydream Nation",
    price: 45,
    condition: "VG",
    pressing: "Enigma, 1988",
    image: "/albums/7.jpg",
  },
  {
    id: 8,
    title: "Winter - Adult Romantix",
    price: 26,
    condition: "VG+",
    pressing: "Bar/None, 2025",
    image: "/albums/8.jpg",
  },
  {
    id: 9,
    title: "Pavement - Crooked Rain, Crooked Rain",
    price: 32,
    condition: "NM",
    pressing: "Matador, 1994",
    image: "/albums/9.jpg",
  },
  {
    id: 10,
    title: "Moin - Belly Up",
    price: 29,
    condition: "NM",
    pressing: "AD 93, 2024",
    image: "/albums/10.jpg",
  },
  {
    id: 11,
    title: "Joanne Robertson - Blurrr",
    price: 34,
    condition: "VG+",
    pressing: "Honest Jon's, 2024",
    image: "/albums/11.jpg",
  },
  {
    id: 12,
    title: "Modest Mouse - The Lonesome Crowded West",
    price: 35,
    condition: "NM",
    pressing: "Up Records, 1997",
    image: "/albums/12.jpg",
  },
  {
    id: 13,
    title: "Oklou - choke enough",
    price: 27,
    condition: "NM",
    pressing: "True Panther, 2024",
    image: "/albums/13.jpg",
  },
  {
    id: 14,
    title: "Built To Spill - Perfect From Now On",
    price: 28,
    condition: "VG+",
    pressing: "Up Records, 1997",
    image: "/albums/14.jpg",
  },
  {
    id: 15,
    title: "Jim Legxacy - black british music",
    price: 30,
    condition: "NM",
    pressing: "Self-Released, 2024",
    image: "/albums/15.jpg",
  },
  {
    id: 16,
    title: "Dinosaur Jr. - You're Living All Over Me",
    price: 40,
    condition: "VG+",
    pressing: "SST, 1987",
    image: "/albums/16.jpg",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<Record[]>(mockRecords);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Auto-search if URL has search parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get("search");

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      handleSearchFromUrl(searchFromUrl);
    }
  }, []);

  const handleSearchFromUrl = async (query: string) => {
    setIsSearching(true);
    setSearchPerformed(true);

    try {
      const response = await fetch("/api/search-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success && data.records) {
        setRecords(data.records);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setRecords([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchPerformed(true);

    try {
      const response = await fetch("/api/search-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (data.success && data.records) {
        setRecords(data.records);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setRecords([]);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setRecords(mockRecords);
    setSearchPerformed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <h1
              className="text-2xl font-normal cursor-pointer text-gray-900 flex-shrink-0"
              onClick={resetSearch}
            >
              OFF/BEAT
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-900 text-gray-900 text-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
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
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hero Section - Only show when not searching */}
      {!searchPerformed && (
        <div className="relative h-80 overflow-hidden">
          <img
            src="/hero4.jpg"
            alt="CTA subway stairs"
            className="w-full h-full object-cover"
          />

          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="absolute inset-0 flex items-center justify-start px-8">
            <div className="text-left text-white max-w-md border-l border-black border-opacity-50 pl-6">
              <h2 className="text-4xl md:text-5xl font-normal mb-3">
                Album of the Week
              </h2>
              <p className="text-lg md:text-xl font-normal text-gray-200">
                African Skies - Phil Cohran Legacy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Searching records...</p>
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchPerformed && records.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-700 mb-4 font-medium">
            No records found for "{searchQuery}"
          </p>
          <button
            onClick={resetSearch}
            className="text-blue-600 hover:underline font-medium"
          >
            Back to browse
          </button>
        </div>
      )}

      {/* Record Grid */}
      {!isSearching && records.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          {searchPerformed && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">
                Search results for "{searchQuery}"
              </p>
              <button
                onClick={resetSearch}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Clear search
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/record/${record.id}?title=${encodeURIComponent(
                  record.title,
                )}`}
                className="bg-white overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <div className="aspect-square relative">
                  <img
                    src={record.image}
                    alt={record.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-normal text-sm line-clamp-2 mb-1 text-gray-900">
                    {record.title}
                  </h3>
                  {record.price > 0 && (
                    <p className="text-base font-normal mb-1 text-gray-900">
                      ${record.price}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 font-normal">
                    {record.condition} · {record.pressing}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-gray-800"
        style={{ backgroundColor: "#1E1E1E" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-white"
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
