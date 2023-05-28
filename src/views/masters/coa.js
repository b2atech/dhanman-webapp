import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Table, Button } from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';


const COA = () => {
  const [apiData, setApiData] = useState([]);
  function getData() {
    axios.get("https://localhost:7290/api/V1/Bill/GetAllCoa?clientId=5").then((response) => {
      setApiData(response.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
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
            {apiData.map((item) => {
              return (
                <>
                  <tr>                    
                    <td>{item.Name}</td>   
                    <td>{item.CategoryId}</td>
                    <td>{item.ParentId}</td>
                    <td>{item.IsActive}</td>                    
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </ComponentCard>
    </>
  );
};
export default COA
