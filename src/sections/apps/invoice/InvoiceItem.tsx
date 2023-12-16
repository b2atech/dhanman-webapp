import { useState } from 'react';

// material-ui
import { Box, Button, Stack, TableCell, Tooltip, Typography } from '@mui/material';

// third-party
import { getIn } from 'formik';

// project import
import InvoiceField from './InvoiceField';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { DeleteOutlined } from '@ant-design/icons';
import AlertProductDelete from './AlertProductDelete';

// ==============================|| INVOICE - ITEMS ||============================== //

const InvoiceItem = ({
  id,
  soNo,
  soDate,
  name,
  description,
  qty,
  price,
  fees,
  discount,
  cgst,
  sgst,
  igst,
  onDeleteItem,
  onEditItem,
  index,
  Blur,
  errors,
  touched,
  setFieldValue,
  products
}: any) => {
  const { country } = useSelector((state) => state.invoice);
  const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedProduct = products.find((product: any) => product.productName === event.target.value);
    if (selectedProduct) {
      setFieldValue(`invoice_detail[${index}].name`, selectedProduct.productName);
      setFieldValue(`invoice_detail[${index}].description`, selectedProduct.description);
      setFieldValue(`invoice_detail[${index}].price`, selectedProduct.sellingPrice);
      setFieldValue(`invoice_detail[${index}].cgst`, selectedProduct.cgst);
      setFieldValue(`invoice_detail[${index}].sgst`, selectedProduct.sgst);
      setFieldValue(`invoice_detail[${index}].igst`, selectedProduct.igst);
    }
  };
  const [open, setOpen] = useState(false);
  const handleModalClose = (status: boolean) => {
    setOpen(false);
    if (status) {
      onDeleteItem(index);
      dispatch(
        openSnackbar({
          open: true,
          message: 'invoicve item deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
  };

  const Name = `invoice_detail[${index}].name`;
  const touchedName = getIn(touched, Name);
  const errorName = getIn(errors, Name);

  const textFieldItem = [
    {
      placeholder: 'SalesOrder',
      label: 'soNo',
      name: `invoice_detail.${index}.soNo`,
      type: 'number',
      id: id,
      value: soNo
    },
    {
      placeholder: 'SalesDate',
      label: 'soDate',
      name: `invoice_detail.${index}.soDate`,
      type: 'date',
      id: id,
      value: soDate,
      style: { width: '140px' },
      sx: { width: '100%' }
    },
    {
      placeholder: 'Item name',
      label: 'Item Name',
      name: `invoice_detail.${index}.name`,
      type: 'text',
      id: id,
      value: name,
      errors: errorName,
      touched: touchedName,
      select: true,
      style: { width: '135px' },
      selectOptions: products.map((product: any) => ({
        label: product.productName,
        value: product.productName
      })),
      selectOnChange: handleNameChange
    },
    {
      placeholder: 'Description',
      label: 'Description',
      name: `invoice_detail.${index}.description`,
      type: 'text',
      id: id,
      value: description,
      style: { width: '200px' }
    },
    {
      placeholder: 'Qty',
      label: 'Qty',
      type: 'number',
      name: `invoice_detail.${index}.quantity`,
      id: id,
      value: qty,
      style: { width: '70px' }
    },
    { placeholder: '', label: 'price', type: 'number', name: `invoice_detail.${index}.price`, id: id, value: price },
    {
      placeholder: 'Fees',
      label: 'Fees',
      name: `invoice_detail.${index}.fees`,
      type: 'number',
      id: id,
      value: fees
    },
    {
      placeholder: 'Discount',
      label: 'Discount',
      name: `invoice_detail.${index}.discount`,
      type: 'number',
      id: id,
      value: discount,
      style: { width: '70px' }
    },
    {
      placeholder: 'CgstRate',
      label: 'Cgst Rt',
      name: `invoice_detail.${index}.cgst`,
      type: '',
      id: id,
      value: cgst,
      style: { width: '50px' }
    },
    {
      placeholder: 'CgstAmount',
      label: 'Cgst Amount',
      name: `invoice_detail.${index}.CgstAmount`,
      type: 'number',
      id: id,
      value: (cgst / 100) * price
    },
    {
      placeholder: 'SgstRate',
      label: 'Sgst Rt',
      name: `invoice_detail.${index}.sgst`,
      type: '',
      id: id,
      value: sgst,
      style: { width: '50px' }
    },
    {
      placeholder: 'SgstAmount',
      label: 'Sgst Amount',
      name: `invoice_detail.${index}.SgstAmount`,
      type: 'number',
      id: id,
      value: (sgst / 100) * price
    },
    {
      placeholder: 'IgstRate',
      label: 'Igst Rt',
      name: `invoice_detail.${index}.igst`,
      type: '',
      id: id,
      value: igst,
      style: { width: '50px' }
    },
    {
      placeholder: 'IgstAmount',
      label: 'Igst Amount',
      name: `invoice_detail.${index}.IgstAmount`,
      type: 'number',
      id: id,
      value: (igst / 100) * price
    }
  ];

  return (
    <>
      {textFieldItem.map((item: any) => {
        return (
          <InvoiceField
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
              style: { ...item.style, textAlign: 'center' }
            }}
            key={item.label}
            style={{ marginBottom: 0 }}
          />
        );
      })}
      <TableCell>
        <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography>
              {country?.prefix + '' + (qty && price ? (price * qty - (discount / 100) * price * qty).toFixed(2) : '0.00')}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography>
              {!name || !price || !qty
                ? '0.00'
                : country?.prefix +
                  '' +
                  ((sgst && cgst ? (cgst / 100) * price + (sgst / 100) * price : (igst / 100) * price) + price * qty).toFixed(2)}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Tooltip title="Remove Item">
          <Button color="error" onClick={() => setOpen(true)}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
      </TableCell>
      <AlertProductDelete title={name} open={open} handleClose={handleModalClose} />
    </>
  );
};

export default InvoiceItem;
