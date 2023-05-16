import React from 'react';
import { Table } from 'reactstrap';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';


const COA = () => {
  return (
    <>
      {/* <BreadCrumbs /> */}
      {/*--------------------------------------------------------------------------------*/}
      {/* Start Inner Div*/}
      {/*--------------------------------------------------------------------------------*/}

    



      {/*--------------------------------------------------------------------------------*/}
      {/* Striped rows                                                                   */}
      {/*--------------------------------------------------------------------------------*/}

      <ComponentCard
        title="Chart Of Accounts"
        subtitle={
          <p>
            {/* Use <code>striped</code> to add zebra-striping to any table row within the{' '}
            <code>&lt;tbody&gt;</code>. */}
            Chart of Account is a list of all the accounts in the system.
          </p>
        }
      >
        <Table striped responsive>
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">CategoryId</th>
              <th scope="col">ParentId</th>
              <th scope="col">IsActive</th>
              <th scope="col">createdById</th>
              <th scope="col">CreatedDate</th>
              <th scope="col">LastUpdateddById</th>
              <th scope="col">LastUpdatedDate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>Yes</td>
              <td>Ram</td>
              <td>15/5/2023</td>
              <td>Ram</td>
              <td>14/5/2023</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
              <td>No</td>
              <td>Pratik</td>
              <td>10/5/2023</td>
              <td>Pratik</td>
              <td>09/5/2023</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
              <td>Yes</td>
              <td>Gourav</td>
              <td>12/5/2023</td>
              <td>Gourav</td>
              <td>11/5/2023</td>
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