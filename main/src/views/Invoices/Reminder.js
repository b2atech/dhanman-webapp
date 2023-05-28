import React from 'react';
import { Card, CardBody,Table,} from 'reactstrap';
import * as Icon from 'react-feather';


const tableData = [
  {
    ReminderEmailSubject: 'Preventing late payments before your invoice is overdue.',    
    DaysDelinquentUntilReminder: 'Send 1 day After due date',

  },
  {
    ReminderEmailSubject: 'Invoice Attached - Please process by {due date}',
    DaysDelinquentUntilReminder: 'Send 1 day After due date',

  },
  {
    ReminderEmailSubject: 'Missing Payment Information',
    DaysDelinquentUntilReminder: 'Send 1 day After due date',
  
  
  },
  {
    ReminderEmailSubject: 'Overdue Invoice - Please Resolve',
    DaysDelinquentUntilReminder: 'Send 1 day After due date',

    
  },
  {
    ReminderEmailSubject: 'Seeking resolution of past due invoice',
    DaysDelinquentUntilReminder: 'Send 1 day After due date',

    
  },
];

  
  const ProjectTables = () => {
    
    return (
<>
  
      <div>
       <Card>
          <CardBody>
     
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
             
              <tbody>
                {tableData.map((tdata) => (
                  <tr key={tdata.name} className="border-top">
                    <td>
                         <div className="ms-3">
                          <h5 className="mb-1">{tdata.DaysDelinquentUntilReminder}</h5>
                          <h7 className="text-muted">{tdata.ReminderEmailSubject}</h7>
                          
                        </div>
                    </td>
                   
                        <td>
                        <div Bill="ms-12" >
                         <h7 Bill="mb-0" className=" text-success"><b>{tdata.Billed}</b></h7>
                        </div>
                          </td>
                          <td><Icon.ToggleRight size={20} /> </td>

                          <td><Icon.Trash2 size={20} /> </td>
                        
         
           
                   
                  </tr>
                ))}
              
             </tbody>
            
            </Table>
          </CardBody>
        </Card>
      </div>
      
      </>
     
    );
  };
  
   export default ProjectTables;
  

