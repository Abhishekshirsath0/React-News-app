// src/components/CardBlog.jsx

function CardBlog({ article }) {
  const title = article?.title || "No title available";
  const description = article?.description || "No description available";

  const truncatedTitle = title.length > 50 ? title.slice(0, 50) + "..." : title;

  const truncatedDescription =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div
      onClick={() => article?.url && window.open(article.url, "_blank")}
      className="card-blog bg-white rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300"
    >
      {/* Image */}
      <img
        src={article?.urlToImage || "https://placehold.co/600x400"}
        alt={title}
        className="w-full h-48 sm:h-56 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 leading-snug">
          {truncatedTitle}
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          {truncatedDescription}
        </p>
      </div>
    </div>
  );
}

export default CardBlog;
