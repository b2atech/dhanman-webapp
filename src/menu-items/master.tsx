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
  GroupOutlined
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
  GroupOutlined
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
      icon: icons.GroupOutlined,
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
          icon: icons.CustomerServiceOutlined
        },
        {
          id: 'vendors',
          title: <FormattedMessage id="vendors" />,
          type: 'item',
          url: '/purchase/vendors/list',
          icon: icons.ShoppingCartOutlined
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
          icon: icons.CustomerServiceOutlined
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
          icon: icons.AuditOutlined
        },
        {
          id: 'paymentreceived',
          title: <FormattedMessage id="paymentreceived" />,
          type: 'item',
          url: '/sales/payments',
          icon: icons.AuditOutlined
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
          title: <FormattedMessage id="Vendors" />,
          type: 'item',
          url: '/purchase/vendors/list',
          icon: icons.ShoppingCartOutlined
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
          icon: icons.AuditOutlined
        },
        {
          id: 'paymentmade',
          title: <FormattedMessage id="paymentmade" />,
          type: 'item',
          url: '/purchase/payments',
          icon: icons.AuditOutlined
        }
      ]
    }
  ]
};

export default master;
