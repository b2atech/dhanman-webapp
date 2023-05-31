import React, { useState } from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const COA = () => {
  const [rowData] = useState([
    { accountcode: "001", accountname: "Cash", accountcategory: 1, parentid: 2, activestatus: "Yes" },
    { accountcode: "002", accountname: "liabilities", accountcategory: 2, parentid: 1, activestatus: "Yes" },
    { accountcode: "003", accountname: "equity", accountcategory: 3, parentid: 5, activestatus: "Yes" },
    { accountcode: "004", accountname: "expenses", accountcategory: 4, parentid: 3, activestatus: "Yes" },
    { accountcode: "005", accountname: "revenue", accountcategory: 5, parentid: 4, activestatus: "Yes" }
  ]);

  const [columnDefs] = useState([
    { checkboxSelection: true, width: 50 },
    { field: 'accountcode', headerName: 'Account Code' },
    { field: 'accountname', headerName: 'Account Name' },
    { field: 'accountcategory', headerName: 'Account Category' },
    { field: 'parentid', headerName: 'Parent Id' },
    { field: 'activestatus', headerName: 'Active Status' }
  ]);

  return (
    <>
    <BreadCrumbs />
      <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
    </>
  );
};

export default COA;
