// material-ui
import { Box, Stack, TableCell, Typography } from '@mui/material';

// third-party
import { getIn } from 'formik';

// project import
import InvoiceField from './InvoiceField';
import { useSelector } from 'store';

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
  onEditItem,
  index,
  Blur,
  errors,
  touched,
  setFieldValue,
  products,
  ratesVisibility,
  discountVisibility,
  feesVisibility
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

  const Name = `invoice_detail[${index}].name`;
  const touchedName = getIn(touched, Name);
  const errorName = getIn(errors, Name);
  const getTotalAmount = (qty: number, price: number, discount: number, fees: number, cgst: number, sgst: number, igst: number) => {
    if (qty && price) {
      var taxableAmount = getTotalTaxableAmount(qty, price, discount, fees);
      var cgstAmount = getCTaxAmount(qty, price, cgst);
      var sgstAmount = getSTaxAmount(qty, price, sgst);
      //var igstAmount = getITaxAmount(qty, price, igst);
      return (taxableAmount + cgstAmount + sgstAmount).toFixed(2);
    }
    return '0.0';
  };

  const getTotalTaxableAmount = (qty: number, price: number, discount: number, fees: number) => {
    if (qty && price) {
      var amount = price * qty;
      var discountAmount = 0;
      var feesAmount = 0;
      if (discount) {
        discountAmount = amount * (discount / 100);
      }
      if (fees) {
        feesAmount = fees;
      }
      return amount - discountAmount + feesAmount;
    }
    return 0.0;
  };
  const getCTaxAmount = (qty: number, price: number, cgst: number) => {
    if (cgst && price && qty) {
      return (cgst / 100) * price * qty;
    }
    return 0.0;
  };
  const getSTaxAmount = (qty: number, price: number, sgst: number) => {
    if (sgst && price && qty) {
      return (sgst / 100) * price * qty;
    }
    return 0.0;
  };

  // const getITaxAmount = (qty: number, price: number, igst: number) => {
  //   if (igst && price && qty) {
  //     return (igst / 100) * price * qty;
  //   }
  //   return 0.0;
  // };
  const textFieldItem = [
    {
      placeholder: 'SalesOrder',
      label: 'soNo',
      name: `invoice_detail.${index}.soNo`,
      type: 'number',
      id: id,
      value: soNo,
      visibility: true
    },
    {
      placeholder: 'SalesDate',
      label: 'soDate',
      name: `invoice_detail.${index}.soDate`,
      type: 'date',
      id: id,
      value: soDate,
      style: { width: '140px' },
      visibility: true
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
      style: { width: '180px' },
      selectOptions: products.map((product: any) => ({
        label: product.productName,
        value: product.productName
      })),
      selectOnChange: handleNameChange,
      visibility: true
    },
    {
      placeholder: 'Description',
      label: 'Description',
      name: `invoice_detail.${index}.description`,
      type: 'text',
      id: id,
      value: description,
      style: { width: '150px' },
      visibility: true
    },
    {
      placeholder: 'Qty',
      label: 'Qty',
      type: 'number',
      name: `invoice_detail.${index}.quantity`,
      id: id,
      value: qty,
      style: { width: '70px' },
      visibility: true
    },
    { placeholder: '', label: 'price', type: 'number', name: `invoice_detail.${index}.price`, id: id, value: price, visibility: true },
    {
      placeholder: 'Fees',
      label: 'Fees',
      name: `invoice_detail.${index}.fees`,
      type: 'number',
      id: id,
      value: fees,
      visibility: feesVisibility
    },
    {
      placeholder: 'Discount',
      label: 'Discount',
      name: `invoice_detail.${index}.discount`,
      type: 'number',
      id: id,
      value: discount,
      style: { width: '70px' },
      visibility: discountVisibility
    },
    {
      placeholder: 'tax am',
      label: 'tax am',
      name: `invoice_detail.${index}.taxableAmount`,
      type: '',
      id: id,
      value: getTotalTaxableAmount(qty, price, discount, fees),
      style: { width: '100px' },
      visibility: true
    },
    {
      placeholder: 'CgstRate',
      label: 'Cgst Rt',
      name: `invoice_detail.${index}.cgst`,
      type: '',
      id: id,
      value: cgst,
      style: { width: '50px' },
      visibility: ratesVisibility
    },
    {
      placeholder: 'Cgst Amount',
      label: 'Cgst Amount',
      name: `invoice_detail.${index}.CgstAmount`,
      type: 'number',
      id: id,
      value: (cgst / 100) * price * qty,
      visibility: true
    },
    {
      placeholder: 'SgstRate',
      label: 'Sgst Rt',
      name: `invoice_detail.${index}.sgst`,
      type: '',
      id: id,
      value: sgst,
      style: { width: '50px' },
      visibility: ratesVisibility
    },
    {
      placeholder: 'Sgst Amount',
      label: 'Sgst Amount',
      name: `invoice_detail.${index}.SgstAmount`,
      type: 'number',
      id: id,
      value: (sgst / 100) * price * qty,
      visibility: true
    },
    {
      placeholder: 'IgstRate',
      label: 'Igst Rt',
      name: `invoice_detail.${index}.igst`,
      type: '',
      id: id,
      value: igst,
      style: { width: '50px' },
      visibility: ratesVisibility
    },
    {
      placeholder: 'Igst Amount',
      label: 'Igst Amount',
      name: `invoice_detail.${index}.IgstAmount`,
      type: 'number',
      id: id,
      value: (igst / 100) * price * qty,
      visibility: true
    }
  ];

  return (
    <>
      {textFieldItem.map((item: any, index: any) => {
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
              style: { ...item.style },
              visibility: item.visibility
            }}
            key={item.label}
            style={{ marginBottom: 0 }}
          />
        );
      })}
      <TableCell sx={{ textAlign: 'right' }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
          <Box sx={{ minWidth: 90 }}>
            <Typography>{country?.prefix + ' ' + getTotalAmount(qty, price, discount, fees, cgst, sgst, igst)}</Typography>
          </Box>
        </Stack>
      </TableCell>
    </>
  );
};

export default InvoiceItem;
