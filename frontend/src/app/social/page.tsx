"use client";
import { RiTwitterXLine } from "react-icons/ri";
import { CiFacebook } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { CiYoutube } from "react-icons/ci";
import { BsTiktok } from "react-icons/bs";

import Button from "@/components/Button";
import { motion } from "framer-motion";

const socialLinks = [
  {
    name: "Facebook",
    icon: CiFacebook,
    url: "https://facebook.com/sbc",
  },
  {
    name: "Instagram",
    icon: CiInstagram,
    url: "https://instagram.com/sbc",
  },
  {
    name: "Twitter",
    icon: RiTwitterXLine,
    url: "https://twitter.com/sbc",
  },
  {
    name: "LinkedIn",
    icon: CiLinkedin,
    url: "https://linkedin.com/company/sbc",
  },
  {
    name: "YouTube",
    icon: CiYoutube,
    url: "https://youtube.com/sbc",
  },
  {
    name: "TikTok",
    icon: BsTiktok,
    url: "https://tiktok.com/sbc",
  },
];

export default function SocialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Follow Us on Social Media
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay connected with us across all our social media platforms. Follow
            us to get the latest updates, news, and behind-the-scenes content.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto ">
          {socialLinks.map((social) => (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: socialLinks.indexOf(social) * 0.1,
              }}
              className="text-center hover:*:border-2 hover:*border-gray-500 hover:border-gray-300 rounded-2xl"
            >
              <Button
                variant="primary"
                className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all"
              >
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                    {social.icon({ className: "w-6 h-6 text-blue-600" })}
                  </div>
                  <span className="text-lg font-medium">{social.name}</span>
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
