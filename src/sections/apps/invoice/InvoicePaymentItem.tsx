// material-ui
import { Box, Stack, TableCell, Chip } from '@mui/material';

// third-party
import InvoicePaymentField from './InvoicePaymentField';
import { format } from 'date-fns';
import { useSelector } from 'store';

// project import

// ==============================|| Invoice - ITEMS ||============================== //
const InvoicePaymentItem = ({
  id,
  invoiceNumber,
  invoiceDate,
  dueDate,
  invoiceStatus,
  invoiceAmount,
  setteledAmount,
  remainingAmount,
  receivingAmount = 0,
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
    const selectedInvoice = invoiceNumber.find((invoiceNumber: any) => invoiceNumber.productName === event.target.value);
    if (selectedInvoice) {
      setFieldValue(`invoice_detail[${index}].invoiceNumber`, selectedInvoice.invoiceNumber);
      setFieldValue(`invoice_detail[${index}].invoiceDate`, selectedInvoice.invoiceDate);
      setFieldValue(`invoice_detail[${index}].dueDate`, selectedInvoice.dueDate);
      setFieldValue(`invoice_detail[${index}].invoiceStatus`, selectedInvoice.invoiceStatus);
      setFieldValue(`invoice_detail[${index}].invoiceAmount`, selectedInvoice.invoiceAmount);
      setFieldValue(`invoice_detail[${index}].setteledAmount`, selectedInvoice.setteledAmount);
    }
  };
  const calculateRemainingAmount = () => {
    if (invoiceAmount && setteledAmount) {
      return invoiceAmount - setteledAmount;
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
  const formattedInvoiceDate = invoiceDate ? format(new Date(invoiceDate), 'dd-MM-yyyy') : '';
  const formattedDueDate = dueDate ? format(new Date(dueDate), 'dd-MM-yyyy') : '';
  const textFieldItem = [
    {
      placeholder: 'Invoice Number',
      label: 'invoiceNumber',
      name: `invoice_detail.${index}.invoiceNumber`,
      type: 'label',
      id: id,
      value: invoiceNumber,
      visibility: true,
      selectOnChange: handleNameChange,
      inputProps: { readOnly: true },
      sx: { width: '15%', textAlign: 'left' }
    },
    {
      placeholder: 'Invoice Date',
      label: 'invoiceDate',
      name: `invoice_detail.${index}.invoiceDate`,
      type: 'label',
      id: id,
      value: formattedInvoiceDate,
      sx: { width: '15%', textAlign: 'left' },
      visibility: true,
      readOnly: 'true'
    },
    {
      placeholder: 'Due Date',
      label: 'dueDate',
      name: `invoice_detail.${index}.dueDate`,
      type: 'label',
      id: id,
      value: formattedDueDate,
      sx: { width: '15%', textAlign: 'left' },
      visibility: true
    },
    {
      placeholder: 'Invoice Status ',
      label: 'invoiceStatus',
      name: `invoice_detail.${index}.invoiceStatus`,
      type: 'label',
      id: id,
      value: invoiceStatus,
      visibility: true,
      sx: { width: '15%', textAlign: 'left' },
      Color: 'success',
      Cell: ({ value }: { value: string }) => renderStatusChip(value)
    },
    {
      placeholder: 'Invoice Amount',
      label: 'invoiceAmount',
      type: 'number',
      name: `invoice_detail.${index}.invoiceAmount`,
      id: id,
      value: `${country?.prefix} ${invoiceAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: true,
      sx: { textAlign: 'right' }
    },
    {
      placeholder: 'Setteled Amount',
      label: 'setteledAmount',
      type: 'number',
      name: `invoice_detail.${index}.setteledAmount`,
      id: id,
      value: `${country?.prefix} ${setteledAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: true,
      sx: { width: '15%', textAlign: 'right' }
    },
    {
      placeholder: 'Remaining Amount',
      label: 'remainingAmount',
      type: 'number',
      name: `invoice_detail.${index}.remainingAmount`,
      id: id,
      value: `${country?.prefix} ${calculateRemainingAmount()
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: feesVisibility,
      sx: { textAlign: 'right' }
    },
    {
      placeholder: 'Receiving Amount',
      label: 'receivingAmount',
      type: 'text',
      name: `invoice_detail.${index}.receivingAmount`,
      id: id,
      value: `${country?.prefix} ${receivingAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      visibility: discountVisibility,
      sx: { width: '15%', textAlign: 'right' }
    }
  ];

  return (
    <>
      {textFieldItem.map((item: any) => (
        <InvoicePaymentField
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
export default InvoicePaymentItem;
