import React from 'react';
import { Table, Button } from 'reactstrap';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';


const COA = () => {

  return (
    <>
      {/* class="btn text-right"  className="mr-auto" */}
      <div className="button-group" style={{ float: 'right' }}>
        <Button className="btn" color="primary">
          Save
        </Button>
        <Button className="btn" color="success">
          Add Payment
        </Button>
        <Button className="btn" color="primary">
          Finalize for sending
        </Button>
      </div>
      <br />
      <br />
      <ComponentCard
        title="Chart Of Accounts"
        subtitle={
          <p>
            {/* Use <code>striped</code> to add zebra-striping to any table row within the{' '}
            <code>&lt;tbody&gt;</code>. */}
            A chart of accounts (COA) is a categorized list of all the financial accounts used by a business or organization to record and track its financial transactions.
          </p>
        }
      >
        <Table striped responsive>
          <thead>
            <tr>
              <th scope="col">Accoun Code</th>
              <th scope="col">Account Name</th>
              <th scope="col">Account Category</th>
              <th scope="col">Parent Id</th>
              <th scope="col">Active Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">100</th>
              <td> Cash</td>
              <td>Assets</td>
              <td>1</td>
              <td>Yes</td>
            </tr>
            <tr>
              <th scope="row">200</th>
              <td>Loans Payable</td>
              <td>Liabilities</td>
              <td>2</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">300</th>
              <td>Owners Capital</td>
              <td>Equity</td>
              <td>3</td>
              <td>Yes</td>
            </tr>
            <tr>
              <th scope="row">400</th>
              <td>Sales Revenue</td>
              <td>Revenue</td>
              <td>4</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">500</th>
              <td>Rent Expense</td>
              <td>Expenses</td>
              <td>5</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </Table>
      </ComponentCard>

      {/*--------------------------------------------------------------------------------*/}
      {/*End Inner Div*/}
      {/*--------------------------------------------------------------------------------*/}
    </>
  );
};
export default COA