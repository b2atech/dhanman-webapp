import React from 'react';
import { Card, CardBody, Table, Col, FormGroup, Input } from 'reactstrap';
import * as Icon from 'react-feather';


const tableData = [
  {    
    transdescription: 'Rs. 100 Monthly',
    date : 'May 23, 2023',
    invoiceno: 'Started',
    status: 'pending',

  },
  {    
    transdescription: 'Rs. 2200 Monthly',
    date : 'June 25, 2023',
    invoiceno: 'Started',
    status: 'done',
 
  },
  {    
    transdescription: 'Rs. 2300 Monthly',
    date : 'Jan 18, 2023',
    invoiceno: 'Started',
    status: 'holt',

  },
  {    
    transdescription: 'Rs. 2400 Monthly',
    date : 'Aug 28, 2023',
    invoiceno: 'Started',
    status: 'pending',

  },
  {    
    transdescription: 'Rs. 2500 Monthly',
    date : 'Dec 29, 2023',
    invoiceno: 'Started',
    status: 'done',

  },
];

const Recurring = () => {
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
                        <h6 className="mb-0">{tdata.transdescription}</h6>
                        <span className="text-muted">{tdata.name}</span><br />
                        <span company="text-muted">{tdata.company}</span>
                      </div>
                    </div>
                  </td>
                  <td>{tdata.invoiceno}<br />
                  {tdata.date}                    
                    </td>
                  <td>
                  Next Sends Date <br />
                  {tdata.date}
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

export default Recurring;