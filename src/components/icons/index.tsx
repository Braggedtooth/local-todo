import { cn } from "@/lib/utils";
import { SVGProps } from "react";

export const Icons = {
  logo: function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={103}
        height={114}
        viewBox="0 0 103 114"
        className={cn("h-6 w-6", className)}
        {...props}
      >
        <circle cx={50} cy={50} r={50} fill="#7B61FF" />
        <ellipse cx={68} cy={85} rx={32} ry={29} fill="#7B61FF" />
        <path
          d="M57.811 24.8727C62.9984 21.9008 69.4939 25.4615 69.7788 31.4331L71.4977 67.4676C71.7955 73.7099 65.1414 77.8679 59.6614 74.8639L26.6401 56.7629C21.16 53.7589 21.0862 45.9128 26.5087 42.8062L57.811 24.8727Z"
          fill="#FFA800"
        />
      </svg>
    );
  },
  menu: function Menu(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        {...props}
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    );
  },
};
