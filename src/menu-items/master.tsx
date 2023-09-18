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
  ProfileOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  AuditOutlined,
  GroupOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const master: NavItemType = {
  id: 'master',
  title: <FormattedMessage id="master" />,
  type: 'group',
  children: [
    {
      id: 'forms-layout',
      title: <FormattedMessage id="master" />,
      type: 'collapse',
      icon: icons.GroupOutlined,
      children: [
        {
          id: 'customers',
          title: <FormattedMessage id="customers" />,
          type: 'item',
          url: '/master/customers',
          icon: icons.CustomerServiceOutlined
        },
        {
          id: 'vendors',
          title: <FormattedMessage id="Vendors" />,
          type: 'item',
          url: '/master/vendors',
          icon: icons.ShoppingCartOutlined
        }
      ]
    },
    {
      id: 'forms-layout',
      title: <FormattedMessage id="sales" />,
      type: 'collapse',
      icon: icons.ProfileOutlined,
      children: [
        {
          id: 'createinvoice',
          title: <FormattedMessage id="createinvoice" />,
          type: 'item',
          url: '/master/createinvoice',
          icon: icons.AuditOutlined
        },
        {
          id: 'invoicelist',
          title: <FormattedMessage id="invoices" />,
          type: 'item',
          url: '/invoice/list',
          icon: icons.UnorderedListOutlined
        }
      ]
    },
    {
      id: 'forms-layout',
      title: <FormattedMessage id="purchase" />,
      type: 'collapse',
      icon: icons.ShoppingCartOutlined,
      children: [
        {
          id: 'createbills',
          title: <FormattedMessage id="createbills" />,
          type: 'item',
          url: '/master/createbills',
          icon: icons.AuditOutlined
        },
        {
          id: 'billslist',
          title: <FormattedMessage id="bills" />,
          type: 'item',
          url: '/master/billslist',
          icon: icons.UnorderedListOutlined
        }
      ]
    }
  ]
};

export default master;
