import { NewsArticle } from "@/data/news";

/**
 * Fetches all news articles from the Next API
 */
export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`/api/news`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch news: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // Handle both array and object with results property
    if (Array.isArray(data)) {
      return data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

/**
 * Fetches a single news article by ID from the Django API
 */
export async function getNewsById(
  id: string | number
): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`/api/news/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Failed to fetch news: ${response.status} ${response.statusText}`
        );
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    return null;
  }
}
