import React from 'react';
import { Card,Table,     FormGroup,  Input,Form ,Button, } from 'reactstrap';
import * as Icon from 'react-feather';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import user1 from '../../assets/images/users/user1.jpg';
import user2 from '../../assets/images/users/user2.jpg';
import user3 from '../../assets/images/users/user3.jpg';
import user4 from '../../assets/images/users/user4.jpg';
import user5 from '../../assets/images/users/user5.jpg';


const changeBackdrop = (e) => {
  let { value } = e.target;
  if (value !== 'active') {
    value = JSON.parse(value);
  }

};
const tableData = [
  {
    avatar: user1,
    Firstname: 'Hanna ',
    Lastname: ' Gover',
   Companyname: 'Daksha',    
   Revenue: '$30',
   Expenses : '$0.00',
    
  },
  {
    avatar: user2,
    Firstname: 'Jonathan Gover',
    Lastname: ' Gover',
    Companyname: 'Amazon',
    Revenue: '$100',
    Expenses:'$20',   
  },
  {
    avatar: user3,
    Firstname: 'Steave',
    Lastname: ' Gover',
    Companyname: 'acer',    
    Revenue: '$630',
    Expenses: '$8.00',
  
  },
  {
    avatar: user4,
    Firstname: 'Mukesh chava',
    Lastname: ' Gover',
    Companyname: 'Flipcart',
    Revenue: '$400',
    Expenses: '$0.00',
    
  },
  {
    avatar: user5,
    Firstname: 'Thuklk luu',
    Lastname: ' Gover',
    Companyname: 'Daksha',
    Revenue: '$200',
    Expenses: '$0.00',
    
  },
];

  
  const ProjectTables = () => {
    
    return (
<>
<BreadCrumbs />

      <div className="button-group" style={{float: 'right'}}>
      <Button className="btn" color="primary">
       Add
      </Button>
      <Button className="btn" color="success" >
       Edit
      </Button>
      <Button className="btn" color="danger" >
       Delete
      </Button>

</div>
      <div>
      
          <Form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
              <FormGroup >
                <FormGroup check>
                      <Input type="checkbox" id="check1" />
                <Input md="9"
                  type="select"
                  name="backdrop"
                  id="backdrop"
                  onChange={(e) => changeBackdrop(e)}
                >
                   <h7 type="text-muted">Expenses</h7>
                  <option defaultValue="active">Active</option>
                  <option defaultValue="arachived">Arachived</option>
                </Input>
                </FormGroup>
              </FormGroup>
             &nbsp; &nbsp;
              <FormGroup >
                <Input md="9"
                  type="select"
                  name="backdrop"
                  id="backdrop"
                  onChange={(e) => changeBackdrop(e)}
                >
                  <option defaultValue="created date">All</option>
                  <option defaultValue="name">All Unpaid</option>
                  <option defaultValue="bill">open</option>
                  <option defaultValue="price">Sent</option>
                  <option defaultValue="price">Viewed</option>
                  <option defaultValue="price">Payment failed</option>
                  <option defaultValue="price">Refunded</option>
                  <option defaultValue="price">Partial</option>
                  <option defaultValue="price">Paid</option>
                  <option defaultValue="price">Close</option>
                  <option defaultValue="price">Draft</option>

                </Input>
                </FormGroup>         
             &nbsp; &nbsp;
              <FormGroup >
                <Input md="9"
                  type="select"
                  name="backdrop"
                  id="backdrop"
                  onChange={(e) => changeBackdrop(e)}
                >
                  <option defaultValue="created date">Created Date</option>
                  <option defaultValue="name">name</option>
                  <option defaultValue="bill">Bill</option>
                  <option defaultValue="price">Price</option>
                </Input>
              </FormGroup>
        </Form>
          <Card>
            <Table className="no-wrap mt-3 align-middle" hover responsive borderless>
              <tbody>
                {tableData.map((tdata) => (
                  <tr key={tdata.name} className="border-top">
                    <td>
                    <div className="d-flex align-items-center p-2">
                    <FormGroup check>
                      <Input type="checkbox" id="check1" />
                    </FormGroup>
                          <img
                          src={tdata.avatar}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                        <div className="ms-3">
                          <h6 className="mb-1">{tdata.Firstname}{tdata.Lastname}</h6>
                          <span className="text-muted">{tdata.Companyname}</span>
                        </div>
                        </div>
                    </td>
                    <td>
                      <div Revenue="ms-12" >
                          <h7 type="text-muted" className="font-size-4px"/>Revenue
                         <h5 Revenue="mb-0" className=" text-info">{tdata.Revenue}</h5>
                        </div>
                        </td>
                        <td>
                        <div Expenses="ms-12" >
                        <h7 type="text-muted" className="table-title"/>Expenses
                         <h5 Expenses="mb-0" className="text-success">{tdata.Expenses}</h5>
                        </div>
                          </td>
                          <td>
                          <td style={{ cursor: 'pointer' }}><Icon.ChevronDown size={20} />&nbsp;</td>
                          <td><Icon.Settings size={20} /> </td>
                          <td><Icon.Trash2 size={20} /> </td>
                          </td>
                            </tr>
                ))}
              
             </tbody>
            </Table>
          </Card>
      </div>
      
      </>
     
    );
  };
   export default ProjectTables;
  

