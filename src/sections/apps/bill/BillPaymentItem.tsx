// material-ui
import { Box, Stack, TableCell, Chip } from '@mui/material';

// third-party
import BillPaymentField from './BillPaymentField';
import { format } from 'date-fns';

// project import
import { useSelector } from 'store';

// ==============================|| Bill - ITEMS ||============================== //
const BillPaymentItem = ({
  id,
  billNumber,
  billDate,
  dueDate,
  billStatus,
  billAmt,
  setteledAmount,
  remainingAmount,
  payingAmt = 0,
  onDeleteItem,
  onEditItem,
  index,
  Blur,
  errors,
  touched,
  setFieldValue,
  ratesVisibility,
  discountVisibility,
  feesVisibility,
  readOnly
}: any) => {
  const { country } = useSelector((state) => state.invoice);
  const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedBill = billNumber.find((billNumber: any) => billNumber.productName === event.target.value);
    if (selectedBill) {
      setFieldValue(`bill_detail[${index}].billNumber`, selectedBill.billNumber);
      setFieldValue(`bill_detail[${index}].billDate`, selectedBill.billDate);
      setFieldValue(`bill_detail[${index}].dueDate`, selectedBill.dueDate);
      setFieldValue(`bill_detail[${index}].billStatus`, selectedBill.billStatus);
      setFieldValue(`bill_detail[${index}].billAmt`, selectedBill.billAmt);
      setFieldValue(`bill_detail[${index}].setteledAmount`, selectedBill.setteledAmount);
    }
  };
  const calculateRemainingAmount = () => {
    if (billAmt && setteledAmount) {
      return billAmt - setteledAmount;
    }
    return 0.0;
  };

  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Chip color="secondary" label="Draft" size="medium" variant="light" />;
      case 'Pending Approval':
        return <Chip color="default" label="Pending Approval" size="medium" variant="light" />;
      case 'Approved':
        return <Chip color="primary" label="Approved" size="medium" variant="light" />;
      case 'Partially Received':
        return <Chip color="info" label="Partially Received" size="medium" variant="light" />;
      case 'Received':
        return <Chip color="success" label="Received" size="medium" variant="light" />;
      case 'Rejected':
        return <Chip color="error" label="Rejected" size="medium" variant="light" />;
      case 'Cancelled':
      default:
        return <Chip color="warning" label="Cancelled" size="medium" variant="light" />;
    }
  };

  const textFieldItem = [
    {
      placeholder: 'Bill Number',
      label: 'billNumber',
      name: `bill_detail.${index}.billNumber`,
      type: 'label',
      id: id,
      value: billNumber,
      visibility: true,
      selectOnChange: handleNameChange,
      inputProps: { readOnly: true },
      sx: { width: '15%', textAlign: 'left' }
    },
    {
      placeholder: 'Bill Date',
      label: 'billDate',
      name: `bill_detail.${index}.billDate`,
      type: 'label',
      id: id,
      value: format(new Date(dueDate), 'dd-MMM-yyyy'),
      sx: { width: '15%', textAlign: 'left' },
      visibility: true,
      readOnly: 'true'
    },
    {
      placeholder: 'Due Date',
      label: 'dueDate',
      name: `bill_detail.${index}.dueDate`,
      type: 'label',
      id: id,
      value: format(new Date(dueDate), 'dd-MMM-yyyy'),
      sx: { width: '15%', textAlign: 'left' },
      visibility: true
    },
    {
      placeholder: 'Bill Status ',
      label: 'billStatus',
      name: `bill_detail.${index}.billStatus`,
      type: 'label',
      id: id,
      value: billStatus,
      visibility: true,
      sx: { width: '15%', textAlign: 'left' },
      Color: 'success',
      Cell: ({ value }: { value: string }) => renderStatusChip(value)
    },
    {
      placeholder: 'Bill Amount',
      label: 'billAmount',
      type: 'number',
      name: `bill_detail.${index}.billAmount`,
      id: id,
      value: `${country?.prefix} ${billAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: true,
      sx: { textAlign: 'right' }
    },
    {
      placeholder: 'Settled Amount',
      label: 'settledAmount',
      type: 'number',
      name: `bill_detail.${index}.setteledAmount`,
      id: id,
      value: `${country?.prefix} ${setteledAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: true,
      sx: { width: '15%', textAlign: 'right' }
    },
    {
      placeholder: 'Remaining Amount',
      label: 'remainingAmount',
      type: 'number',
      name: `bill_detail.${index}.remainingAmount`,
      id: id,
      value: `${country?.prefix} ${calculateRemainingAmount()
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: feesVisibility,
      sx: { width: '15%', textAlign: 'right' }
    },
    {
      placeholder: 'Paying Amount',
      label: 'payingAmount',
      type: 'text',
      name: `bill_detail.${index}.payingAmount`,
      id: id,
      value: `${country?.prefix} ${payingAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: discountVisibility,
      sx: { width: '15%', textAlign: 'right !important' }
    }
  ];

  return (
    <>
      {textFieldItem.map((item: any) => (
        <BillPaymentField
          onEditItem={(event: any) => onEditItem(event)}
          onBlur={(event: any) => Blur(event)}
          cellData={{
            placeholder: item.placeholder,
            name: item.name,
            type: item.type,
            id: item.id,
            value: item.value,
            errors: item.errors,
            touched: item.touched,
            select: item.select,
            selectOptions: item.selectOptions,
            selectOnChange: item.selectOnChange,
            sx: item.sx,
            style: { ...item.style, textAlign: 'right' },
            visibility: item.visibility
          }}
          key={item.label}
          style={{ marginBottom: 0 }}
        />
      ))}

      <TableCell sx={{ textAlign: 'right' }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
          <Box></Box>
        </Stack>
      </TableCell>
    </>
  );
};
export default BillPaymentItem;
