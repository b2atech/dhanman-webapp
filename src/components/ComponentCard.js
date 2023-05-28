import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import PropTypes from 'prop-types';

const ComponentCard = ({ children, title, subtitle,actions }) => {
  return (
    <Card>
      <CardTitle tag="h4" className="border-bottom px-4 py-3 mb-0">
      <div className="d-md-flex">
        {title}
        <div className="ms-auto mt-3 mt-md-0">{actions}</div>
        </div>
      </CardTitle>
      <CardSubtitle className="text-muted  px-4 py-3 mb-0">{subtitle}</CardSubtitle>
      <CardBody>
        <div className='pt-0' >{children}</div>
      </CardBody>
    </Card>
  );
};

ComponentCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
};

export default ComponentCard;
