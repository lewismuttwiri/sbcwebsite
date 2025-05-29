import { ReactNode } from "react";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";
import { IoWaterOutline } from "react-icons/io5";
import { MdOutlineRecycling } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { IconType } from "react-icons/lib";

export interface SustainabilityItem {
  icon: IconType;
  heading: string;
  description: string;
}

export const sustainabilityItems: SustainabilityItem[] = [
  {
    icon: MdOutlineEnergySavingsLeaf,
    heading: "Renewable Energy",
    description:
      "We're transitioning to renewable energy sources across our production facilities to reduce our carbon footprint.",
  },
  {
    icon: IoWaterOutline,
    heading: "Water Conservation",
    description:
      "Implementing advanced water recycling systems and sustainable water management practices.",
  },
  {
    icon: MdOutlineRecycling,
    heading: "Waste Reduction",
    description:
      "Reducing waste through recycling programs and sustainable packaging solutions.",
  },
  {
    icon: SlPeople,
    heading: "Community Impact",
    description:
      "Supporting local communities through environmental initiatives and education programs.",
  },
];
