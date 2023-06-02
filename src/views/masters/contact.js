import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button,Modal,ModalHeader} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Contacts = () => {
   
  const [rowData] = useState([
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxster", price: 72000}
  ]);
  const defaultColDef = {
    sortable: true
  };
  const [columnDefs] = useState([

    { field: 'make', sort: 'asc'},
    { field: 'model' },
    { field: 'price' }
  ])

      const [modal, setModal] = React.useState(false);
      const toggle = () => {
        setModal(!modal);
     };
  return (
    <>
      <BreadCrumbs />
        
      <br/>
      <ComponentCard
      actions={
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
      }
        title="Contact"
        subtitle={
          <p>
            A <strong>customer</strong> is an entity that buys goods or services from third parties. 
            Accumulating a profitable and recurring group of customers is the primary goal of a business,
             since this group generates revenue for the business.
          </p>
        }
      >
       <div className="ag-theme-alpine" style={{height: 400}}>
           <AgGridReact
               rowData={rowData}
               defaultColDef={defaultColDef} 
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
      </ComponentCard>
      <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>Add Contact</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
      
      </>
 );
};

 export default Contacts;
