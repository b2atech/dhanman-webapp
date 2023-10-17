// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  ChromeOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
  EditFilled,
  UnorderedListOutlined,
  CustomerServiceOutlined,
  TableOutlined,
  ProfileOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  AuditOutlined,
  GroupOutlined,
  FieldTimeOutlined,
  TagOutlined,
  PlusSquareOutlined,
  HourglassOutlined,
  BookOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  BankOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
  EditFilled,
  UnorderedListOutlined,
  CustomerServiceOutlined,
  TableOutlined,
  ProfileOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  AuditOutlined,
  GroupOutlined,
  FieldTimeOutlined,
  TagOutlined,
  PlusSquareOutlined,
  HourglassOutlined,
  BookOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  BankOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const master: NavItemType = {
  id: 'company',
  title: <FormattedMessage id="company" />,
  type: 'group',
  children: [
    {
      id: 'company-forms-layout',
      title: <FormattedMessage id="company" />,
      type: 'collapse',
      icon: icons.BankOutlined,
      children: [
        {
          id: 'chartofaccounts',
          title: <FormattedMessage id="chartofaccounts" />,
          type: 'item',
          url: '/sales/chartOfAccounts/list',
          icon: icons.TableOutlined
        },
        {
          id: 'customers',
          title: <FormattedMessage id="customers" />,
          type: 'item',
          url: '/sales/customers/list',
          icon: icons.UserOutlined
        },
        {
          id: 'vendors',
          title: <FormattedMessage id="vendors" />,
          type: 'item',
          url: '/purchase/vendors/list',
          icon: icons.UserOutlined
        }
      ]
    },
    {
      id: 'sales-forms-layout',
      title: <FormattedMessage id="sales" />,
      type: 'collapse',
      icon: icons.ProfileOutlined,
      children: [
        {
          id: 'customers',
          title: <FormattedMessage id="customers" />,
          type: 'item',
          url: '/sales/customers/list',
          icon: icons.UserOutlined
        },
        {
          id: 'invoicelist',
          title: <FormattedMessage id="invoices" />,
          type: 'item',
          url: '/sales/invoices/list',
          icon: icons.UnorderedListOutlined
        },
        {
          id: 'createinvoice',
          title: <FormattedMessage id="createinvoice" />,
          type: 'item',
          url: '/sales/invoices/create',
          icon: icons.PlusSquareOutlined
        },
        {
          id: 'paymentreceived',
          title: <FormattedMessage id="paymentreceived" />,
          type: 'item',
          url: '/sales/payments',
          icon: icons.PlusSquareOutlined
        }
      ]
    },
    {
      id: 'purchase-forms-layout',
      title: <FormattedMessage id="purchase" />,
      type: 'collapse',
      icon: icons.ShoppingCartOutlined,
      children: [
        {
          id: 'vendors',
          title: <FormattedMessage id="vendors" />,
          type: 'item',
          url: '/purchase/vendors/list',
          icon: icons.UserOutlined
        },
        {
          id: 'billslist',
          title: <FormattedMessage id="bills" />,
          type: 'item',
          url: '/purchase/bills/list',
          icon: icons.UnorderedListOutlined
        },
        {
          id: 'createbills',
          title: <FormattedMessage id="createbills" />,
          type: 'item',
          url: '/purchase/bills/create',
          icon: icons.PlusSquareOutlined
        },
        {
          id: 'paymentmade',
          title: <FormattedMessage id="paymentmade" />,
          type: 'item',
          url: '/purchase/payments',
          icon: icons.PlusSquareOutlined
        }
      ]
    },
    {
      id: 'inventory-forms-layout',
      title: <FormattedMessage id="inventory" />,
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'products',
          title: <FormattedMessage id="products" />,
          type: 'item',
          url: '/inventory/products/list',
          icon: icons.TagOutlined
        },
        {
          id: 'createproduct',
          title: <FormattedMessage id="createProduct" />,
          type: 'item',
          url: '/inventory/products/create',
          icon: icons.PlusSquareOutlined
        }
      ]
    },
    {
      id: 'timesheet-forms-layout',
      title: <FormattedMessage id="timesheet" />,
      type: 'collapse',
      icon: icons.FieldTimeOutlined,
      children: [
        {
          id: 'projects',
          title: <FormattedMessage id="projects" />,
          type: 'item',
          url: '/timesheet/projects/list',
          icon: icons.BookOutlined
        },
        {
          id: 'createproduct',
          title: <FormattedMessage id="createProject" />,
          type: 'item',
          url: '/timesheet/projects/create',
          icon: icons.PlusSquareOutlined
        },
        {
          id: 'task',
          title: <FormattedMessage id="tasks" />,
          type: 'item',
          url: '/timesheet/tasks/list',
          icon: icons.OrderedListOutlined
        },
        {
          id: 'createtask',
          title: <FormattedMessage id="createTask" />,
          type: 'item',
          url: '/timesheet/tasks/create',
          icon: icons.PlusSquareOutlined
        },
        {
          id: 'logTime',
          title: <FormattedMessage id="logTime" />,
          type: 'item',
          url: '/timesheet/logtime',
          icon: icons.HourglassOutlined
        }
      ]
    },
    {
      id: 'dev-forms-layout',
      title: <FormattedMessage id="dev" />,
      type: 'collapse',
      icon: icons.FieldTimeOutlined,
      children: [
        {
          id: 'pr',
          title: <FormattedMessage id="pullRequests" />,
          type: 'item',
          url: '/dev/pr',
          icon: icons.BookOutlined
        }
      ]
    }
  ]
};

export default master;
