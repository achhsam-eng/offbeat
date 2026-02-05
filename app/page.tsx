"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";

interface Record {
  id: number;
  title: string;
  price: number;
  condition: string;
  pressing: string;
  image: string;
}

// Mock data - will be replaced with database in production
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

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<Record[]>(mockRecords);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Debounce search query (waits 500ms after user stops typing)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Execute search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      executeSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  // Handle URL-based search on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get("search");

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      executeSearch(searchFromUrl);
    }
  }, []);

  const executeSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchPerformed(true);

    try {
      const response = await fetch("/api/search-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      if (data.success && data.records) {
        setRecords(data.records);
        if (data.records.length === 0) {
          showToast(`No results found for "${query}"`, "info");
        }
      } else {
        throw new Error(data.error || "Search failed");
      }
    } catch (err) {
      console.error("Search failed:", err);
      showToast("Search failed. Please try again.", "error");
      setRecords([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Actual search is triggered by useEffect watching debouncedSearchQuery
  };

  const resetSearch = () => {
    setSearchQuery("");
    setRecords(mockRecords);
    setSearchPerformed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      {/* Hero Section - Only show when not searching */}
      {!searchPerformed && (
        <div className="relative h-80 overflow-hidden">
          <img
            src="/images/hero.jpg"
            alt="CTA subway stairs"
            className="w-full h-full object-cover"
          />

          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="absolute inset-0 flex items-center justify-start px-8">
            <div className="text-left text-white max-w-md border-l border-black border-opacity-50 pl-6">
              <h2 className="text-4xl md:text-5xl font-normal mb-3">
                The Edit
              </h2>
              <p className="text-lg md:text-xl font-normal text-gray-200">
                Weekly thoughts on sound and collecting
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner message="Searching records..." />
        </div>
      )}

      {/* No Results */}
      {!isSearching && searchPerformed && records.length === 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <EmptyState
            title={`No records found for "${searchQuery}"`}
            description="Try searching for a different artist or album"
            action={{
              label: "Back to browse",
              onClick: resetSearch,
            }}
          />
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

      <BottomNav activePage="home" />

      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}
