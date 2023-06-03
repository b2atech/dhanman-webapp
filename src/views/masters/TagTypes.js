import React, { useState, Avatar} from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact, } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';

const TagTypes = () => {
    const [rowData] = useState([

        {
            Id: 1,
            ClientId:"001",
            Name: 'Georgeanna Ramero',
            Description: 'Devolved Tangible Projection',
          },
          {
            Id: 2,         
           ClientId:"002",
           Name: 'Cami Macha',
            Description: 'Horizontal Bi-Directional Capability',

          },
          {
            Id: 3,
            ClientId:"003",
            Name: 'Alda Ziemer',
            Description: 'Switchable Multimedia Hub',

          },
          {
            Id:4,
            ClientId:"004",
            Name: 'Luciano Macpherson',
            Description: 'Versatile Web-Enabled Groupware',

          },
          {
            Id: 5,
            ClientId:"005",
            Name: 'Dalton Paden',
            Description: 'Cloned 6Thgeneration Access',

          },
         
]);       

  const [columnDefs] = useState([
  {checkboxSelection: true ,width:100},
    {field: 'Id' ,headername:'Avatar',width:150 ,renderCell:(params)=> <Avatar src={params.col.Avatar}/> ,sortable:true,filterable:true},
    { field: 'ClientId' ,width:150,sortable:true,filterable:true},
    { field: 'Name',width:350,sortable:true,filterable:true },                                    
    { field: 'Description',width:500 ,sortable:true,filterable:true},

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

        title="Tag Types">
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

export default TagTypes;