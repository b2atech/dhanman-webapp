//fetching data using API
import React, { useState } from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

const COA = () => {
  const [rowData] = useState([
    { accountcode: "001", accountname: "Cash", accountcategory: "Assets", parentid: 1, activestatus: "Yes",  },
    { accountcode: "002", accountname: "Taxes Payable", accountcategory: "Liabilities", parentid: 2, activestatus: "Yes" },
    { accountcode: "003", accountname: "Owner's Capital", accountcategory: "Equity", parentid: 3, activestatus: "Yes" },
    { accountcode: "004", accountname: "Interest Income", accountcategory: "Revenue", parentid: 4, activestatus: "Yes" },
    { accountcode: "005", accountname: "Interest Income", accountcategory: "Expenses", parentid: 5, activestatus: "Yes" }
  ]);

  const [columnDefs] = useState([
    { checkboxSelection: true, width: 50 },
    { field: 'accountcode', headerName: 'Account Code', width: 235 },
    { field: 'accountname', headerName: 'Account Name', width: 235 , sortable:true,filterable:true},
    { field: 'accountcategory', headerName: 'Account Category', width: 235 },
    { field: 'parentid', headerName: ' Id', width: 235 },
    { field: 'activestatus', headerName: 'Active Status', width: 235 }
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
        title="Chart of Accounts"
        subtitle={
          <p>
            A <strong>Chart Of Accounts (COA)</strong> is a categorized list of all the financial accounts used by a business or organization to record and track its financial transactions
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
        <ModalHeader toggle={toggle}>Add Chart of Accounts</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
    </>
  );
};

export default COA;
