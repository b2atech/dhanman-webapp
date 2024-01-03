import { TableCell, TextField } from '@mui/material';
import '../../../components/css/b2astyles.css';

// ==============================|| Bill - TEXT FIELD ||============================== //

const InvoicePaymentField = ({ onEditItem, cellData }: any) => {
  return (
    <TableCell
      className={' ' + (cellData.visibility === false ? 'hide-tablecell' : '')}
      sx={{
        '& .MuiFormHelperText-root': { position: 'absolute', bottom: -24, ml: 0 },
        minWidth: 100,
        overflowX: 'auto',
        padding: '4px 1px',
        textAlign: 'right',
        ...cellData.sx
      }}
    >
      {cellData.type === 'text' ? (
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
          style={{ textAlign: 'right', ...cellData.style, width: '100px' }}
        />
      ) : (
        <div>{cellData.value}</div>
      )}
    </TableCell>
  );
};
export default InvoicePaymentField;
