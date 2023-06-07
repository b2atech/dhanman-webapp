import React, { useState, Avatar} from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import { AgGridReact, } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';

const Tags = () => {
    const [rowData] = useState([

        {
            Id: 1,
            ClientId:1,
            Name: 'Georgeanna Ramero',
            Description: 'Devolved Tangible Projection',
            TagTypeId:1,
          },
          {
            Id: 2,         
           ClientId:2,
           Name: 'Cami Macha',
            Description: 'Horizontal Bi-Directional Capability',
            TagTypeId:2,

          },
          {
            Id: 3,
            ClientId:3,
            Name: 'Alda Ziemer',
            Description: 'Switchable Multimedia Hub',
            TagTypeId:3,

          },
          {
            Id:4,
            ClientId:4,
            Name: 'Luciano Macpherson',
            Description: 'Versatile Web-Enabled Groupware',
            TagTypeId:4,

          },
          {
            Id: 5,
            ClientId:5,
            Name: 'Dalton Paden',
            Description: 'Cloned 6Thgeneration Access',
            TagTypeId:5,

          },
         
]);       

  const [columnDefs] = useState([
  {checkboxSelection: true ,width:100},
    {field: 'Id' ,width:150  ,sortable:true,filterable:true},
    { field: 'ClientId' ,width:150,sortable:true,filterable:true},
    { field: 'Name',width:300,sortable:true,filterable:true },                                    
    { field: 'Description',width:350 ,sortable:true,filterable:true},
    { field: 'TagTypeId',width:150,sortable:true,filterable:true },

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

        title="Tags">
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

export default Tags;