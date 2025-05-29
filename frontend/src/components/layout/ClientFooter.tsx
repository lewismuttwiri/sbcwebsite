"use client";

import { useEffect, useState } from "react";
import Footer from "./Footer";

const ClientFooter = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState("2024");

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  if (!isMounted) {
    return null;
  }

  return <Footer currentYear={currentYear} />;
};

export default ClientFooter;
