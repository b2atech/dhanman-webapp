import React from 'react';
import { Table,   Col,  FormGroup,  Input,Form } from 'reactstrap';
import * as Icon from 'react-feather';

import ComponentCard from '../../components/ComponentCard';
import user1 from '../../assets/images/users/user1.jpg';
import user2 from '../../assets/images/users/user2.jpg';
import user3 from '../../assets/images/users/user3.jpg';
import user4 from '../../assets/images/users/user4.jpg';

const changeBackdrop = (e) => {
  let { value } = e.target;
  if (value !== 'Contact') {
    value = JSON.parse(value);
  }
};
const tableData = [
    {
      avatar: user1,
      Sendto: 'Hanna Gover',
     Date: 'May 25',    
     Estimate: '#KKAGRO-0001',
     Total : 'INR₹200.00',
      
    },
    {
      avatar: user2,
      Sendto: 'Jonathan Gover',
      Date: 'May 21',
      Estimate: ' #B2A-0002',
      Total: '$400.00',
     
    },
    {
      avatar: user3,
      Sendto: 'Steave',
      Date: 'May 26',    
      Estimate: '#APPSEEDS-0001',
        Total: 'INR₹100.00',
    
    },
    {
      avatar: user4,
      Sendto: 'Mukesh chava',
      Date: 'May 20',
      Estimate: ' #B2A-0001',
      Total: '$400.00',
      
    },
   
  ];
const BasicTable = () => {
  return (
  <>
  <Form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
              <FormGroup >
                <FormGroup check>
                      <Input type="checkbox" id="check1" />
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
                  <option defaultValue="created date">Status</option>
                  <option defaultValue="All">All</option>
                  <option defaultValue="Draft">Draft</option>
                  <option defaultValue="View">View</option>
                  <option defaultValue="Sent">Sent</option>
                  <option defaultValue="Accepted">Accepted</option>

                </Input>
              </FormGroup>  &nbsp; &nbsp;
              <FormGroup >
                <Input md="9"
                   type="select"
                  name="backdrop"
                  id="backdrop"
                  onChange={(e) => changeBackdrop(e)}
                 >
                  <Input type="text" placeholder="Sort" />
                  <option defaultValue=" date">Date</option>
                  <option defaultValue="Coustomer">Coustomer</option>
                  <option defaultValue="Total">Total</option>
                  <option defaultValue="Status">Status</option>
                  <option defaultValue="Number">Number</option>

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
                
                  <option defaultValue="active">Active</option>
                  <option defaultValue="arachived">Arachived</option>
                </Input>
                </FormGroup>
                {/* <td className="align-right success ms-5"><Icon.PlusCircle size={30} /> </td> */}
               
                </Form>

    <ComponentCard>    
         <Table hover responsive>           
            <tbody>
                {tableData.map((tdata) => (
                  <tr key={tdata.name} className="border-top">
                    <td>
                      <div className="d-flex align-items-center p-2">
                            <Col md="1 align-top" >
                            <FormGroup check>
                            <Input type="checkbox" id="check1" />
                            </FormGroup>
                            </Col>
                            <img
                                    src={tdata.avatar}
                                    className="rounded-circle"
                                    alt="avatar"
                                    width="45"
                                    height="45"
                                    />
                        
                            <div className=" ms-3">
                            
                            <h6 className="mb-1"><b>{tdata.Date}</b></h6>
                            <span className="text-muted">{tdata.owner}</span>
                            
                            </div>
                      </div>
                    </td>

                    <td className="  ms-3">
                      <div Project="ms-12" >
                         <h5 Project="mb-0" className=" text-dark">{tdata.Project}</h5>
                      </div>
                    </td>
                    <td className=" ms-3">
                      <div Contact="ms-12" >
                         <h5 Contact="mb-0" className=" text-dark"><b>{tdata.Contact}</b></h5>
                      </div>
                    </td>
                    <td className="ms-3">
                        <Col>
                             <td style={{ cursor: 'pointer' }}><Icon.ChevronDown size={20} />&nbsp;</td>
                            <td><Icon.Settings size={20} /> </td>
                            <td><Icon.Trash2 size={20} /> </td>
                        </Col>
                    </td>
                  </tr>
                ))}
              
            </tbody>
         </Table> 
         
    </ComponentCard>
  </>
  );
};

export default BasicTable;
