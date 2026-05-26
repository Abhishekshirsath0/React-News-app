// src/components/Navbar.jsx

import { useState } from "react";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav className="bg-[#2d4c4f] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <a className="text-white text-3xl md:text-4xl font-bold">News.</a>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <input
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 px-4 py-2 rounded-md outline-none border border-gray-300 bg-white text-gray-800"
          />

          <div className="flex gap-2 items-center">
            <button
              onClick={handleSearch}
              className="bg-[#138065] text-white px-4 py-2 rounded-md hover:bg-[#0f6d56] shadow-sm"
            >
              Search
            </button>

            <button
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 shadow-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
