// material-ui
import { Box, Stack, TableCell, Chip } from '@mui/material';

// third-party
import BillPaymentField from './BillPaymentField';

// project import

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
  payingAmt,
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
      style: { width: '140px', textAlign: 'left' },
      visibility: true,
      selectOnChange: handleNameChange,
      inputProps: { readOnly: true }
    },
    {
      placeholder: 'Bill Date',
      label: 'billDate',
      name: `bill_detail.${index}.billDate`,
      type: 'label',
      id: id,
      value: billDate,
      style: { width: '140px', textAlign: 'left' },
      sx: { width: '100%' },
      visibility: true,
      readOnly: 'true'
    },
    {
      placeholder: 'Due Date',
      label: 'dueDate',
      name: `bill_detail.${index}.dueDate`,
      type: 'label',
      id: id,
      value: dueDate,
      style: { width: '140px', textAlign: 'left' },
      sx: { width: '100%' },
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
      style: { width: '140px', textAlign: 'left', color: 'success' },
      width: '100%',
      Color: 'success',
      Cell: ({ value }: { value: string }) => renderStatusChip(value)
    },
    {
      placeholder: 'Bill Amount',
      label: 'billAmount',
      type: 'number',
      name: `bill_detail.${index}.billAmount`,
      id: id,
      value: billAmt,
      visibility: true,
      style: { width: '140px', textAlign: 'right' },
      width: '100%'
    },
    {
      placeholder: 'Setteled Amount',
      label: 'setteledAmount',
      type: 'number',
      name: `bill_detail.${index}.setteledAmount`,
      id: id,
      value: setteledAmount,
      visibility: true,
      style: { width: '140px', textAlign: 'right' },
      width: '100%'
    },
    {
      placeholder: 'Remaining Amount',
      label: 'remainingAmount',
      type: 'number',
      name: `bill_detail.${index}.remainingAmount`,
      id: id,
      value: calculateRemainingAmount(),
      visibility: feesVisibility,
      style: { width: '140px', textAlign: 'right' },
      width: '100%'
    },
    {
      placeholder: 'Paying Amount',
      label: 'payingAmount',
      type: 'text',
      name: `bill_detail.${index}.payingAmount`,
      id: id,
      value: payingAmt,
      visibility: discountVisibility,
      style: { width: '140px', textAlign: 'right' },
      width: '100%'
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
          <Box sx={{ minWidth: 90 }}>
            {/* <Typography>{country?.prefix + ' ' + getTotalAmount(qty, price, discount, fees, cgst, sgst, igst)}</Typography> */}
          </Box>
        </Stack>
      </TableCell>
    </>
  );
};
export default BillPaymentItem;
