interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "white" | "gray";
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({
  size = "md",
  color = "blue",
  fullScreen = false,
  className = "",
}: LoaderProps) {
  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
