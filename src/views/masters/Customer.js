import React, { useState, Avatar} from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact, } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';

const Customer = () => {
    const [rowData] = useState([

        {
            avatar: 'Avatar',
            name: 'Hanna Gover',
            Companyname: 'Daksha',    
            Revenue: '$30',
            Expenses : '$0.00',
           },
           {
             avatar: 'Images',
             name: 'Jonathan Gover',
             Companyname: 'Amazon',
             Revenue: '$100',
             Expenses:'$20',   
           },
           {
             avatar: 'Images',
             name: 'Steave Gover',
             Companyname: 'acer',    
             Revenue: '$630',
             Expenses: '$8.00',

           },
           {
             avatar: 'Images',
             name: 'Mukesh chava',
             Companyname: 'Flipcart',
             Revenue: '$400',
             Expenses: '$0.00',
           },
]);       

  const [columnDefs] = useState([
  {checkboxSelection: true ,width:100},
    {field: 'Avatar' ,headername:'Avatar',width:150 ,renderCell:(params)=> <Avatar src={params.col.Avatar}/> ,sortable:true,filterable:true},
    { field: 'name' ,width:300,sortable:true,filterable:true},
    { field: 'Companyname',width:200,sortable:true,filterable:true },                                    
    { field: 'Revenue',width:200 ,sortable:true,filterable:true},
    { field: 'Expenses',width:250,sortable:true,filterable:true },

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
      </ComponentCard>
    </>
  );

    }  

export default Customer;