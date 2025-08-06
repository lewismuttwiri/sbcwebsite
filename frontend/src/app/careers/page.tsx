"use client";

import { motion } from "framer-motion";
import {
  FaAward,
  FaGlobe,
  FaUsers,
  FaRocket,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa6";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const benefits = [
  {
    id: 1,
    icon: FaAward,
    title: "Career Growth",
    description:
      "We provide continuous learning opportunities and clear career progression paths to help you reach your full potential.",
  },
  {
    id: 2,
    icon: FaGlobe,
    title: "Global Impact",
    description:
      "Be part of a company that makes a difference worldwide, working on projects that have real-world impact.",
  },
  {
    id: 3,
    icon: FaUsers,
    title: "Diverse Team",
    description:
      "Join a multicultural team that values diversity and inclusion, where everyone's unique perspective is celebrated.",
  },
  {
    id: 4,
    icon: FaRocket,
    title: "Innovation",
    description:
      "Work on cutting-edge technologies and innovative solutions that push the boundaries of what's possible.",
  },
  {
    id: 5,
    icon: FaLightbulb,
    title: "Creative Freedom",
    description:
      "We encourage creativity and fresh ideas, giving you the freedom to bring your best work to life.",
  },
  {
    id: 6,
    icon: FaHandshake,
    title: "Work-Life Balance",
    description:
      "We believe in maintaining a healthy work-life balance, with flexible working arrangements and supportive policies.",
  },
];

export default function WhyJoinUsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Why Join SBC?
          </h1>
          <p className="text-xl text-gray-600">
            Discover why talented professionals choose to build their careers
            with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: benefit.id * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6">
                <benefit.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with SBC today and be part of our innovative and
            dynamic team.
          </p>
          <Button
            variant="primary"
            className="px-8 py-4 text-lg font-semibold"
            onClick={() => router.push("/careers/jobs")}
          >
            View Open Positions
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
