import React from 'react';
import { Card, CardBody, Table, Col, FormGroup, Input, Badge } from 'reactstrap';
import * as Icon from 'react-feather';
// import user1 from '../../assets/images/users/user1.jpg';
// import user3 from '../../assets/images/users/user3.jpg';
// import user4 from '../../assets/images/users/user4.jpg';
// import user5 from '../../assets/images/users/user5.jpg';

const tableData = [
  {    
    date: '20 May',
    name: 'Karan Khamkar',    
    transactionno: '#12452',
    status: 'pending',
    assetstype : 'Assets',
    transamount: 'Rs 200'
  },
  {    
    date: '21 May',
    name: 'Pratik Kadam',    
    transactionno: '#16453 ',
    status: 'done',
    assetstype : 'Cash',
    transamount: 'Rs 2400'
  },
  {    
    date: '22 May',
    name: 'Santosh Patil',    
    transactionno: '#02452 ',
    status: 'Cash',
    assetstype : 'Investemnt',
    transamount: 'Rs 4300'
  },
  {    
    date: '23 May',
    name: 'Mayuri Kulkarni',    
    transactionno: '#52452 ',
    status: 'pending',
    assetstype : 'Current Assets',
    transamount: 'Rs 5700'
  },
  {    
    date: '24 May',
    name: 'Sarika Patil',    
    transactionno: '#42452 ',
    status: 'done',
    assetstype : 'Security ',
    transamount: 'Rs 6700'
  },
];

const Bills = () => {
  return (
    <div>
      <Card>
        <CardBody>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            {/* <thead>
              <tr>
                <th>Supplier</th>
                <th>Invoice No</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead> */}
            <tbody>
              {tableData.map((tdata) => (
                <tr key={tdata.date} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <Col md="1" >
                        <FormGroup check>
                          <Input type="checkbox" id="check1" />
                        </FormGroup>
                      </Col>
                     
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.date}</h6>
                        <span className="text-muted">{tdata.name}</span><br />
                        {/* <span company="text-muted">{tdata.company}</span> */}
                      </div>
                    </div>
                  </td>
                  <td>{tdata.transactionno}<br />
                    <Badge className='text-dark-white' color="primary">open</Badge></td>
                  <td>
                  {tdata.transamount} <br />
                    Due &nbsp; &nbsp; {tdata.date}
                  </td>
                  <td>
                  {tdata.assetstype} <br />                  
                  </td>
                  <Col>
                    <br />
                    <td style={{ cursor: 'pointer' }}><Icon.ChevronDown size={20} />&nbsp;</td>
                    <td style={{ cursor: 'pointer' }}><Icon.Settings size={20} />&nbsp;</td>
                    <td style={{ cursor: 'pointer' }}><Icon.Trash2 size={20} />&nbsp;</td>
                  </Col>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Bills;