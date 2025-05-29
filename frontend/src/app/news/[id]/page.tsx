"use client";

import { NewsArticle } from "@/data/news";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getNewsById, getAllNews } from "@/utils/news";
import { useEffect, useState } from "react";

interface NewsArticlePageProps {
  params: { id: string };
}

const NewsArticlePage = () => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const articleId = params?.id as string;

  useEffect(() => {
    // Skip if we don't have an articleId yet
    if (!articleId) return;

    const loadArticle = async () => {
      setIsLoading(true);

      try {
        // First try to fetch all news and find the article

        // If not found in all news, try to fetch directly by ID
        const directArticle = await getNewsById(articleId);
        if (directArticle) {
          setArticle(directArticle);
          setIsLoading(false);
          return;
        }
      } catch (error: any) {
        console.error(`Error loading news with id ${articleId}`);
        setError(error.message);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticle();
  }, [articleId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <p className="mb-6">The requested article could not be found.</p>
        <Link
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      <div className="mb-12">
        <Link
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to News
        </Link>
      </div>

      <article className="prose prose-blue max-w-none">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="relative h-72 lg:h-110 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="lg:w-2/3">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {article.category}
                </span>
                <span className="text-gray-500 text-sm">{article.date}</span>
              </div>
              <p className="text-gray-600">{article.description}</p>
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsArticlePage;
