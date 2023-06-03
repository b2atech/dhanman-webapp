import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: 'Home' },
  {
    title: 'Masters',
    href: '/masters',
    id: 1,
    icon: <MaterialIcon icon="speed" />,
    collapisble: true,
    children: [
      {
        title: 'Chart of Accounts',
        href: '/masters/coa',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Tags',
        href: '/masters/Tags',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'TagTypes',
        href: '/masters/TagTypes',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Vendors',
        href: '/masters/Vendors',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Invoice Status',
        href: '/masters/Invoice',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Account Categories',
        href: '/masters/AccountCategories',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Currencies',
        href: '/masters/Currencies',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Contact',
        href: '/masters/contact',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.2,
        collapisble: false,
      },      
    ]
  },

  
      // ****************************************************** START TRANSACTION SIDEBAR DROPDOWN
      {
        title: 'Transactions',
        href: '/masters',
        id: 1,
        icon: <MaterialIcon icon="description" />,
        collapisble: true,
        children: [

          {
            title: 'Transactions',
            href: '/masters/Transactions',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.4,
            collapisble: false,
          },
          {
            title: 'Sales',
            href: '/masters/Transactions/Sales',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.3,
            collapisble: false,
          },
          {
            title: 'Categories',
            href: '/masters/Transactions/Categories',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.4,
            collapisble: false,
          },
          {
            title: 'Tags',
            href: '/masters/Transactions/Tags',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          {
            title: 'Expenses',
            href: '/masters/Transactions/Expenses',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          {
            title: 'Bank Transactions',
            href: '/masters/Transactions/BankTransactions',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          {
            title: 'Reconciliation',
            href: '/masters/Transactions/Reconciliation',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          {
            title: 'Recurring',
            href: '/masters/Transactions/Recurring',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          {
            title: 'Bills',
            href: '/masters/Transactions/Bills',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          {
            title: 'Manage Banks',
            href: '/masters/Transactions/ManageBanks',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.5,
            collapisble: false,
          },
          
        ]
      },
      // ****************************************************** END TRANSACTION SIDEBAR DROPDOWN
      // ****************************************************** START REPORTS SIDEBAR DROPDOWN
      {
        title: 'Reports',
        href: '/masters',
        id: 1,
        icon: <MaterialIcon icon="description" />,
        collapisble: true,
        children: [
          {
            title: 'Chart of Accounts',
            href: '/masters/coa',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.1,
            collapisble: false,
          },
          
          {
            title: 'Contact',
            href: '/masters/contact',
            icon: <MaterialIcon icon="radio_button_checked" />,
            id: 1.2,
            collapisble: false,
          },      
        ]
      },
// ****************************************************** END REPORTS SIDEBAR DROPDOWN

  {
    title: 'Dashboards',
    href: '/dashboards',
    id: 1,
    icon: <MaterialIcon icon="speed" />,
    collapisble: true,
    children: [
      {
        title: 'Dashboard 1',
        href: '/dashboards/dashboard1',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.1,
        collapisble: false,
      },
      {
        title: 'Dashboard 2',
        href: '/dashboards/dashboard2',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.2,
        collapisble: false,
      },
      {
        title: 'Dashboard 3',
        href: '/dashboards/dashboard3',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.3,
        collapisble: false,
      },
      {
        title: 'Dashboard 4',
        href: '/dashboards/dashboard4',
        icon: <MaterialIcon icon="radio_button_checked" />,
        id: 1.4,
        collapisble: false,
      },
    ],

  },
  { caption: 'Apps' },
  {
    title: 'Notes',
    href: '/apps/notes',
    icon: <MaterialIcon icon="description" />,
    id: 2.1,
    collapisble: false,
  },
  {
    title: 'Chat',
    href: '/apps/chat',
    icon: <MaterialIcon icon="chat" />,
    id: 2.2,
    collapisble: false,
  },
  {
    title: 'Contacts',
    href: '/apps/contacts',
    icon: <MaterialIcon icon="person_outline" />,
    id: 2.3,
    collapisble: false,
  },
  {
    title: 'Calendar',
    href: '/apps/calendar',
    icon: <MaterialIcon icon="calendar_today" />,
    id: 2.4,
    collapisble: false,
  },
  {
    title: 'Email',
    href: '/apps/email',
    icon: <MaterialIcon icon="mail_outline" />,
    suffix: 'New',
    suffixColor: 'bg-success',
    id: 2.5,
    collapisble: false,
  },
  {
    title: 'CASL',
    href: '/casl',
    icon: <MaterialIcon icon="manage_accounts" />,
    id: 2.6,
    collapisble: false,
  },
  {
    title: 'Ecommerce',
    href: '/ecom',
    icon: <MaterialIcon icon="shopping_cart" />,
    id: 2.7,
    collapisble: true,
    children: [
      {
        title: 'Shop',
        href: '/ecom/shop',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Shop Detail',
        href: '/ecom/shopdetail',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'Ticket',
    href: '/tickt',
    icon: <MaterialIcon icon="confirmation_number" />,
    id: 2.8,
    collapisble: true,
    children: [
      {
        title: 'Ticket List',
        href: '/tickt/ticket-list',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Ticket Detail',
        href: '/tickt/ticket-detail',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'TreeView',
    href: '/apps/treeview',
    icon: <MaterialIcon icon="account_tree" />,
    id: 2.9,
    collapisble: false,
  },
  { caption: 'UI' },
  {
    title: 'UI Elements',
    href: '/ui',
    id: 2,
    suffix: '22',
    suffixColor: 'bg-info',
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
  { caption: 'Forms' },
  {
    title: 'Form Layouts',
    href: '/form-layout',
    icon: <MaterialIcon icon="feed" />,
    id: 3.1,
    collapisble: true,
    children: [
      {
        title: 'Basic Forms',
        href: '/form-layout/form-basic',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Form Grid',
        href: '/form-layout/form-grid',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Form Group',
        href: '/form-layout/form-group',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Form Input',
        href: '/form-layout/form-input',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'Form Pickers',
    href: '/form-pickers',
    icon: <MaterialIcon icon="colorize" />,
    id: 3.2,
    collapisble: true,
    children: [
      {
        title: 'Datepicker',
        href: '/form-pickers/datepicker',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Tags & Select',
        href: '/form-pickers/tag-select',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'Form Validation',
    href: '/form-validation',
    icon: <MaterialIcon icon="assignment_turned_in" />,
    id: 3.3,
    collapisble: false,
  },
  {
    title: 'Form Steps',
    href: '/form-steps',
    icon: <MaterialIcon icon="toc" />,
    id: 3.4,
    collapisble: false,
  },
  {
    title: 'Form Editor',
    href: '/form-editor',
    icon: <MaterialIcon icon="app_registration" />,
    id: 3.5,
    collapisble: false,
  },
  { caption: 'Tables' },
  {
    title: 'Basic Table',
    href: '/tables/basic-table',
    icon: <MaterialIcon icon="table_chart" />,
    id: 4.1,
    collapisble: false,
  },
  {
    title: 'React Table',
    href: '/tables/react-table',
    icon: <MaterialIcon icon="table_rows" />,
    id: 4.2,
    collapisble: false,
  },
  {
    title: 'Bootstrap Datatable',
    href: '/tables/data-table',
    icon: <MaterialIcon icon="backup_table" />,
    id: 4.3,
    collapisble: false,
  },
  { caption: 'Charts' },
  {
    title: 'Apexchart',
    href: '/charts/apex',
    icon: <MaterialIcon icon="scatter_plot" />,
    id: 5.1,
    collapisble: false,
  },
  {
    title: 'ChartJs',
    href: '/charts/chartjs',
    icon: <MaterialIcon icon="area_chart" />,
    id: 5.2,
    collapisble: false,
  },
  { caption: 'Extra' },
  {
    title: 'Sample Pages',
    href: '/sample-pages',
    icon: <MaterialIcon icon="copy_all" />,
    id: 6.1,
    collapisble: true,
    children: [
      {
        title: 'Starterkit',
        href: '/sample-pages/starterkit',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Profile',
        href: '/sample-pages/profile',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Search Result',
        href: '/sample-pages/search-result',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Gallery',
        href: '/sample-pages/gallery',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Helper Class',
        href: '/sample-pages/helper-class',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'Widget',
    href: '/widget',
    icon: <MaterialIcon icon="widgets" />,
    id: 6.4,
    collapisble: false,
  },
  {
    title: 'Icons',
    href: '/icons',
    icon: <MaterialIcon icon="face" />,
    id: 6.2,
    collapisble: true,
    children: [
      {
        title: 'Bootstrap',
        href: '/icons/bootstrap',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Feather',
        href: '/icons/feather',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'Vector Map',
    href: '/map/vector',
    icon: <MaterialIcon icon="place" />,
    id: 6.3,
    collapisble: false,
  },
  {
    title: 'Authentication',
    href: '/auth',
    icon: <MaterialIcon icon="lock" />,
    id: 6.5,
    collapisble: true,
    children: [
      {
        title: 'Login',
        href: '/auth/loginformik',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Register',
        href: '/auth/registerformik',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Maintanance',
        href: '/auth/maintanance',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Lockscreen',
        href: '/auth/lockscreen',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Recover Password',
        href: '/auth/recoverpwd',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Error',
        href: '/auth/404',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
  {
    title: 'DD Menu',
    href: '/',
    id: 7,
    collapisble: true,
    icon: <MaterialIcon icon="subject" />,
    children: [
      {
        title: 'Simple dd 1',
        href: '/',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Simple dd 2',
        href: '/',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
      {
        title: 'Simple dd 3',
        href: '/',
        icon: <MaterialIcon icon="radio_button_checked" />,
        children: [
          {
            title: 'Simple dd 1.1',
            href: '/alerts',
            icon: <MaterialIcon icon="radio_button_checked" />,
          },
        ],
      },
    ],
  },
];

export default SidebarData;
