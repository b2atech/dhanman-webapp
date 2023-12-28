import { MenuItem, Select, TableCell, TextField, Tooltip } from '@mui/material';
import '../../../components/css/b2astyles.css';

// ==============================|| Bill - TEXT FIELD ||============================== //

const BillField = ({ onEditItem, cellData, values, index }: any) => {
  // const billDetailIndex = values?.bill_detail?.findIndex((item: any, itemIndex: number) => itemIndex === index);

  return (
    <TableCell
      className={' ' + (cellData.visibility === false ? 'hide-tablecell' : '')}
      sx={{
        '& .MuiFormHelperText-root': { position: 'absolute', bottom: -24, ml: 0 },
        minWidth: 100,
        overflowX: 'auto',
        padding: '4px 1px',
        textAlign: 'center',
        ...cellData.sx
      }}
    >
      {cellData.select ? (
        <Select
          value={cellData.value}
          onChange={cellData.selectOnChange}
          label={cellData.label}
          error={Boolean(cellData.errors && cellData.touched)}
          name={cellData.name}
          id={cellData.id}
          style={cellData.style}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 280,
                overflowY: 'auto'
              }
            }
          }}
        >
          {cellData.selectOptions?.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Tooltip
          title={
            cellData.placeholder === 'CGST Amount'
              ? `CGST Rate: ${values?.bill_detail?.[index]?.cgstRate || 0}%`
              : cellData.placeholder === 'SGST Amount'
              ? `SGST Rate: ${values?.bill_detail?.[index]?.sgstRate || 0}%`
              : cellData.placeholder === 'IGST Amount'
              ? `IGST Rate: ${values?.bill_detail?.[index]?.igstRate || 0}%`
              : ''
          }
          placement="top"
        >
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
            style={cellData.style}
          />
        </Tooltip>
      )}
    </TableCell>
  );
};

export default BillField;
