// src/components/ContainerBlog.jsx

import { useEffect, useState } from "react";
import CardBlog from "./CardBlog.jsx";

const apiKey = import.meta.env.VITE_NEWS_API_KEY || "YOUR_API_KEY";
const pageSize = 20;

function ContainerBlog({ searchQuery, refreshTrigger }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset when search changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setTotalResults(null);
  }, [searchQuery]);

  async function fetchNews(pageToLoad) {
    setLoading(true);

    try {
      const query = searchQuery?.trim();

      let url;

      if (query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&pageSize=${pageSize}&page=${pageToLoad}&sortBy=publishedAt&apiKey=${apiKey}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&page=${pageToLoad}&apiKey=${apiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data?.articles) {
        setArticles((prev) =>
          pageToLoad === 1 ? data.articles : [...prev, ...data.articles]
        );

        setTotalResults(data.totalResults ?? data.articles.length);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(page);
  }, [page, searchQuery, refreshTrigger]);

  const canLoadMore =
    articles.length > 0 &&
    (totalResults === null || articles.length < totalResults);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Loading news...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            No articles found. Try another search.
          </p>
        </div>
      )}

      {/* Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <CardBlog key={article.url || index} article={article} />
        ))}
      </div>

      {/* Load more */}
      {canLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="bg-[#138065] text-white px-6 py-3 rounded-md hover:bg-[#0f6d56] transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Show more news"}
          </button>
        </div>
      )}
    </main>
  );
}

export default ContainerBlog;