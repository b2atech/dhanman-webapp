import React from 'react';
import { Table } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
// import ProjectTables from '../../components/dashboard/ProjectTable';

const BasicTable = () => {
  return (
    <>
      <BreadCrumbs />
    

      <ComponentCard
        title="Striped rows"
        subtitle={
          <p>
            Use <code>striped</code> to add zebra-striping to any table row within the{' '}
            <code>&lt;tbody&gt;</code>.
          </p>
        }
      >
        <Table striped responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">firstName</th>
              <th scope="col">lastName</th>
              <th scope="col">Address</th>
              <th scope="col">Address</th>
          
              <th scope="col">Address</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </ComponentCard>

      {/*--------------------------------------------------------------------------------*/}
      {/* Bordered Table                                                                 */}
      {/*--------------------------------------------------------------------------------*/}

      {/* <ComponentCard
        title="Bordered Table"
        subtitle={
          <p>
            Use <code>bordered</code> to add zebra-striping to any table row within the
            <code>&lt;tbody&gt;</code>.
          </p>
        }
      >
        <Table bordered responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </ComponentCard> */}

      {/*--------------------------------------------------------------------------------*/}
      {/* Hoverable Rows                                                                 */}
      {/*--------------------------------------------------------------------------------*/}

      {/* <ComponentCard
        title="Hoverable Rows"
        subtitle={
          <p>
            Use <code>hover</code> to add zebra-striping to any table row within the{' '}
            <code>&lt;tbody&gt;</code>.
          </p>
        }
      >
        <Table hover responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </ComponentCard> */}

      {/*--------------------------------------------------------------------------------*/}
      {/* Responsive Table                                                               */}
      {/*--------------------------------------------------------------------------------*/}

      {/* <ComponentCard
        title="Responsive Table"
        subtitle={
          <p>
            Use <code>responsive</code> to add zebra-striping to any table row within the{' '}
            <code>&lt;tbody&gt;</code>.
          </p>
        }
      >
        <Table responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
              <th scope="col">Heading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>
      </ComponentCard> */}

      {/*--------------------------------------------------------------------------------*/}
      {/*End Inner Div*/}
      {/*--------------------------------------------------------------------------------*/}
    </>
  );
};

export default BasicTable;
