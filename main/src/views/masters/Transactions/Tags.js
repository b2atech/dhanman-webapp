import React from 'react';
import { Card, CardBody, Table, Col } from 'reactstrap';
import * as Icon from 'react-feather';



const tableData = [
    {
      transactioncount: '0',
      tagname: 'Car',
      transactionname: 'Transaction',
      tagtype: 'machine',
    },
    {
        transactioncount: '2',
        tagname: 'Tag Name',
        transactionname: 'Transaction',
        tagtype: 'Sales Types',
      },
      {
        transactioncount: '4',
        tagname: 'Tag Name',
        transactionname: 'Transaction',
        tagtype: 'Service',
      },
      {
        transactioncount: '1',
        tagname: 'Tag Name',
        transactionname: 'Transaction',
        tagtype: 'service',
      },
      {
        transactioncount: '6',
        tagname: 'Tag Name',
        transactionname: 'Transaction',
        tagtype: 'Purchase Material',
      },
      {
        transactioncount: '6',
        tagname: 'Tag Name',
        transactionname: 'Transaction',
        tagtype: 'Sales Material',
      },
      {
        transactioncount: '6',
        tagname: 'Tag Name',
        transactionname: 'Transaction',
        tagtype: 'machine',
      }
      
];

  

function Tags() {
  return (
    <div>
    <Card>
      <CardBody>
        <Table className="no-wrap mt-0 align-middle" responsive borderless>
          <tbody>
            {tableData.map((tdata) => (
              <tr key={tdata.date} className="border-top">
                <td>                  
                </td>
                <td>
                <h6 className="mb-0">{tdata.tagname}</h6>
                <h6 className="mb-0">{tdata.tagtype}</h6>
                </td>

                <td>
                <h6 className="mb-0">{tdata.transactionname}</h6>
                <h6 className="mb-0">{tdata.transactioncount}</h6>
                </td>
                <Col>                                 
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

export default Tags