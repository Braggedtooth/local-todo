export const Icons = {
  logo: function Logo(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        {...props}
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#41D1FF" }} />
            <stop offset="100%" style={{ stopColor: "#BD34FE" }} />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#FFEA83" }} />
            <stop offset="100%" style={{ stopColor: "#FFA800" }} />
          </linearGradient>
        </defs>
        <path
          d="M50,5 A45,45 0 1,0 95,50 A45,45 0 1,0 50,5"
          fill="url(#gradient1)"
        />
        <path
          d="M30,50 L45,65 L70,30"
          stroke="url(#gradient2)"
          stroke-width="5"
          fill="none"
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
