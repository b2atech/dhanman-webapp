// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { ChromeOutlined, QuestionOutlined, DeploymentUnitOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const master: NavItemType = {
  id: 'master',
  title: <FormattedMessage id="master" />,
  type: 'group',
  children: [
    {
      id: 'customers',
      title: <FormattedMessage id="customers" />,
      type: 'item',
      url: '/master/customers',
      icon: icons.ChromeOutlined
    },
    {
      id: 'vendors',
      title: <FormattedMessage id="Vendors" />,
      type: 'item',
      url: '/master/vendors',
      icon: icons.ChromeOutlined
    },
    {
      id: 'createinvoice',
      title: <FormattedMessage id="createinvoice" />,
      type: 'item',
      url: '/master/createinvoice',
      icon: icons.ChromeOutlined
    },
    {
      id: 'invoicedetails',
      title: <FormattedMessage id="invoicedetails" />,
      type: 'item',
      url: '/master/invoicedetails',
      icon: icons.ChromeOutlined
    },
    {
      id: 'invoicelist',
      title: <FormattedMessage id="invoicelist" />,
      type: 'item',
      url: '/master/invoicelist',
      icon: icons.ChromeOutlined
    },
    {
      id: 'invoiceedit',
      title: <FormattedMessage id="invoiceedit" />,
      type: 'item',
      url: '/master/invoiceedit',
      icon: icons.ChromeOutlined
    },
    {
      id: 'createbills',
      title: <FormattedMessage id="createbills" />,
      type: 'item',
      url: '/master/createbills',
      icon: icons.ChromeOutlined
    },
    {
      id: 'billsdetails',
      title: <FormattedMessage id="billsdetails" />,
      type: 'item',
      url: '/master/billsdetails',
      icon: icons.ChromeOutlined
    },
    {
      id: 'billslist',
      title: <FormattedMessage id="billslist" />,
      type: 'item',
      url: '/master/billslist',
      icon: icons.ChromeOutlined
    },
    {
      id: 'editbill',
      title: <FormattedMessage id="editbill" />,
      type: 'item',
      url: '/master/editbill',
      icon: icons.ChromeOutlined
    },
    {
      id: 'suppliers',
      title: <FormattedMessage id="suppliers" />,
      type: 'item',
      url: '/suppliers',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default master;
