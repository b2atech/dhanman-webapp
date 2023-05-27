import React from 'react';
import { Card, CardBody, Table, Col, FormGroup, Input, Badge } from 'reactstrap';
import * as Icon from 'react-feather';
import user1 from '../../assets/images/users/user1.jpg';
import user3 from '../../assets/images/users/user3.jpg';
import user4 from '../../assets/images/users/user4.jpg';
import user5 from '../../assets/images/users/user5.jpg';

const tableData = [
  {
    avatar: user4,
    date: '20 May',
    name: 'Karan Khamkar',
    company: 'Medical Shop',
    invoiceno: '100',
    status: 'pending',

  },
  {
    avatar: user5,
    date: '21 May',
    name: 'Pratik Kadam',
    company: 'Car Service',
    invoiceno: '101 ',
    status: 'done',
 
  },
  {
    avatar: user4,
    date: '22 May',
    name: 'Santosh Patil',
    company: 'Hotel Business',
    invoiceno: '102 ',
    status: 'holt',

  },
  {
    avatar: user1,
    date: '23 May',
    name: 'Mayuri Kulkarni',
    company: 'Beauty Parlor',
    invoiceno: '103 ',
    status: 'pending',

  },
  {
    avatar: user3,
    date: '24 May',
    name: 'Sarika Patil',
    company: 'Beauty Parlor',
    invoiceno: '104 ',
    status: 'done',

  },
];

const Invoices = () => {
  return (
    <div>
      <Card>
        <CardBody>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Invoice No</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
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
                      <img
                        src={tdata.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.date}</h6>
                        <span className="text-muted">{tdata.name}</span><br />
                        <span company="text-muted">{tdata.company}</span>
                      </div>
                    </div>
                  </td>
                  <td>{tdata.invoiceno}<br />
                    <Badge className='text-dark-white' color="primary">Pending</Badge></td>
                  <td>
                    120500/-
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

export default Invoices;