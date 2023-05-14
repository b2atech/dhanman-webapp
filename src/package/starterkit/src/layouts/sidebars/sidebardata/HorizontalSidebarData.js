import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: 'Home' },
  {
    title: "Dashboard",
    href: "/starter",
    icon: <MaterialIcon icon="speed" />,
    id: 1,
    suffix: "New",
    suffixColor: "bg-success",
    collapisble: false,
  },

  { caption: 'UI' },
  {
    title: 'UI Elements',
    href: '/ui',
    id: 3,
    suffix: '22',
    suffixColor: 'bg-danger',
    ddType: "mega-dropdown",
    icon: <MaterialIcon icon="grid_view" />,
    collapisble: true,
    children: [
      {
        title: 'Alert',
        href: '/ui/alerts',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Badges',
        href: '/ui/badges',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Buttons',
        href: '/ui/buttons',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Button Group',
        href: '/ui/button-group',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Breadcrumbs',
        href: '/ui/breadcrumbs',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Cards',
        href: '/ui/cards',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Collapse',
        href: '/ui/collapse',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Dropdown',
        href: '/ui/dropdown',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Grid',
        href: '/ui/grid',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'List Group',
        href: '/ui/list-group',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Modal',
        href: '/ui/modal',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Navbar',
        href: '/ui/navbar',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Navs',
        href: '/ui/nav',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Pagination',
        href: '/ui/pagination',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Popover',
        href: '/ui/popover',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Progress',
        href: '/ui/progress',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Spinner',
        href: '/ui/spinner',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Tabs',
        href: '/ui/tabs',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Toasts',
        href: '/ui/toasts',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Tooltip',
        href: '/ui/tooltip',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  // {
  //   title: 'DD Menu',
  //   href: '/',
  //   id: 7,
  //   collapisble: true,
  //   icon: <MaterialIcon icon="radio_button_checked" />,
  //   children: [
  //     {
  //       title: 'Simple dd 1',
  //       href: '/',
  //       icon: <MaterialIcon icon="radio_button_checked" />,
  //     },
  //     {
  //       title: 'Simple dd 2',
  //       href: '/',
  //       icon: <MaterialIcon icon="radio_button_checked" />,
  //     },
  //     {
  //       title: 'Simple dd 3',
  //       href: '/',
  //       icon: <MaterialIcon icon="radio_button_checked" />,
  //       children: [
  //         {
  //           title: 'Simple dd 1.1',
  //           href: '/alerts',
  //           icon: <MaterialIcon icon="radio_button_checked" />,
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default SidebarData;
