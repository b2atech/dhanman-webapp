// material-ui
import { Box, Stack, TableCell, Typography, Tooltip } from '@mui/material';

// third-party
import { getIn } from 'formik';

// project import
import BillField from './BillField';
import { useSelector } from 'store';

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
  products,
  ratesVisibility,
  discountVisibility,
  feesVisibility,
  poNoPoDateVisibility
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
  const Name = `bill_detail[${index}].name`;
  const touchedName = getIn(touched, Name);
  const errorName = getIn(errors, Name);
  const getTotalAmount = (qty: number, price: number, discount: number, fees: number, cgst: number, sgst: number, igst: number) => {
    if (qty && price) {
      var taxableAmount = getTotalTaxableAmount(qty, price, discount, fees);
      var cgstAmount = getCTaxAmount(qty, price, cgst);
      var sgstAmount = getSTaxAmount(qty, price, sgst);
      //var igstAmount = getTaxAmount(qty, price, igst);
      return (taxableAmount + cgstAmount + sgstAmount)?.toFixed(2);
    }
    return 0.0;
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
      var totalAmount = amount - discountAmount + feesAmount;

      var roundedTotalAmount = Number(totalAmount.toFixed(2));

      return roundedTotalAmount;
    }
    return 0.0;
  };

  const getCTaxAmount = (qty: number, price: number, cgst: number) => {
    if (cgst && price && qty) {
      return (cgst / 100) * (price * qty + fees - (discount / 100) * price * qty);
    }
    return 0.0;
  };

  const getSTaxAmount = (qty: number, price: number, sgst: number) => {
    if (sgst && price && qty) {
      return (sgst / 100) * (price * qty + fees - (discount / 100) * price * qty);
    }
    return 0.0;
  };

  <TableCell align="center" sx={{ padding: '2px 0px' }}>
    <Tooltip title={`CGST Rate: ${cgst || 0}%`} placement="top">
      <span>CGST Amt</span>
    </Tooltip>
  </TableCell>;

  const textFieldItem = [
    {
      placeholder: 'Purchase Order',
      label: 'poNo',
      name: `bill_detail.${index}.poNo`,
      type: '',
      id: id,
      value: poNo,
      style: { textAlign: 'left' },
      visibility: poNoPoDateVisibility
    },
    {
      placeholder: 'Purchase Date',
      label: 'poDate',
      name: `bill_detail.${index}.poDate`,
      type: 'date',
      id: id,
      value: poDate,
      style: { width: '140px', textAlign: 'left' },
      sx: { width: '100%' },
      visibility: poNoPoDateVisibility
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
      visibility: true,
      style: { width: '200px', textAlign: 'left' }
    },
    {
      placeholder: 'Description',
      label: 'Description',
      name: `bill_detail.${index}.description`,
      type: 'text',
      id: id,
      value: description,
      visibility: true,
      style: { width: '180px', textAlign: 'center' }
    },
    {
      placeholder: 'Qty',
      label: 'Qty',
      type: 'number',
      name: `bill_detail.${index}.quantity`,
      id: id,
      value: qty,
      visibility: true,
      style: { width: '80px', textAlign: 'right' }
    },
    {
      placeholder: 'price',
      label: 'price',
      type: '',
      name: `bill_detail.${index}.price`,
      id: id,
      value: price,
      visibility: true,
      style: { width: '110px', textAlign: 'right' }
    },
    {
      placeholder: 'Fees',
      label: 'Fees',
      type: 'number',
      name: `bill_detail.${index}.fees`,
      id: id,
      value: fees,
      visibility: feesVisibility,
      style: { width: '95px', textAlign: 'center' }
    },
    {
      placeholder: 'Discount',
      label: 'Discount',
      type: 'number',
      name: `bill_detail.${index}.discount`,
      id: id,
      value: discount,
      visibility: discountVisibility,
      style: { width: '80px', textAlign: 'center' }
    },
    {
      placeholder: 'tax am',
      label: 'tax am',
      name: `bill_detail.${index}.taxableAmount`,
      type: '',
      id: id,
      value: getTotalTaxableAmount(qty, price, discount, fees),
      style: { width: '100px' },
      visibility: true
    },
    {
      placeholder: 'CGST Rate',
      label: 'CGST Rate',
      type: '',
      name: `bill_detail.${index}.cgstRate`,
      id: id,
      value: cgst,
      visibility: ratesVisibility
    },
    {
      placeholder: 'CGST Amount',
      label: 'CGST Amount',
      type: 'number',
      name: `bill_detail.${index}.cgstAmount`,
      id: id,
      value: (cgst / 100) * (price * qty + fees - (discount / 100) * price * qty),
      style: { width: '100px', textAlign: 'center' },
      visibility: true
    },
    {
      placeholder: 'SGST Rate',
      label: 'SGST Rate',
      type: '',
      name: `bill_detail.${index}.sgstRate`,
      id: id,
      value: sgst,
      visibility: ratesVisibility
    },
    {
      placeholder: 'SGST Amount',
      label: 'SGST Amount',
      type: 'number',
      name: `bill_detail.${index}.sgstAmount`,
      id: id,
      value: (sgst / 100) * (price * qty + fees - (discount / 100) * price * qty),
      style: { width: '100px', textAlign: 'center' },
      visibility: true
    },
    {
      placeholder: 'IGST Rate',
      label: 'IGST Rate',
      type: '',
      name: `bill_detail.${index}.igstRate`,
      id: id,
      value: igst,
      visibility: ratesVisibility
    },
    {
      placeholder: 'IGST Amount',
      label: 'IGST Amount',
      type: 'number',
      name: `bill_detail.${index}.igstAmount`,
      id: id,
      value: (igst / 100) * (price * qty + fees - (discount / 100) * price * qty),
      style: { width: '100px', textAlign: 'center' },
      visibility: true
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
            style: { ...item.style, textAlign: 'right' },
            visibility: item.visibility
          }}
          key={item.label}
          style={{ marginBottom: 0 }}
        />
      ))}

      {/* Total Amount Calculation */}
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
export default BillItem;
