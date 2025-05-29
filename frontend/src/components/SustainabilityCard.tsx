import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

interface SustainabilityCardProps {
  Icon: IconType;
  heading: string;
  description: string;
}

export default function SustainabilityCard({
  Icon,
  heading,
  description,
}: SustainabilityCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
      <div className="mb-4">
        <Icon size={20} color="blue" />
      </div>
      <h3 className="text-xl font-bold mb-3">{heading}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
