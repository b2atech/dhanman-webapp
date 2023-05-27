import React from 'react';
import { Table ,Button,Modal,ModalHeader} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
 import ContactAdd from '../../components/apps/contact/ContactAdd';



const BasicTable = () => {
   
      const [modal, setModal] = React.useState(false);
      const toggle = () => {
        setModal(!modal);
     };
  return (
    <>
      <BreadCrumbs />
      {/* <div  className="p-3 border-bottom"> */}
        {/* <Button color="danger" block onClick={toggle} >
          Add 
        </Button> */}
        <div className="button-group" style={{float: 'right'}}>
              <Button className="btn align-Right"   color="success"  onClick={toggle}>
               Add
              </Button>
              <Button className="btn" color="primary ">
               Edit
              </Button>
              <Button className="btn" color="danger">
               Delete
              </Button>
       </div>
<br />
<br />
<br />
      <ComponentCard
     
        title="Contact"
        subtitle={
          <p>
            Use <code>Contact</code> to add zebra-striping to any table row within the{' '}
            <code>&lt;tbody&gt;</code>.
          </p>
        }
      >
        <Table striped responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">firstName</th>
              <th scope="col">lastName</th>
              <th scope="col">Address</th>
              <th scope="col">Phone</th>          
              <th scope="col">Email</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>1356984664</td>
              <td>@mdo@.com</td>

            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
              <td>796564658796</td>

              <td>@fat@.com</td>

            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
              <td>789565164</td>

              <td>@fat@.com</td>

              </tr>
          </tbody>
          </Table>
      </ComponentCard>
      <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>Add Contact</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
      
      </>
 );
};

 export default BasicTable;

