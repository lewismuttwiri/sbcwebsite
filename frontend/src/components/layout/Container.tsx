import { ReactNode, ElementType } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export default function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={`
        w-[95%] max-w-[1300px] mx-auto
        px-4 sm:px-6 lg:px-8
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
