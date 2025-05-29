import React from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonProps = (
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
) & {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
};

const baseStyles =
  "inline-block font-semibold py-3 px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants: any = {
  primary:
    "bg-[#0E0E96] hover:bg-white text-white hover:text-[#0E0E96] hover:border-gray-500 hover:border-1 focus:ring-blue-500",
  secondary:
    "bg-transparent hover:bg-[#white] text-[#0E0E96] hover:border-gray-500 border-1 border-[#0E0E96] focus:ring-blue-500",
};

export default function Button(props: ButtonProps) {
  const {
    href,
    variant = "primary",
    className = "",
    children,
    ...rest
  } = props as any;
  const classes = clsx(baseStyles, variants[variant], className);

  if (href) {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link
          href={href}
          className={classes}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }
    // External link
    return (
      <a
        href={href}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
