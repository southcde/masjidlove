import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({
  size = 24,
  ...props
}: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11.5 12 5l8 6.5V20h-5.5v-5.5h-5V20H4z" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s6-6.4 6-10.2A6 6 0 0 0 6 10.8C6 14.6 12 21 12 21z" />
      <circle cx="12" cy="10.6" r="2.2" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M4 10.5h16" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5 20c1.7-3.4 4.1-5.1 7-5.1s5.3 1.7 7 5.1" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 5.5l6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function IconBack(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6v4.9l3.2 1.9" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.6 15.6 20.5 20.5" />
    </svg>
  );
}

export function IconDirections(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20V5M6.5 10.5 12 5l5.5 5.5" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={1.9}>
      <path d="M5 12.8 9.6 17.4 19 8" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function IconQuestion(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3v1.6" />
      <path d="M13 16.6h.01" strokeWidth={1.9} />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.2 20.8 19.8H3.2z" />
      <path d="M12 9.6v4.2" />
      <path d="M12 16.8h.01" strokeWidth={1.9} />
    </svg>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="6.8" width="17" height="13" rx="2.5" />
      <circle cx="12" cy="13.3" r="3.3" />
      <path d="M9 6.8l1.2-2.3h3.6L15 6.8" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 16.5V11a5 5 0 0 1 10 0v5.5h1.5v1.5H5.5v-1.5z" />
      <path d="M10.4 19.6a1.8 1.8 0 0 0 3.2 0" />
    </svg>
  );
}

export function IconBookmark(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 4.5h11v16l-5.5-4.4-5.5 4.4z" />
    </svg>
  );
}

export function IconLocate(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M4.5 7.5 12 13l7.5-5.5" />
    </svg>
  );
}

export function IconPeople(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.2 19.5c1.3-3 3.4-4.5 5.8-4.5s4.5 1.5 5.8 4.5" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M17.4 15.4c1.4.7 2.5 2 3.4 4.1" />
    </svg>
  );
}

export function IconAdmin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="8" r="3.4" />
      <path d="M3.6 19.6c1.2-3.1 3.4-4.7 6.4-4.7" />
      <circle cx="16.8" cy="16.8" r="2.6" />
      <path d="M16.8 12.6v1.2M16.8 19.8v1.2M12.6 16.8h1.2M19.8 16.8h1.2" />
    </svg>
  );
}

export function IconApple(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M16.2 12.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.8 1.1 1.6 2.2 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.6-.9.9-1.7 1.1-2.2-2.5-.9-2.6-3.9-2.6-4z" />
      <path d="M14.4 6.1c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" />
    </svg>
  );
}

export function IconGoogle(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1C19.9 17.5 21 15.1 21 12.2z" />
      <path d="M12 21.5c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.6-1.8.9-2.9.9-2.3 0-4.2-1.5-4.9-3.6H4v2.5C5.5 19.6 8.5 21.5 12 21.5z" />
      <path d="M7.1 14.2c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.9H4C3.4 9.2 3 10.6 3 12.3s.4 3.1 1 4.4l3.1-2.5z" />
      <path d="M12 6.8c1.3 0 2.5.5 3.4 1.3l2.7-2.7C16.5 3.9 14.4 3 12 3 8.5 3 5.5 4.9 4 7.9l3.1 2.5C7.8 8.3 9.7 6.8 12 6.8z" />
    </svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <svg {...base(props)} stroke="none" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}


export function IconBook(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10.2 8.8 5 3.2-5 3.2z" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />
    </svg>
  );
}

export function IconCoins(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="9" cy="8" rx="5.5" ry="2.8" />
      <path d="M3.5 8v4c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8V8" />
      <path d="M14.5 11.6c3 0 6 1.1 6 2.7v3.2c0 1.5-2.5 2.7-5.5 2.7-2.2 0-4-.6-5-1.5" />
    </svg>
  );
}

export function IconDrop(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5s6 6.2 6 10.6a6 6 0 0 1-12 0c0-4.4 6-10.6 6-10.6Z" />
    </svg>
  );
}

export function IconCalculator(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M8.5 8h7M8.5 12.5h.01M12 12.5h.01M15.5 12.5h.01M8.5 16h.01M12 16h.01M15.5 16h.01" />
    </svg>
  );
}
