"use client";

import {
  CiUser,
  CiShoppingCart,
  CiLocationOn,
  CiCircleInfo,
} from "react-icons/ci";
import { useRouter } from "next/navigation";

type WelcomeOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  response: string;
  action?: () => void;
};

export default function WelcomeChatFlow({
  onSelect,
}: {
  onSelect: (option: WelcomeOption) => void;
}) {
  const router = useRouter();

  const commonOptions: WelcomeOption[] = [
    {
      id: "careers",
      title: "Career Opportunities",
      description: "Explore job openings and career growth",
      icon: <CiUser size={24} />,
      response:
        "Great choice! You can view our current job openings and career opportunities on our Careers page. Would you like me to take you there?",
      action: () => router.push("/careers"),
    },
    {
      id: "products",
      title: "Products & Services",
      description: "Learn about our product range",
      icon: <CiShoppingCart size={24} />,
      response:
        "We offer a wide range of products and services. You can browse our full catalog in the Products section. Would you like me to show you our products?",
      action: () => router.push("/products"),
    },
    {
      id: "stockist",
      title: "Stockist Enquiry",
      description: "Join our stockist network",
      icon: <CiLocationOn size={24} />,
      response:
        "We're excited you're interested in becoming a stockist! You can find all the details about our stockist program, including requirements and benefits, on our Stockist page. Would you like me to take you there?",
      action: () => router.push("/stockist"),
    },
    {
      id: "pricing",
      title: "Pricing Enquiry",
      description: "Get information about our pricing",
      icon: <CiCircleInfo size={24} />,
      response:
        "Our pricing varies based on products and order volume. For the most accurate pricing, please visit our Products page or contact our sales team directly for a personalized quote. Would you like to browse our products?",
      action: () => router.push("/products"),
    },
    {
      id: "support",
      title: "Customer Support",
      description: "Get help with your order or account",
      icon: <CiCircleInfo size={24} />,
      response:
        "Our customer support team is here to help you with any questions or issues. You can reach us through the Contact Us page or call our support line at [Your Support Number]. Would you like to contact support now?",
      action: () => router.push("/contact"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-blue-800">Hi there! 👋</h3>
        <p className="text-sm text-blue-700">
          How can we help you today? Choose from the options below or type your
          question.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {commonOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className="flex items-start p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-blue-600 mr-3 mt-0.5">{option.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">{option.title}</h4>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
