import React from 'react';
import { Card, CardBody, Table, Col, FormGroup, Input } from 'reactstrap';
import * as Icon from 'react-feather';



const tableData = [
    {

      date: '20 May',
      name: 'Karan Khamkar',
      company: 'Medical Shop',
      transsctionStatus: 'cash',
      accounttype: 'Sales',
      invoiceno: 'Rs.200',
    },
    {
      date: '21 May',
      name: 'Pratik Kadam',
      company: 'Car Service',
      invoiceno: 'Rs.00.0 ',
      transsctionStatus: 'Online',
      accounttype: 'Current Assets',
    },
    {
      date: '22 May',
      name: 'Santosh Patil',
      company: 'Hotel Business',
      invoiceno: 'Rs.145 ',
      transsctionStatus: 'Online',
      accounttype: 'Equity',
    },
    {
      date: '23 May',
      name: 'Mayuri Kulkarni',
      company: 'Beauty Parlor',
      invoiceno: 'Rs. 235 ',
      transsctionStatus: 'cash',
      accounttype: 'Sales',
    },
    {
      date: '24 May',
      name: 'Sarika Patil',
      company: 'Beauty Parlor',
      invoiceno: 'Rs. 542 ',
      transsctionStatus: 'cash',
      accounttype: 'Sales',
    //   status: 'done',
      // weeks: '35',
      // budget: '95K',
    },
  ];

  

function Transactions() {
  return (
    <div>
    <Card>
      <CardBody>

        {/* <CardTitle tag="h5">Project Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the projects
          </CardSubtitle> */}

        <Table className="no-wrap mt-0 align-middle" responsive borderless>
          {/* <thead>
            <tr>
              <th>Supplier</th>
              <th>Invoice No</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead> */}

          <Col md="3">
              <FormGroup>
                <Input type="text" placeholder="md-3" />
              </FormGroup>
            </Col>  
            

          {/* <Col md="4"> 
              <FormGroup>
                <Input type="text" placeholder="md-4" />
              </FormGroup>
            </Col> */}


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
                      
                      {/* <span className="text-muted">{tdata.name}</span><br />
                      <span company="text-muted">{tdata.company}</span> */}
                    </div>
                  </div>
                </td>
                <td>{tdata.invoiceno}<br />
                  </td>

                <td>
                <h6 className="mb-0">{tdata.name}</h6>
                <h6 className="mb-0">{tdata.transsctionStatus}</h6>
                </td>
                <td>
                <h6 className="mb-0">{tdata.accounttype}</h6>
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
  )
}

export default Transactions