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
    title: "대시보드",
    url: "/dashboard",
  },
  {
    title: "Getting Started",
    url: "#",
    items: [
      {
        title: "Installation",
        url: "#",
      },
      {
        title: "Project Structure",
        url: "#",
      },
    ],
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
