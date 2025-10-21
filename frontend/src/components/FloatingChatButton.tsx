"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import WhatsAppModal from "./WhatsAppModal";

export default function FloatingChatButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 transform hover:scale-110"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8" />
      </button>

      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
