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

  // Club images
  // const clubImages = [
  //   "/images/events/clubs/club10.jpeg",
  //   "/images/events/clubs/club11.jpeg",
  //   "/images/events/clubs/club12.jpeg",
  //   "/images/events/clubs/club13.jpeg",
  //   "/images/events/clubs/club3.jpeg",
  //   "/images/events/clubs/club4.jpeg",
  //   "/images/events/clubs/club5.jpeg",
  //   "/images/events/clubs/club6.jpeg",
  //   "/images/events/clubs/club7.jpeg",
  //   "/images/events/clubs/club8.jpeg",
  //   // "/images/events/clubs/pepsi x quiver.jpeg",
  //   // "/images/events/clubs/pepsi-x-quiver2.jpeg",
  // ];

  // // Staff images
  // const staffImages = [
  //   "/images/events/staff/staff1.jpeg",
  //   "/images/events/staff/staff2.jpeg",
  //   "/images/events/staff/staff3.jpeg",
  //   "/images/events/staff/staff5.jpeg",
  //   "/images/events/staff/staff6.jpeg",
  //   "/images/events/staff/staff7.jpeg",
  //   "/images/events/staff/staff8.jpeg",
  //   "/images/events/staff/staff9.jpeg",
  //   "/images/events/staff/staff10.jpeg",
  //   "/images/events/staff/staff11.jpeg",
  //   "/images/events/staff/staff13.jpeg",
  //   "/images/events/staff/staff14.jpeg",
  //   "/images/events/staff/staff15.jpeg",
  //   "/images/events/staff/staff16.jpeg",
  //   "/images/events/staff/staff17.jpeg",
  //   "/images/events/staff/staff18.jpeg",
  //   "/images/events/staff/staff20.jpeg",
  //   "/images/events/staff/staff21.jpeg",
  // ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Events & Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our recent events and team activities
          </p>
        </div>
      </section>

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
