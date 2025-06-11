import { IconType } from "react-icons/lib";
import { MdOutlineHighQuality } from "react-icons/md";
import { RiGovernmentFill } from "react-icons/ri";
import { IoIosPeople } from "react-icons/io";

export interface SustainabilityItem {
  icon: IconType;
  heading: string;
  description: string;
}

export const sustainabilityItems: SustainabilityItem[] = [
  {
    icon: MdOutlineHighQuality,
    heading: "Quality First",
    description:
      "We aim at achieving the highest international quality standards in all we do.",
  },
  {
    icon: RiGovernmentFill,
    heading: "Integrity & Good corporate governance",
    description:
      "We emphasize and pursue integrity in all our dealings and operations and will not compromise on generally acceptance corporate governance.",
  },
  {
    icon: MdOutlineHighQuality,
    heading: "Consumer focused",
    description:
      "Consumers are our strength and survival. We therefore tailor our operations to suit their needs and expectations.",
  },
  {
    icon: IoIosPeople,
    heading: "People are key",
    description:
      "We foster an enabling environment that builds teamwork, trust and respect.",
  },
];
