import React from 'react';
import { Card, CardBody, Table, Col, FormGroup, Input } from 'reactstrap';
// import * as Icon from 'react-feather';



const tableData = [
    {
      date: '20 May',
      accountbalancename: ' Balance',
      accountbalance: ' Rs. 5000',
      accountcategory: 'cash ',
      transsctionStatus: 'cash',
      accounttype: 'Fixed Assets',
      parenttype: 'parent',

    },
    {
        date: '25 May',
        accountbalancename: ' Balance',
        accountbalance: ' Rs. 12000',
        accountcategory: 'cash ',
        transsctionStatus: 'cash',
        accounttype: 'Current Assets',
        parenttype: 'parent',
  
      },
      {
        date: '27 May',
        accountbalancename: ' Balance',
        accountbalance: ' Rs. 54000',
        accountcategory: 'cash ',
        transsctionStatus: 'cash',
        accounttype: 'Inventory',
        parenttype: 'parent',
  
      }];

  

function Categories() {
  return (
    <div>
    <Card>
      <CardBody>
        <Table className="no-wrap mt-0 align-middle" responsive borderless>
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
                      <h6 className="mb-0">{tdata.accounttype}</h6>
                    </div>
                  </div>
                </td>
                <td>{tdata.parenttype}<br />
                <td>{tdata.accounttype}</td>
                  </td>
                {/* <td>
                <h6 className="mb-0">{tdata.name}</h6>
                <h6 className="mb-0">{tdata.transsctionStatus}</h6>
                </td> */}
                <td>
                <h6 className="mb-0">{tdata.accountcategory}</h6>
                <h6 className="mb-0">{tdata.accounttype}</h6>
                </td>
                <td>
                <h6 className="mb-0">{tdata.accountbalancename}</h6>
                <h6 className="mb-0">{tdata.accountbalance}</h6>
                </td>

                {/* <Col>
                  <br />
                  <td style={{ cursor: 'pointer' }}><Icon.ChevronDown size={20} />&nbsp;</td>
                  <td style={{ cursor: 'pointer' }}><Icon.Settings size={20} />&nbsp;</td>
                  <td style={{ cursor: 'pointer' }}><Icon.Trash2 size={20} />&nbsp;</td>

                </Col> */}
              </tr>
            ))}
          </tbody>

        </Table>
      </CardBody>
    </Card>
  </div>
  )
}

export default Categories