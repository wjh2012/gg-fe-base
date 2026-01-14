export interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavGroup {
  title: string;
  url: string;
  items?: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    title: "Profile",
    url: "/profile",
  },
  {
    title: "Building Your Application",
    url: "#",
    items: [
      {
        title: "Routing",
        url: "#",
      },
      {
        title: "Data Fetching",
        url: "#",
      },
      {
        title: "Rendering",
        url: "#",
      },
    ],
  },
];
