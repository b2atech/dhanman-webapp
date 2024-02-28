import React from 'react';
import {
  TextField,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Table,
  Stack,
  Button,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import MainCard from 'components/MainCard';

interface RowData {
  projectName: string;
  taskName: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  total: number;
  [key: string]: string | number;
}

function AddDeleteTableRows() {
  const projectNameOptions: string[] = ['Project A', 'Project B', 'Project C', 'Project D'];
  const taskNameOptions: string[] = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];

  const [rowsData, setRowsData] = React.useState<RowData[]>([]);

  const addTableRows = () => {
    const rowsInput = {
      projectName: '',
      taskName: '',
      monday: 0, // Initialize as 0
      tuesday: 0, // Initialize as 0
      wednesday: 0, // Initialize as 0
      thursday: 0, // Initialize as 0
      friday: 0, // Initialize as 0
      saturday: 0, // Initialize as 0
      total: 0
    };

    setRowsData([...rowsData, rowsInput]);
  };

  const deleteTableRows = (index: number) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  };

  const handleChange = (index: number, property: keyof RowData, value: string | number) => {
    const updatedRows = [...rowsData]; // Create a new array with the existing rows
    updatedRows[index] = { ...updatedRows[index], [property]: value };

    // Calculate the total for the current row
    const total = calculateTotal(updatedRows[index]);
    updatedRows[index].total = total;

    setRowsData(updatedRows);
  };

  const calculateTotal = (row: RowData) => {
    // Sum all numeric values from monday to saturday

    const values = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => Number(row[day])); // Extract the values of each day from the row

    return values.reduce((acc, val) => acc + val, 0 as number); // Sum all the numeric values
  };
  return (
    <MainCard>
      <Stack>
        <TableContainer component={Paper} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { minWidth: '120px' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button variant="outlined" onClick={addTableRows}>
                    Add Row
                  </Button>
                </TableCell>
                <TableCell style={{ minWidth: 200 }}>Project Name</TableCell>
                <TableCell style={{ minWidth: 200, paddingRight: '20px' }}>Task Name</TableCell>
                <TableCell style={{ minWidth: 30 }}>Monday</TableCell>
                <TableCell style={{ minWidth: 30 }}>Tuesday</TableCell>
                <TableCell style={{ minWidth: 30 }}>Wednesday</TableCell>
                <TableCell style={{ minWidth: 30 }}>Thursday</TableCell>
                <TableCell style={{ minWidth: 30 }}>Friday</TableCell>
                <TableCell style={{ minWidth: 30 }}>Saturday</TableCell>
                <TableCell style={{ minWidth: 100 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button
                      // variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteTableRows(index)}
                    ></Button>
                  </TableCell>
                  <TableCell style={{ minWidth: 200 }}>
                    <Select
                      style={{ width: '100%' }}
                      value={data.projectName}
                      onChange={(evnt) => handleChange(index, 'projectName', evnt.target.value)}
                    >
                      {projectNameOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell style={{ minWidth: 200 }}>
                    <Select
                      style={{ width: '100%', paddingRight: '20px' }}
                      value={data.taskName}
                      onChange={(evnt) => handleChange(index, 'taskName', evnt.target.value)}
                    >
                      {taskNameOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }}>
                    <TextField
                      type="number"
                      value={data.monday}
                      onChange={(evnt) => handleChange(index, 'monday', evnt.target.value)}
                      name="monday"
                    />
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }}>
                    <TextField
                      type="number"
                      value={data.tuesday}
                      onChange={(evnt) => handleChange(index, 'tuesday', evnt.target.value)}
                      name="tuesday"
                    />
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }}>
                    <TextField
                      type="number"
                      value={data.wednesday}
                      onChange={(evnt) => handleChange(index, 'wednesday', evnt.target.value)}
                      name="wednesday"
                    />
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }}>
                    <TextField
                      type="number"
                      value={data.thursday}
                      onChange={(evnt) => handleChange(index, 'thursday', evnt.target.value)}
                      name="thursday"
                    />
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }}>
                    <TextField
                      type="number"
                      value={data.friday}
                      onChange={(evnt) => handleChange(index, 'friday', evnt.target.value)}
                      name="friday"
                    />
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }}>
                    <TextField
                      type="number"
                      value={data.saturday}
                      onChange={(evnt) => handleChange(index, 'saturday', evnt.target.value)}
                      name="saturday"
                    />
                  </TableCell>
                  <TableCell style={{ minWidth: 100 }}>
                    <TextField
                      type="number"
                      value={data.total}
                      onChange={(evnt) => handleChange(index, 'total', evnt.target.value)}
                      name="total"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </MainCard>
  );
}

export default AddDeleteTableRows;
