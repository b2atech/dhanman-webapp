import React, { useState} from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact, } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

const Customer = () => {
    const [rowData] = useState([

        {
            Id: 1,
            Name: 'Navjeevan HighSchool Jsp',
            ContactPerson:'HeadSir',
            Email: 'nhj@gmail.com',
            PhoneNumber: '1234567890',
            Address: '9th lane Jsp',
           
           },
           {
            Id: 2,
            Name: 'Jantara HighSchool Jsp',
            ContactPerson:'HeadSir',
            Email: 'jhj@gmail.com',
            PhoneNumber: '1234567891',
            Address: 'near Bsnl office, Jsp',
           },
           {
            Id: 3,
            Name: 'John Smith',
            ContactPerson:'John',
            Email: 'johnsmith@example.com',
            PhoneNumber: '55-123-4567',
            Address: '123 Main Street',
           
           },
           {
            Id: 4,
            Name: 'Microsoft',
            ContactPerson:'Microsoft',
            Email: 'Microsoft@gmail.com',
            PhoneNumber: '999-895-9652',
            Address: 'One Microsoft Way, Redmond, WA',
           },
]);       

  const [columnDefs] = useState([
  {checkboxSelection: true ,width:40},
  { field: 'Id' ,width:60,sortable:true,filterable:true},
  // { field: 'ClientId' ,width:100,sortable:true,filterable:true},
  { field: 'Name' ,width:300,sortable:true,filterable:true},
  { field: 'ContactPerson' ,width:180,sortable:true,filterable:true},
    { field: 'Email',width:200,sortable:true,filterable:true },                                    
    { field: 'PhoneNumber',width:150 ,sortable:true,filterable:true},
    { field: 'Address',width:300,sortable:true,filterable:true },

  ]);

  const [modal, setModal] = React.useState(false);
  const toggle = () => {
    setModal(!modal);
  };
   
  
  return (
    <>
      <BreadCrumbs />
      <ComponentCard 
        actions={
          <div className="button-group" style={{ float: 'right' }}>
            <Button className="btn align-Right" color="success" onClick={toggle}>
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
        
        title="Customer">
        <div className="ag-theme-alpine" style={{height: 400}}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
          ></AgGridReact>
        </div>
        <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>Add Customer</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
      </ComponentCard>
    </>
  );
         
    }  

export default Customer;