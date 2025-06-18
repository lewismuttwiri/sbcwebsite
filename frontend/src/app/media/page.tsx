"use client";

import InfiniteScroll from "@/components/ui/InfiniteScroll";
import Image from "next/image";
import { getClubMedia, getStaffMedia } from "@/utils/media";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [clubImages, setClubImages] = useState([]);
  const [staffImages, setStaffImages] = useState([]);

  useEffect(() => {
    const fetchClubImages = async () => {
      const images = await getClubMedia();
      setClubImages(images);
    };
    const fetchStaffImages = async () => {
      const images = await getStaffMedia();
      setStaffImages(images);
    };
    fetchClubImages();
    fetchStaffImages();
  }, []);

  return (
    <main className="min-h-screen">
      <section
        className="bg-fixed h-[20vh] md:h-[60vh] bg-center bg-contain md:bg-cover -z-10 m-0 flex items-center justify-center pt-[25px] md:pt-0"
        style={{
          backgroundImage: "url('/images/logo/pepsi-home.jpg')",
        }}
      ></section>

      <div className="container mx-auto px-4 py-4 relative z-10 text-center  flex items-start justify-center">
        <div className="w-fit p-4 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Events & Team Activities
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore our recent events and team activities
          </p>
        </div>
      </div>

      {/* Clubs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Team Activities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team in action at various events and activities
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <InfiniteScroll
              images={staffImages}
              speed="slow"
              scrollDirection="down"
              columns={3}
            />
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Events Activities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Highlights from our partnerships and events
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <InfiniteScroll
              images={clubImages}
              speed="slow"
              scrollDirection="up"
              columns={3}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
