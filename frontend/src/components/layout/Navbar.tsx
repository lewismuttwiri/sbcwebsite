"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "./Container";
import {
  CiChat1,
  CiFacebook,
  CiInstagram,
  CiLinkedin,
  CiLocationOn,
  CiMail,
  CiPhone,
  CiShoppingCart,
} from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { FiPackage, FiLogOut, FiLayout, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/hooks/useCart";
import { PiArrowUpRightThin, PiTiktokLogoThin } from "react-icons/pi";

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : null;
};

interface DropdownItem {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cart, totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  const isLoggedIn = !!user;
  const isHR = user?.entity?.user_role == 5;
  const isProcurement = user?.entity?.user_role == 6;
  const isAdmin = user?.entity?.user_role == 1;
  const isReceptionist = user?.entity?.user_role == 7;
  const isCustomer = user?.entity?.user_role == 4;

  const accountLinks = [
    ...(isCustomer
      ? [
          {
            name: "Orders",
            href: "/orders",
            icon: <FiPackage className="mr-2" />,
          },
          {
            name: "Dashboard",
            href: "/dashboard",
            icon: <CiChat1 className="mr-2" />,
          },
        ]
      : []),
    ...(isHR
      ? [
          {
            name: "Applications",
            href: "/applications",
            icon: <FiPackage className="mr-2" />,
          },
          {
            name: "Add a Job advert",
            href: "/careers/new-opening",
            icon: <FiPackage className="mr-2" />,
          },
        ]
      : []),
    ...(isProcurement
      ? [
          {
            name: "Add Tenders",
            href: "/tenders/add",
            icon: <FiPackage className="mr-2" />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            name: "Applications",
            href: "/applications",
            icon: <FiPackage className="mr-2" />,
          },
          {
            name: "Add tenders",
            href: "/tenders/add",
            icon: <FiPackage className="mr-2" />,
          },
        ]
      : []),
  ];

  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-container") &&
        !target.closest(".nav-link") &&
        !target.closest("button[aria-label='Toggle dropdown']")
      ) {
        setActiveDropdown(null);
      }
    };

    const handleRouteChange = () => {
      setActiveDropdown(null);
      setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleNavLinkClick = (link: NavLink, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (link.dropdown) {
      if (activeDropdown === link.name) {
        setActiveDropdown(null);
        return;
      }
      setActiveDropdown(link.name);
    } else {
      setActiveDropdown(null);
      setIsMenuOpen(false);
      router.push(link.href);
    }
  };

  const toggleDropdown = (name: string | null, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setActiveDropdown(null);
    }
  };

  const navLinks = [
    {
      name: "Our Story",
      href: "/about",
      dropdown: [
        { name: "About Us", href: "/about" },
        { name: "History", href: "/about/history" },
        { name: "Mission & Vision", href: "/about/mission-and-vision" },
        { name: "Quality Assurance", href: "/about/quality-assurance" },
      ],
    },
    {
      name: "Brands",
      href: "/brands",
    },
    {
      name: "Products",
      href: "/products",
    },

    {
      name: "Opportunities",
      href: "/careers",
      dropdown: [
        { name: "Become a Stockist", href: "/partner/stockist" },
        { name: "Careers", href: "/careers" },
        { name: "Tenders", href: "/tenders" },
      ],
    },
    { name: "Media", href: "/media" },

    {
      name: "Contact",
      href: "/contact",
      dropdown: [
        { name: "Contact Us", href: "/contact" },
        {
          name: "Find a stockist near me",
          href: "/contact/stockist",
        },
        {
          name: "Socials",
          href: "/social",
        },
      ],
    },
  ];

  return (
    <ClientOnly>
      <div className="w-full sticky top-0 left-0 right-0 z-50">
        <div className="bg-[#0E0E96] text-white text-sm py-3 sticky top-0 z-50">
          <Container>
            <div>
              <div className="hidden lg:flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Ruaraka, Along Baba Dogo Road, Nairobi</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Open: 08:00am - 05:00pm</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href="tel:+0800230055"
                    className="flex items-center hover:text-blue-200 transition-colors"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>+0800230055</span>
                  </a>
                  <a
                    href="mailto:info@sbckenya.com"
                    className="flex items-center hover:text-blue-200 transition-colors"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>info@sbckenya.com</span>
                  </a>
                  <div className="flex items-center space-x-4">
                    <Link
                      href="https://www.instagram.com/pepsikenya_/"
                      target="_blank"
                    >
                      <CiInstagram size={20} />
                    </Link>
                    <Link
                      href="https://www.facebook.com/profile.php?id=61565704941051"
                      target="_blank"
                    >
                      <CiFacebook size={20} />
                    </Link>

                    <Link
                      href="https://www.tiktok.com/@pepsikenya_"
                      target="_blank"
                    >
                      <PiTiktokLogoThin size={20} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex lg:hidden items-center justify-between w-full">
                <a
                  href="https://www.google.com/maps/place/SBC+Kenya+Ltd/@-1.2428828,36.8736999,21z/data=!4m14!1m7!3m6!1s0x182f15d5864ff359:0x1c77a411313dc6f1!2sSBC+Kenya+Ltd!8m2!3d-1.2429106!4d36.8737838!16s%2Fg%2F11_q83qxn!3m5!1s0x182f15d5864ff359:0x1c77a411313dc6f1!8m2!3d-1.2429106!4d36.8737838!16s%2Fg%2F11_q83qxn?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  className="flex items-center text-xs hover:text-blue-200 transition-colors space-x-2"
                >
                  <CiLocationOn size={20} />
                  <span>
                    Ruaraka, Along Baba <br />
                    Dogo Road, Nairobi
                  </span>
                </a>
                <a
                  href="tel:+0800230055"
                  target="_blank"
                  className="flex items-center text-xs hover:text-blue-200 transition-colors space-x-2"
                >
                  <CiMail size={20} />
                  <span>info@sbckenya.com</span>
                </a>
              </div>
            </div>
          </Container>
        </div>

        <nav className="bg-gray-100 shadow-md sticky top-0 z-50">
          <Container>
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0 justify-start">
                <Link href="/" className="flex items-center">
                  <div className="flex items-center">
                    <Image
                      src="/images/logo/pepsi_logo.png"
                      alt="SBC Kenya Logo"
                      width={60}
                      height={60}
                      className="mr-3"
                    />
                    <Image
                      src="/images/logo/sbc-kenya.png"
                      alt="SBC Kenya Logo"
                      width={100}
                      height={100}
                      className="mr-3"
                    />
                  </div>
                </Link>
              </div>

              <div className="hidden lg:flex items-center justify-center mx-auto">
                <div className="flex items-center space-x-6">
                  {navLinks.map((link) => (
                    <div key={link.name} className="relative group">
                      <div className="relative">
                        <div className="relative">
                          <div className="flex items-center">
                            {link.dropdown ? (
                              <div className="flex items-center">
                                <button
                                  className={`px-3 py-2 text-sm font-medium text-left ${
                                    isActive(link.href)
                                      ? "text-gray-900 font-medium"
                                      : "text-gray-900 hover:opacity-70"
                                  }`}
                                  onClick={(e) => handleNavLinkClick(link, e)}
                                >
                                  {link.name}
                                </button>
                                <button
                                  onClick={(e) => handleNavLinkClick(link, e)}
                                  className="p-1 text-gray-900 hover:opacity-80 focus:outline-none"
                                  aria-expanded={activeDropdown === link.name}
                                  aria-label="Toggle dropdown"
                                >
                                  <FaChevronDown
                                    className={`text-gray-900 h-4 w-4 font-bold transition-transform duration-200 ${
                                      activeDropdown === link.name
                                        ? "transform rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                              </div>
                            ) : (
                              <Link
                                href={link.href}
                                className={`px-3 py-2 text-sm font-medium ${
                                  isActive(link.href)
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-900 hover:opacity-80"
                                }`}
                              >
                                {link.name}
                              </Link>
                            )}
                          </div>
                        </div>

                        {link.dropdown && activeDropdown === link.name && (
                          <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 dropdown-container">
                            <div className="py-1">
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:text-black transition-colors duration-300"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {item.name}
                                  <PiArrowUpRightThin size={20} />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x- justify-end">
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-white transition-colors duration-300 space-x-4"
                >
                  <CiShoppingCart size={22} color="black" />
                  <span
                    key={`cart-count-${totalItems}`}
                    className={`absolute -top-3 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-50 transition-opacity ${
                      totalItems > 0 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                </Link>

                <div className="relative hidden md:block">
                  <div
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 font-medium transition-colors duration-300 border-1 border-black rounded-full p-2 cursor-pointer nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("account", e);
                    }}
                  >
                    <MdAccountCircle size={20} color="black" />
                    <FaChevronDown size={16} color="black" />
                  </div>
                  {activeDropdown === "account" && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 dropdown-container">
                      <div className="py-1">
                        {!isLoggedIn ? (
                          <>
                            <Link
                              href="/auth/signup"
                              className="flex items-center px-4 py-3 text-gray-800 hover:bg-white transition-colors duration-300"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Sign Up
                            </Link>
                            <Link
                              href="/auth/login"
                              className="flex items-center px-4 py-3 text-gray-800 hover:bg-whit transition-colors duration-300 border-t border-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Log In
                            </Link>
                          </>
                        ) : (
                          <>
                            {accountLinks.map((link, index) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center px-4 py-3 text-gray-800 hover:bg-[#0E0E96] hover:text-white transition-colors duration-300 ${
                                  index > 0 ? "border-t border-gray-100" : ""
                                }`}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {link.icon}
                                {link.name}
                              </Link>
                            ))}
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className={`w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-300 border-t border-gray-100 ${
                                isLoggingOut
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <FiLogOut className="mr-2" />
                              {isLoggingOut ? "Logging out..." : "Log Out"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Account Icon */}
                <div className="relative md:hidden">
                  <div
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 font-medium transition-colors duration-300 border-1 border-black rounded-full p-2 cursor-pointer nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("mobile-account", e);
                    }}
                  >
                    <MdAccountCircle size={20} color="black" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {activeDropdown === "mobile-account" && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 dropdown-container">
                      <div className="py-1">
                        {!isLoggedIn ? (
                          <>
                            <Link
                              href="/auth/signup"
                              className="flex items-center px-4 py-3 text-gray-800 hover:bg-white hover:text-white transition-colors duration-300"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Sign Up
                            </Link>
                            <Link
                              href="/auth/login"
                              className="flex items-center px-4 py-3 text-gray-800 hover:bg-white hover:text-white transition-colors duration-300 border-t border-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Log In
                            </Link>
                          </>
                        ) : (
                          <>
                            {accountLinks.map((link, index) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center px-4 py-3 text-gray-800 hover:bg-white hover:text-white transition-colors duration-300 ${
                                  index > 0 ? "border-t border-gray-100" : ""
                                }`}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {link.icon}
                                {link.name}
                              </Link>
                            ))}
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className={`w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-300 border-t border-gray-100 ${
                                isLoggingOut
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <FiLogOut className="mr-2" />
                              {isLoggingOut ? "Logging out..." : "Log Out"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMenu}
                  className=" lg:hidden text-black hover:text-gray-500 focus:outline-none transition-colors duration-300 pl-3"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>

            <div
              className={`lg:hidden fixed top-14 left-0 right-0 bottom-0 z-40 transform transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "translate-x-0 opacity-100 visible"
                  : "-translate-x-full opacity-0 invisible"
              }`}
            >
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-20" : "opacity-0"
                }`}
                onClick={() => setIsMenuOpen(false)}
              />

              <div
                className={`relative bg-white shadow-2xl border-r border-gray-200 h-full w-4/5 max-w-sm transform transition-all duration-300 ease-out ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="px-4 pt-4 pb-6 space-y-2 overflow-y-auto h-full">
                  {/* Navigation Links */}
                  {navLinks.map((link, index) => (
                    <div
                      key={link.name}
                      className={`transform transition-all duration-300 ease-out ${
                        isMenuOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                      }}
                    >
                      <div className="bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out hover:shadow-sm border border-transparent hover:border-gray-100">
                        {link.dropdown ? (
                          <>
                            <div className="flex justify-between items-center py-3 px-4">
                              <Link
                                href={link.href}
                                className="flex-1 text-left text-gray-800 hover:text-blue-600 font-medium transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {link.name}
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleDropdown(link.name, e);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                aria-expanded={activeDropdown === link.name}
                                aria-label="Toggle dropdown"
                              >
                                <FaChevronDown
                                  className={`h-4 w-4 transition-all duration-300 ease-out ${
                                    activeDropdown === link.name
                                      ? "transform rotate-180 text-blue-600"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Dropdown items with slide animation */}
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-out ${
                                activeDropdown === link.name
                                  ? "max-h-96 opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="bg-gray-50 border-t border-gray-100">
                                {link.dropdown.map((item, dropdownIndex) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-200 ease-in-out border-b border-gray-100 last:border-b-0 transform ${
                                      activeDropdown === link.name
                                        ? "translate-x-0 opacity-100"
                                        : "translate-x-2 opacity-0"
                                    }`}
                                    style={{
                                      transitionDelay:
                                        activeDropdown === link.name
                                          ? `${dropdownIndex * 25}ms`
                                          : "0ms",
                                    }}
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    <span className="relative">
                                      {item.name}
                                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <Link
                            href={link.href}
                            className="block px-4 py-3 text-gray-800 hover:text-blue-600 font-medium transition-all duration-200 ease-in-out relative group"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="relative">
                              {link.name}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </nav>
      </div>
    </ClientOnly>
  );
};

export default Navbar;
