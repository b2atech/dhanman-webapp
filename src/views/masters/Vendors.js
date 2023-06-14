import React, { useState, Avatar} from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact, } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader } from 'reactstrap';
 import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

const vendors = () => {
    const [rowData] = useState([

        {
            Id: 1,
            Name: 'Georgeanna Ramero',
            ContactPerson:'Zboncak LLC',
            Email: 'qq739v47ggn@claimab.com',
            PhoneNumber: '999-895-9652',
            Address: '19214 110th Rd, Saint Albans, NY, 1141',
            ClientId: 1,
          },
          {
            Id: 2,
            Name: 'Cami Macha',
            ContactPerson:'Lehner-Jacobson',
            Email: 'Camisad@claimab.com',
            PhoneNumber: '999-895-9652',
            Address: '76 Hamilton Ave, Yonkers, NY, 10705',
            ClientId :2,
          },
          {
            Id: 3,
            Name: 'Alda Ziemer',
            ContactPerson:'Champlin',
            Email: 'Ziemer234@claimab.com',
            PhoneNumber: '789-854-8950',
            Address: '930 Fruit Ave, Farrell, PA, 16121',
            ClientId :3,

          },
          {
            Id: 4,
            Name: 'Luciano Macpherson',
            ContactPerson:'Graham Group',
            Email: 'Macpherson34@claimab.com',
            PhoneNumber: '452-652-5230',
            Address: '19103 Stefani Ave, Cerritos, CA, 90703',
            ClientId :4,

          },
          {
            Id: 5,
            Name: 'Dalton Paden',
            ContactPerson:'Brakus',            
            Email: 'Dalton321@claimab.com',
            PhoneNumber: '985-985-7850',
            Address: '3059 Edgewood Park Ct, Commerce Township',
            ClientId :5,

          },
          {
            Id: 6,
            Name: 'Juan Granado',
            ContactPerson:'Kohler',
            Email: 'Granado567@claimab.com',
            PhoneNumber: '230-541-5231',
            Address: 'N Douglas Ave, Arlington Heights',
            ClientId :6,

          },
]);       

  const [columnDefs] = useState([
  {checkboxSelection: true ,width:60},
    {field: 'Id' ,sortable:true,filterable:true,width:60},
    { field: 'Name' ,width:200,sortable:true,filterable:true},
    { field: 'ContactPerson',width:200,sortable:true,filterable:true },                                    
    { field: 'Email',width:200 ,sortable:true,filterable:true},
    { field: 'PhoneNumber',width:150,sortable:true,filterable:true },
    { field: 'Address',width:300,sortable:true,filterable:true },
    { field: 'ClientId',width:150,sortable:true,filterable:true },

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

        title="Vendors">
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

export default vendors;