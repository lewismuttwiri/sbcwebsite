import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { CiFacebook, CiLocationOn, CiMail, CiPhone } from "react-icons/ci";
import {
  AiOutlineInstagram,
  AiOutlineTikTok,
} from "react-icons/ai";
import WhatsAppModal from "../WhatsAppModal";
interface FooterProps {
  currentYear?: string;
}
import { ImWhatsapp } from "react-icons/im";


const Footer = ({
  currentYear = new Date().getFullYear().toString(),
}: FooterProps) => {
  return (
    <footer className="bg-[#0E0E96] text-white">
      <div className="py-12">
        <Container className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/logo/sbc-logo.png"
                  alt="SBC Kenya Logo"
                  width={60}
                  height={60}
                  className="mr-3 bg-white p-2 rounded-full"
                />
                <h3 className="text-xl font-bold">SBC KENYA LTD</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Committed to excellence in service and product quality since our
                establishment.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61565704941051"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <span className="sr-only">Facebook</span>
                  <CiFacebook size={24} />
                </a>
                <a
                  href="https://www.tiktok.com/@pepsikenya_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <span className="sr-only">Tiktok</span>
                  <AiOutlineTikTok size={24} />
                </a>
                <a
                  href="https://www.instagram.com/pepsikenya_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <span className="sr-only">Instagram</span>
                  <AiOutlineInstagram size={24} />
                </a>
                <a
                  href="https://wa.me/254730301021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <span className="sr-only">WhatsApp</span>
                  <ImWhatsapp size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Our Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms & Policies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Brands
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact/stockist"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Find a Stockist Near Me
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CiLocationOn size={24} />
                  <span className="text-gray-300">Nairobi, Kenya</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CiMail size={24} />
                  <Link
                    href="mailto:info@sbckenya.com"
                    className="text-gray-300"
                  >
                    info@sbckenya.com
                  </Link>
                </li>
                <li className="flex items-start space-x-2">
                  <CiPhone size={24} />
                  <Link href="tel:0208635000" className="text-gray-300">
                    0208635000
                  </Link>
                </li>
                <li className="flex items-start space-x-2">
                  <CiPhone size={24} />
                  <Link href="tel:0800230055" className="text-gray-300">
                    0800230055 (Toll Free)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4  uppercase">
                Newsletter
              </h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter to receive updates and news.
              </p>
              <form className=" space-y-4 space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 flex-grow border-2 border-gray-300"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SBC Kenya Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-400 hover:text-white text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
