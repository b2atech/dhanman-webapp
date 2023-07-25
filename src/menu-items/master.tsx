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
      id: 'vendors',
      title: <FormattedMessage id="Vendors" />,
      type: 'item',
      url: '/master/vendors',
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
