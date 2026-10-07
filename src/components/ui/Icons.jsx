// Inline SVG icons: no icon library, no extra requests.

function Icon({ size = 22, className = '', children, fill = 'none', strokeWidth = 1.6, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={fill === 'none' ? 'currentColor' : 'none'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const HeartIcon = ({ filled = false, ...p }) => (
  <Icon {...p}>
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.600-7.5 10.2-7.500 10.2Z"
      fill={filled ? 'currentColor' : 'none'}
    />
  </Icon>
);

export const BagIcon = (p) => (
  <Icon {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V7a3 3 0 0 1 6 0v1" />
  </Icon>
);

export const UserIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.500 20c1.200-3.600 4.200-5.200 7.500-5.200s6.300 1.600 7.500 5.200" />
  </Icon>
);

export const MenuIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const ChevronDownIcon = (p) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChevronRightIcon = (p) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const ChevronLeftIcon = (p) => (
  <Icon {...p}>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);

export const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </Icon>
);

export const StarIcon = (p) => (
  <Icon fill="currentColor" {...p}>
    <path d="m12 2.800 2.800 5.900 6.400.800-4.700 4.500 1.200 6.400L12 17.300l-5.700 3.100 1.200-6.400L2.800 9.500l6.400-.800L12 2.800Z" />
  </Icon>
);

export const FlowerIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2.200" />
    <path d="M12 9.800c-2.200-1.600-2.200-5 0-6.300 2.200 1.300 2.200 4.700 0 6.300ZM12 14.200c2.200 1.600 2.200 5 0 6.300-2.200-1.300-2.200-4.700 0-6.300ZM9.800 12c-1.600 2.200-5 2.200-6.300 0 1.300-2.200 4.700-2.200 6.300 0ZM14.200 12c1.600-2.200 5-2.200 6.300 0-1.300 2.200-4.700 2.200-6.300 0Z" />
  </Icon>
);

export const LeafIcon = (p) => (
  <Icon {...p}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14Z" />
    <path d="M5 19c3-4 6-7 10-9" />
  </Icon>
);

export const HandIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.900 4.600 4.900.400-3.700 3.200 1.100 4.800L12 13.500 7.800 16l1.100-4.800L5.200 8l4.900-.400L12 3Z" />
    <path d="M5 20.500h14" />
  </Icon>
);

export const TruckIcon = (p) => (
  <Icon {...p}>
    <path d="M3 6.500h11v9.500H3zM14 10h3.800L21 13v3h-7" />
    <circle cx="7.500" cy="17.500" r="1.800" />
    <circle cx="17" cy="17.500" r="1.800" />
  </Icon>
);

export const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.500" />
    <path d="M12 7.500V12l3 2" />
  </Icon>
);

export const PaletteIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3.500a8.500 8.500 0 1 0 0 17c1.400 0 1.900-1 1.500-2-.500-1.300.300-2.500 1.700-2.500H17a3.500 3.500 0 0 0 3.500-3.500c0-5-3.800-9-8.500-9Z" />
    <circle cx="8" cy="11" r="1" />
    <circle cx="11.500" cy="7.800" r="1" />
    <circle cx="15.500" cy="9.500" r="1" />
  </Icon>
);

export const PhoneIcon = (p) => (
  <Icon {...p}>
    <path d="M6.500 3.500h3l1.500 4-2 1.500a11 11 0 0 0 6 6l1.500-2 4 1.500v3a2 2 0 0 1-2.200 2A16.500 16.500 0 0 1 4.500 5.700a2 2 0 0 1 2-2.200Z" />
  </Icon>
);

export const MailIcon = (p) => (
  <Icon {...p}>
    <rect x="3.500" y="5.500" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Icon>
);

export const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21Z" />
    <circle cx="12" cy="10.500" r="2.300" />
  </Icon>
);

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M4 10.500 12 4l8 6.500V19a1 1 0 0 1-1 1h-4.500v-5.500h-5V20H5a1 1 0 0 1-1-1v-8.500Z" />
  </Icon>
);

export const GridIcon = (p) => (
  <Icon {...p}>
    <rect x="4" y="4" width="6.500" height="6.500" rx="1.800" />
    <rect x="13.500" y="4" width="6.500" height="6.500" rx="1.800" />
    <rect x="4" y="13.500" width="6.500" height="6.500" rx="1.800" />
    <rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1.800" />
  </Icon>
);

export const FilterIcon = (p) => (
  <Icon {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
);

export const WhatsAppIcon = ({ size = 22, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M12 2.200a9.700 9.700 0 0 0-8.300 14.800L2.500 21.500l4.600-1.200A9.700 9.700 0 1 0 12 2.200Zm0 1.700a8 8 0 1 1-4.200 14.800l-.300-.200-2.600.700.700-2.600-.200-.300A8 8 0 0 1 12 3.900Zm-3.300 3.900c-.200 0-.500.100-.700.400-.300.300-1 1-1 2.300s1 2.700 1.100 2.900c.100.200 1.900 3 4.700 4.100 2.300.900 2.800.700 3.300.700.500-.100 1.600-.700 1.800-1.300.200-.600.200-1.200.200-1.300-.100-.100-.300-.200-.600-.300l-1.900-.900c-.300-.100-.500-.100-.700.200l-.800 1c-.100.200-.300.200-.600.100-.300-.100-1.200-.400-2.200-1.400-.800-.700-1.400-1.600-1.500-1.900-.200-.300 0-.400.100-.600l.400-.500c.100-.200.200-.300.300-.500.100-.200 0-.400 0-.500l-.900-2.100c-.200-.500-.400-.500-.600-.500h-.400Z" />
  </svg>
);
