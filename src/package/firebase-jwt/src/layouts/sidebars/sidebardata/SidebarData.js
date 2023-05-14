import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: "Home" },
  {
    title: "Dashboard",
    href: "/starter",
    icon: <MaterialIcon icon="speed" />,
    id: 1,
    collapisble: false,
  },
  { caption: "UI" },
  {
    title: "UI Elements",
    href: "/ui",
    id: 2,
    suffix: "8",
    suffixColor: "bg-info",
    icon: <MaterialIcon icon="grid_view" />,
    collapisble: true,
    children: [
      {
        title: "Alert",
        href: "/ui/alerts",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Buttons",
        href: "/buttons",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Cards",
        href: "/cards",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Grid",
        href: "/grid",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Badges",
        href: "/badges",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Table",
        href: "/table",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Forms",
        href: "/forms",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Breadcrumbs",
        href: "/breadcrumbs",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "About",
        href: "/about",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },

  {
    title: "DD Menu",
    href: "/",
    id: 3,
    collapisble: true,
    icon: <MaterialIcon icon="radio_button_checked" />,
    children: [
      {
        title: "Simple dd 1",
        href: "/",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Simple dd 2",
        href: "/",
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: "Simple dd 3",
        href: "/",
        icon: <MaterialIcon icon="radio_button_checked" />,
        children: [
          {
            title: "Simple dd 1.1",
            href: "/alerts",
            icon: <MaterialIcon icon="radio_button_checked" />,
          },
        ],
      },
    ],
  },
];

export default SidebarData;
