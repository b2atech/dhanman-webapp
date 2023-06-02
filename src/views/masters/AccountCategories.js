import React, { useState } from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

const AccountCategories = () => {
    const [rowData] = useState([
        { accountcatid: "001", accountchildid: "123", accountcategoryname: "Assets", accountcatdscription: "Discriptionone"  },
        { accountcatid: "002", accountchildid: " 654", accountcategoryname: "Liabilities", accountcatdscription: "Discriptiontwo"},
        { accountcatid: "003", accountchildid: "5487", accountcategoryname: "Equity", accountcatdscription: "Discriptionthree"},
        { accountcatid: "004", accountchildid: "214", accountcategoryname: "Revenue", accountcatdscription: "Discriptionfour"},
        { accountcatid: "005", accountchildid: "546", accountcategoryname: "Expenses", accountcatdscription: "Discriptionfour"}
      ]);

  const [columnDefs] = useState([
    { checkboxSelection: true, width: 50 },
    { field: 'accountcatid', headerName: 'Account Code', width: 235 },
    { field: 'accountchildid', headerName: 'Client Id', width: 235 , sortable:true,filterable:true},
    { field: 'accountcategoryname', headerName: 'Name', width: 235 },
    { field: 'accountcatdscription', headerName: 'Description', width: 235 },
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
        title="Account Categories "
        subtitle={
          <p>
           <strong>Account Categories</strong> refer to the classification or grouping of accounts based on their nature, purpose, or financial characteristics.They help organize and classify financial transactions and provide structure to the Chart Of Accounts.
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
        <ModalHeader toggle={toggle}>Add Account Categories</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
    </>
  );
};

export default AccountCategories;