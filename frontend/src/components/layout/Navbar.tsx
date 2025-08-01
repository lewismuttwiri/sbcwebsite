"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "./Container";
import { CiShoppingCart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { FiPackage, FiLogOut, FiLayout, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/hooks/useCart";

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

//I want the brands section images to be an array of brands containing that name with a smooth animation

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cart, totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  const isLoggedIn = !!user;
  const isHR = user?.entity?.user_role == 5;
  const isProcurement = user?.entity?.user_role == 6;
  const isAdmin = user?.entity?.user_role == 1;
  console.log("user is Customer", user);
  console.log("user is Hr", isHR);

  // Account links for the dropdown menu
  const accountLinks = [
    { name: "Orders", href: "/orders", icon: <FiPackage className="mr-2" /> },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FiLayout className="mr-2" />,
    },
    ...(isHR
      ? [
          {
            name: "Applications",
            href: "/applications",
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

  // Close dropdown when path changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking outside or when route changes
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

    // Close dropdown when route changes
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
      // If clicking the same link that's already active, close the dropdown
      if (activeDropdown === link.name) {
        setActiveDropdown(null);
        return;
      }
      // Open the dropdown for the clicked link
      setActiveDropdown(link.name);
    } else {
      // If no dropdown, navigate to the link
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
        { name: "Become a Stockist", href: "/partner/distributor" },
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
          href: "/contact/distributor",
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
      <nav className="bg-[#0E0E96] shadow-md sticky top-0 z-50">
        <Container className="px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
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
                  <h3 className="md:text-xl text-white  font-bold text-sm ">
                    SBC KENYA LTD
                  </h3>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
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
                                    ? "text-white font-medium"
                                    : "text-white hover:opacity-70"
                                }`}
                                onClick={(e) => handleNavLinkClick(link, e)}
                              >
                                {link.name}
                              </button>
                              <button
                                onClick={(e) => handleNavLinkClick(link, e)}
                                className="p-1 text-white hover:opacity-80 focus:outline-none"
                                aria-expanded={activeDropdown === link.name}
                                aria-label="Toggle dropdown"
                              >
                                <FaChevronDown
                                  className={`h-4 w-4 font-bold transition-transform duration-200 ${
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
                                  ? "text-white font-medium"
                                  : "text-white hover:opacity-80"
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
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-black transition-colors duration-300"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {item.name}
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

            {/* Cart, Account Icons, and Mobile Menu Button */}
            <div className="flex items-center space-x-4 justify-end">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-white transition-colors duration-300"
              >
                <CiShoppingCart size={24} color="white" />
                <span
                  key={`cart-count-${totalItems}`}
                  className={`absolute -top-3 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-50 transition-opacity ${
                    totalItems > 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              </Link>

              {/* Account Dropdown - Desktop */}
              <div className="relative hidden md:block">
                <div
                  className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 font-medium transition-colors duration-300 border-1 border-white rounded-full p-2 cursor-pointer nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("account", e);
                  }}
                >
                  <MdAccountCircle size={22} color="white" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                              className={`flex items-center px-4 py-3 text-gray-800 hover:bg-black hover:text-white transition-colors duration-300 ${
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
                  className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 font-medium transition-colors duration-300 border-1 border-white rounded-full p-2 cursor-pointer nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("mobile-account", e);
                  }}
                >
                  <MdAccountCircle size={22} color="white" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
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
                className=" lg:hidden text-white hover:text-gray-500 focus:outline-none transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <div className="flex justify-start items-center py-2 text-gray-800 hover:text-blue-600 font-medium nav-link">
                      {link.dropdown ? (
                        <>
                          <Link
                            href={link.href}
                            className="flex-1 text-left"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDropdown(link.name, e);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                            aria-expanded={activeDropdown === link.name}
                            aria-label="Toggle dropdown"
                          >
                            <FaChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                activeDropdown === link.name
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          className="block px-3 py-2 text-gray-800 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                    {link.dropdown && activeDropdown === link.name && (
                      <div className="relative left-0 mt-2 w-56 bg-white z-50 dropdown-container">
                        <div className="py-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-white hover:text-black transition-colors duration-300"
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMenuOpen(false);
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </nav>
    </ClientOnly>
  );
};

export default Navbar;
