"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

// Type definitions for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

interface Location {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  address: string;
  googleMapsUrl: string;
}

// Leaflet integration using CDN
const loadLeaflet = (): Promise<any> => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
};

const locations: Location[] = [
  {
    id: "nairobi",
    name: "Nairobi Main Plant",
    position: { lat: -1.24257, lng: 36.87357 },
    address: "Nairobi, Kenya",
    googleMapsUrl: "https://www.google.com/maps?q=-1.24257,36.87357",
  },
  {
    id: "mombasa",
    name: "Mombasa Depot",
    position: { lat: -3.99625, lng: 39.56668 },
    address: "Mombasa, Kenya",
    googleMapsUrl: "https://www.google.com/maps?q=-3.99625,39.56668",
  },
  {
    id: "kisumu",
    name: "Kisumu Depot",
    position: { lat: -0.13843, lng: 34.79798 },
    address: "Kisumu, Kenya",
    googleMapsUrl: "https://www.google.com/maps?q=-0.13843,34.79798",
  },
];

export default function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeLocation, setActiveLocation] = useState<Location>(locations[0]);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mapInstance = useRef<any>(null); // Store map instance in a ref

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        const L = await loadLeaflet();

        if (!mapRef.current || mapInstance.current) return; // Prevent reinitialization

        // Create map centered on Kenya
        const map = L.map(mapRef.current).setView([-1.286389, 36.817223], 6);

        // Add OpenStreetMap tiles (free)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Store the map instance
        mapInstance.current = map;

        // Add markers
        locations.forEach((location) => {
          const marker = L.marker([
            location.position.lat,
            location.position.lng,
          ]).addTo(map).bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">${location.name}</h3>
              <p class="text-sm text-gray-600">${location.address}</p>
              <a href="${location.googleMapsUrl}" target="_blank" class="text-blue-600 text-sm hover:underline">
                View on Google Maps
              </a>
            </div>
          `);

          marker.on("click", () => {
            window.open(location.googleMapsUrl, "_blank");
          });
        });

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading map:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initMap();

    // Cleanup function
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleLocationHover = (location: Location) => {
    setActiveLocation(location);
    if (map) {
      map.setView([location.position.lat, location.position.lng], 12, {
        animate: true,
        duration: 1,
      });
    }
  };

  const handleLocationClick = (location: Location) => {
    window.open(location.googleMapsUrl, "_blank");
  };

  return (
    <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Locations
        </h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeLocation.id === location.id
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-md"
                    : "border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                }`}
                onMouseEnter={() => handleLocationHover(location)}
                onClick={() => handleLocationClick(location)}
              >
                <div className="flex items-start">
                  <div
                    className={`mt-1 mr-4 transition-colors ${
                      activeLocation.id === location.id
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <FaMapMarkerAlt size={20} color="#0E0E96" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {location.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{location.address}</p>
                    <button
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        window.open(location.googleMapsUrl, "_blank");
                      }}
                    >
                      <FaExternalLinkAlt size={12} />
                      View on Google Maps
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="w-full lg:w-2/3 h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full z-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
