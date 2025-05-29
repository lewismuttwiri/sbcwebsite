"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface NewsCardProps {
  image: string;
  alt: string;
  category: string;
  date: string;
  title: string;
  description: string;
  link: string;
}

const NewsCard: FC<NewsCardProps> = ({
  image,
  alt,
  date,
  category,
  title,
  description,
  link,
}) => {
  const validLink = link || "/sustainability"; // Fallback to general sustainability page if link is undefined
  return (
    <Link
      href={validLink}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-68">
        <Image src={image} alt={alt} fill className="object-cover" priority />
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {category}
          </span>
          <span className="text-gray-500 text-sm">{date}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <span className="text-blue-600 hover:text-blue-800 font-medium">
          Read More
        </span>
      </div>
    </Link>
  );
};

export default NewsCard;
