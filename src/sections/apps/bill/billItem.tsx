import { useState } from 'react';

// material-ui
import { Box, Button, Stack, TableCell, Tooltip, Typography } from '@mui/material';

// third-party
import { getIn } from 'formik';

// project import
import BillField from './BillField';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { DeleteOutlined } from '@ant-design/icons';
import AlertProductDelete from './AlertProductDelete';

// ==============================|| INVOICE - ITEMS ||============================== //

const BillItem = ({
  id,
  poNo,
  poDate,
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
      setFieldValue(`bill_detail[${index}].name`, selectedProduct.productName);
      setFieldValue(`bill_detail[${index}].description`, selectedProduct.description);
      setFieldValue(`bill_detail[${index}].price`, selectedProduct.sellingPrice);
      setFieldValue(`bill_detail[${index}].cgst`, selectedProduct.cgst);
      setFieldValue(`bill_detail[${index}].sgst`, selectedProduct.sgst);
      setFieldValue(`bill_detail[${index}].igst`, selectedProduct.igst);
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
          message: 'Item Deleted successfully',
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

  const Name = `bill_detail[${index}].name`;
  const touchedName = getIn(touched, Name);
  const errorName = getIn(errors, Name);

  const textFieldItem = [
    {
      placeholder: 'Purchase Order',
      label: 'poNo',
      name: `bill_detail.${index}.poNo`,
      type: '',
      id: id,
      value: poNo
    },
    {
      placeholder: 'Purchase Date',
      label: 'poDate',
      name: `bill_detail.${index}.poDate`,
      type: 'date',
      id: id,
      value: poDate,
      style: { width: '140px' },
      sx: { width: '100%' }
    },
    {
      placeholder: 'Item name',
      label: 'Item Name',
      name: `bill_detail.${index}.name`,
      type: 'text',
      id: id,
      value: name,
      errors: errorName,
      touched: touchedName,
      select: true,
      selectOptions: products.map((product: any) => ({
        label: product.productName,
        value: product.productName
      })),
      selectOnChange: handleNameChange,
      style: { width: '135px' }
    },
    {
      placeholder: 'Description',
      label: 'Description',
      name: `bill_detail.${index}.description`,
      type: 'text',
      id: id,
      value: description,
      style: { width: '200px' }
    },
    {
      placeholder: 'Qty',
      label: 'Qty',
      type: 'number',
      name: `bill_detail.${index}.quantity`,
      id: id,
      value: qty,
      style: { width: '70px' }
    },
    { placeholder: 'price', label: 'price', type: '', name: `bill_detail.${index}.price`, id: id, value: price },
    { placeholder: 'Fees', label: 'Fees', type: 'number', name: `bill_detail.${index}.fees`, id: id, value: fees },
    {
      placeholder: 'Discount',
      label: 'Discount',
      type: 'number',
      name: `bill_detail.${index}.discount`,
      id: id,
      value: discount,
      style: { width: '70px' }
    },
    {
      placeholder: 'CGST Rate',
      label: 'CGST Rate',
      type: '',
      name: `bill_detail.${index}.cgstRate`,
      id: id,
      value: cgst,
      style: { width: '50px' }
    },
    {
      placeholder: 'CGST Amount',
      label: 'CGST Amount',
      type: '',
      name: `bill_detail.${index}.cgstAmount`,
      id: id,
      value: (cgst / 100) * price
    },
    {
      placeholder: 'SGST Rate',
      label: 'SGST Rate',
      type: '',
      name: `bill_detail.${index}.sgstRate`,
      id: id,
      value: sgst,
      style: { width: '50px' }
    },
    {
      placeholder: 'SGST Amount',
      label: 'SGST Amount',
      type: '',
      name: `bill_detail.${index}.sgstAmount`,
      id: id,
      value: (sgst / 100) * price
    },
    {
      placeholder: 'IGST Rate',
      label: 'IGST Rate',
      type: '',
      name: `bill_detail.${index}.igstRate`,
      id: id,
      value: igst,
      style: { width: '50px' }
    },
    {
      placeholder: 'IGST Amount',
      label: 'IGST Amount',
      type: '',
      name: `bill_detail.${index}.igstAmount`,
      id: id,
      value: (igst / 100) * price
    }
  ];

  return (
    <>
      {textFieldItem.map((item: any) => (
        <BillField
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
      ))}

      {/* Taxable Amount Calculation */}
      <TableCell>
        <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={1}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography>
              {country?.prefix + '' + (qty && price ? (price * qty - (discount / 100) * price * qty).toFixed(2) : '0.00')}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      {/* Total Amount Calculation */}
      <TableCell>
        <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={1}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography>
              {country?.prefix +
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
export default BillItem;
