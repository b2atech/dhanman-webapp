import React, { useState } from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal, ModalHeader } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';
import ContactAdd from '../../components/apps/contact/ContactAdd';

const Currencies = () => {
  const [rowData] = useState([
    { currencyid: "001", currencycode:"INR",  currencyname: "Rupee", currencysymbol : "₹", exchangerate: "01.00"},
    { currencyid: "002", currencycode:"USD", currencyname: "Doller", currencysymbol : "$", exchangerate: "82.29" },
    { currencyid: "003", currencycode:"GBP", currencyname: "Pound" , currencysymbol : "£", exchangerate: "0.009"},
    { currencyid: "004", currencycode:"EUR", currencyname: "Euro", currencysymbol : "€", exchangerate: "0.011" },
    { currencyid: "005", currencycode:"RUB", currencyname: "Ruble", currencysymbol : "₽", exchangerate: "0.98"}
  ]);

  const [columnDefs] = useState([
    { checkboxSelection: true, width: 50 },
    { field: 'currencyid', headerName: 'Id' },
    { field: 'currencycode', headerName: 'Currency Code' },
    { field: 'currencyname', headerName: 'Currency Name' },
    { field: 'currencysymbol', headerName: 'Symbol' },
    { field: 'exchangerate', headerName: 'Exchange Rate' },
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
        title="Currencies"
        subtitle={
          <p>
            In accounting, <strong>Currencies</strong> refer to the units of money used to measure and express the value of financial transactions.
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
        <ModalHeader toggle={toggle}>Add Currencies</ModalHeader>
        <ContactAdd click={toggle} />
      </Modal>
    </>
  );
};

export default Currencies;