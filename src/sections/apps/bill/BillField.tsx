import { MenuItem, Select, TableCell, TextField } from '@mui/material';

// ==============================|| Bill - TEXT FIELD ||============================== //

const BillField = ({ onEditItem, cellData, showGSTRates }: any) => {
  return (
    <TableCell sx={{ '& .MuiFormHelperText-root': { position: 'absolute', bottom: -24, ml: 0 }, minWidth: 100, overflowX: 'auto' }}>
      {cellData.select ? (
        <Select
          value={cellData.value}
          onChange={cellData.selectOnChange}
          label={cellData.label}
          error={Boolean(cellData.errors && cellData.touched)}
          name={cellData.name}
          id={cellData.id}
        >
          {cellData.selectOptions.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          type={cellData.type}
          placeholder={cellData.placeholder}
          name={cellData.name}
          id={cellData.id}
          value={cellData.type === 'number' ? (cellData.value > 0 ? cellData.value : '') : cellData.value}
          onChange={onEditItem}
          label={cellData.label}
          error={Boolean(cellData.errors && cellData.touched)}
          inputProps={{
            ...(cellData.type === 'number' && { min: 0 })
          }}
        />
      )}
    </TableCell>
  );
};
export default BillField;
