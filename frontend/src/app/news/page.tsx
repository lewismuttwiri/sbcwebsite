"use client";

import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllNews } from "@/utils/news";

// Define the NewsArticle interface
interface NewsArticle {
  category: string;
  id: string | number;
  title: string;
  description: string;
  image: string;
  date: string;
  content?: string;
}

const NewsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getAllNews()
      .then((data) => {
        setNews(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h1>
        <p className="text-gray-600">
          Stay updated with the latest news and events from Pepsi Kenya
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No news articles available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article) => (
            <NewsCard
              key={article.id}
              image={article.image}
              alt={article.title}
              date={article.date}
              category={article.category}
              title={article.title}
              description={article.description}
              link={`/news/${article.id}`}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && news.length > 3 && (
        <div className="mt-12 text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All News
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
