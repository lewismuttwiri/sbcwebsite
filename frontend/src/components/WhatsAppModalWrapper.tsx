"use client";

import { useState, useEffect } from "react";
import WhatsAppModal from "./WhatsAppModal";

export default function WhatsAppModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return <WhatsAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
