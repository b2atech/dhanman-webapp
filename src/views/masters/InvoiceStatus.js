import React, { useState } from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

const InvoiceStatus = () => {
  const [rowData] = useState([
    { accountstatusid: "001", accountstatusname: "Ram Kadam", accountstatusdiscription: "discriptionone" },
    { accountstatusid: "002", accountstatusname: "Pratik Patil", accountstatusdiscription: "discriptiontwo"},
    { accountstatusid: "003", accountstatusname: "Subhash Chavan", accountstatusdiscription: "discriptionthree" },
    { accountstatusid: "004", accountstatusname: "Priya Mane", accountstatusdiscription: "discriptionfour" },
    { accountstatusid: "005", accountstatusname: "Samrath Koli", accountstatusdiscription: "discriptionfive" }
  ]);

  const [columnDefs] = useState([
    { checkboxSelection: true, width: 50 },
    { field: 'accountstatusid', headerName: 'Id' },
    { field: 'accountstatusname', headerName: 'Name' },
    { field: 'accountstatusdiscription', headerName: 'Description'},
  ]);

  const [modal, setModal] = React.useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <BreadCrumbs />
      <br />
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
        title="Invoices status"
        subtitle={
          <p>
           <strong>Invoice Status</strong> refers to the current state or condition of an invoice within the accounting process. It helps track and manage the progress of invoices from creation to payment
          </p>
        }
      >
        <div className="ag-theme-alpine" style={{height: 400}}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
          ></AgGridReact>
        </div>
      </ComponentCard>
      <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>Add Invoices status</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
    </>
  );
};

export default InvoiceStatus;