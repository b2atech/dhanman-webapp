import React from 'react';
import { Card, CardBody,Table,   Col,  FormGroup,  Input,Form ,Button,} from 'reactstrap';
import * as Icon from 'react-feather';

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
    displayname: 'Hanna Gover',
   displayDescription: 'Medicine',    
   price: '$30',
   Billed : '$0.00',
    
  },
  {
    avatar: user2,
    displayname: 'Jonathan Gover',
    displayDescription: 'fertilizer',
    price: '$100',
    Billed: '$0.00',
   
  },
  {
    avatar: user3,
    displayname: 'Steave',
    displayDescription: 'Chemical',    
      price: '$630',
      Billed: '$0.00',
  
  },
  {
    avatar: user4,
    displayname: 'Mukesh chava',
    displayDescription: 'Medicine',
    price: '$400',
    Billed: '$0.00',
    
  },
  {
    avatar: user5,
    displayname: 'Thuklk luu',
    displayDescription: 'Fertilizer',
    price: '$200',
    Billed: '$0.00',
    
  },
];

  
  const ProjectTables = () => {
    
    return (
<>
      <div className="button-group" style={{float: 'right'}}>
      <Button className="btn" color="primary">
       Arachive
      </Button>
      <Button className="btn" color="danger" >
       Delete
      </Button>

</div>
      <div>
      
          <Form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
              <FormGroup >
                {/* <Label for="backdrop">Backdrop value</Label> */}
                <FormGroup check>
                      <Input type="checkbox" id="check1" />
                  
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
          <CardBody>
     
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
             
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
                    
                    <Col md="2 align-top" >
        {/* <UncontrolledTooltip placement="top" target="B" >
         This is an invoice Item.
        </UncontrolledTooltip> */}
       
                    <b className='badge bg-light text-black boarderd-dark square-pill ' id ="I"> <b>I</b> </b>

                  </Col>

                  
                        <img
                          src={tdata.avatar}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                        
                        <div className="ms-3">
                          <h6 className="mb-1">{tdata.displayname}</h6>
                          <span className="text-muted">{tdata.displayDescription}</span>
                          
                        </div>
                        </div>
                    </td>
                    <td>
                      <div Price="ms-12" >
                <h7 type="text" placeholder="Price" />
                         <h5 Price="mb-0" className=" text-info"><b>{tdata.price}</b></h5>
                      
                        </div>
                        </td>
                        <td>
                        <div Bill="ms-12" >
                         <h7 Bill="mb-0" className=" text-success"><b>{tdata.Billed}</b></h7>
                        </div>
                          </td>
                          <td><Icon.Trash2 size={20} /> </td>
                          
         
           
                   
                  </tr>
                ))}
              
             </tbody>
            
            </Table>
          </CardBody>
        </Card>
      </div>
      
      </>
     
    );
  };
  
   export default ProjectTables;
  

