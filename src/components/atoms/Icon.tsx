import Image from "next/image";
import { iconMap, IconName } from "./iconMap";

type Props = {
    name: IconName;
    size?: number;
    className?: string;
};

export default function Icon({
    name,
    size = 20,
    className = "",
}: Props) {
  // 👇 ADD THIS
//   console.log("ICON NAME:", name);
//   console.log("ICON FILE:", iconMap[name]);

    return (
        <Image
            src={`/icons/${iconMap[name]}.svg`}
            width={size}
            height={size}
            alt={name}
            className={className}
        />
    );
}
