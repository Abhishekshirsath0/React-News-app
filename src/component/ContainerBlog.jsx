import { useEffect, useState } from "react";
import CardBlog from "./CardBlog.jsx";

const apiKey = import.meta.env.VITE_NEWS_API_KEY;
const pageSize = 20;

function ContainerBlog({ searchQuery, refreshTrigger }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiBlocked, setApiBlocked] = useState(false);
  const [error, setError] = useState("");

  // Reset when search changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setTotalResults(null);
    setApiBlocked(false);
    setError("");
  }, [searchQuery]);

  async function fetchNews(pageToLoad) {
    setLoading(true);
    setError("");

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

      // Free NewsAPI deployment restriction
      if (
        response.status === 426 ||
        data?.code === "browserNotAllowed"
      ) {
        setApiBlocked(true);
        setArticles([]);
        return;
      }

      // Other API errors
      if (data?.status === "error") {
        setError(data?.message || "Something went wrong.");
        setArticles([]);
        return;
      }

      // Success
      if (data?.articles) {
        setArticles((prev) =>
          pageToLoad === 1
            ? data.articles
            : [...prev, ...data.articles]
        );

        setTotalResults(
          data.totalResults ?? data.articles.length
        );
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch news
  useEffect(() => {
    fetchNews(page);
  }, [page, searchQuery, refreshTrigger]);

  const canLoadMore =
    articles.length > 0 &&
    (totalResults === null ||
      articles.length < totalResults);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      {/* API Blocked */}
      {apiBlocked && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 mb-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>

          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            NewsAPI is not available in deployed websites
          </h2>

          <p className="text-yellow-700 text-sm mb-4">
            The free plan of NewsAPI only works on{" "}
            <code className="bg-yellow-100 px-1 rounded">
              localhost
            </code>
            . Deployed sites are blocked by their policy.
          </p>

          <div className="bg-white border border-yellow-200 rounded-lg p-4 text-left text-sm text-gray-700 max-w-lg mx-auto">
            <p className="font-semibold mb-2 text-gray-800">
              📌 Note for recruiters:
            </p>

            <p>
              This project works fully on a local machine.
              The API restriction is a limitation of the
              free NewsAPI plan — not a code issue.
            </p>

            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Clone the repo from GitHub</li>

              <li>
                Add your NewsAPI key to{" "}
                <code className="bg-gray-100 px-1 rounded">
                  .env
                </code>
              </li>

              <li>
                Run{" "}
                <code className="bg-gray-100 px-1 rounded">
                  npm install && npm run dev
                </code>
              </li>
            </ol>
          </div>

          <a
            href="https://github.com/Abhishekshirsath0/React-News-app"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-[#138065] text-white px-5 py-2 rounded-md hover:bg-[#0f6d56] transition text-sm"
          >
            View Source Code on GitHub
          </a>
        </div>
      )}

      {/* Error */}
      {!apiBlocked && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-center">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            Loading news...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !apiBlocked &&
        !error &&
        articles.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">
              No articles found. Try another search.
            </p>
          </div>
        )}

      {/* Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <CardBlog
            key={article.url || index}
            article={article}
          />
        ))}
      </div>

      {/* Load More */}
      {canLoadMore && !loading && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-[#138065] text-white px-6 py-3 rounded-md hover:bg-[#0f6d56] transition"
          >
            Show more news
          </button>
        </div>
      )}
    </main>
  );
}

export default ContainerBlog;