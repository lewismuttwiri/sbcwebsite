"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: "How can I become a stockist for PEPSI products?",
      answer: (
        <div className="space-y-2">
          <p>
            We're always looking for passionate partners to distribute our
            products. To become a PEPSI stockist, please follow these steps:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Fill out our online stockist application form</li>
            <li>
              Our team will review your application and get back to you as soon
              as possible
            </li>
            <li>If approved, we'll schedule an introductory meeting</li>
          </ol>
          <div className="mt-4">
            <Link
              href="/partner/stockist/apply"
              className="text-blue-600 hover:underline font-medium inline-flex items-center"
            >
              Apply to become a stockist
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      ),
    },
    {
      question: "How can I get a PEPSI cooler for my business?",
      answer: (
        <div className="space-y-2">
          <p>
            PEPSI offers coolers to qualified businesses that meet our
            distribution criteria. Here's how you can get one:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be a PEPSI retailer or distributor</li>
            <li>Maintain minimum monthly purchase requirements</li>
            <li>Have adequate space and electricity for the cooler</li>
          </ul>
          <Link
            href="/contact"
            className="text-blue-600 hover:underline font-medium inline-flex items-center"
          >
            Contact our sales team
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      ),
    },
    {
      question: "How can I become a retailer for PEPSI products?",
      answer: (
        <div className="space-y-2">
          <p>To become a PEPSI retailer, please follow these steps:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Contact our sales team or your local PEPSI stockist</li>
            <li>Distribution route planning</li>
            {/* <li>Agree to our terms and conditions</li> */}
            <li>Set up your account with our distribution network</li>
          </ol>
          <div className="mt-3">
            <Link
              href="/contact"
              className="text-blue-600 hover:underline font-medium inline-flex items-center"
            >
              Contact our sales team
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      ),
    },
    {
      question: "How can I find a PEPSI stockist near me?",
      answer: (
        <div className="space-y-2">
          <p>Finding your nearest PEPSI stockist is easy:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Use our{" "}
              <Link
                href="/contact/distributor"
                className="text-blue-600 hover:underline"
              >
                stockist locator
              </Link>
            </li>
            <li>
              Call our customer service hotline at{" "}
              <a
                href="tel:+0208635000"
                className="text-blue-600 hover:underline"
              >
                020 863 5000
              </a>
            </li>
            <li>
              Email us at{" "}
              <a
                href="mailto:info@sbckenya.com"
                className="text-blue-600 hover:underline"
              >
                info@sbckenya.com
              </a>
            </li>
          </ul>
          <Link
            href="/contact"
            className="text-blue-600 hover:underline font-medium inline-flex items-center"
          >
            Contact our sales team
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      ),
    },
    {
      question: "What are the requirements to sell PEPSI products?",
      answer: (
        <div className="space-y-2">
          <p>
            To sell PEPSI products, retailers typically need to meet these
            requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Valid business license and permits</li>
            <li>Appropriate storage facilities</li>
            <li>Agreement to maintain product quality standards</li>
            <li>Commitment to PEPSI brand guidelines</li>
            <li>Minimum order requirements (varies by location)</li>
          </ul>
          <Link
            href="/contact"
            className="text-blue-600 hover:underline font-medium inline-flex items-center"
          >
            Contact our sales team
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
          >
            <button
              className={`flex justify-between items-center w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 ${
                openIndex === index ? "bg-gray-50" : ""
              }`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {faq.question}
              </h3>
              {openIndex === index ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <div
              id={`faq-${index}`}
              className={`px-6 pb-6 pt-0 text-gray-600 transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
              aria-hidden={openIndex !== index}
            >
              <div className="pt-2">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
