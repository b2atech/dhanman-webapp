import { Button, Grid, Stack } from '@mui/material';

import MainCard from 'components/MainCard';

import {
  Autocomplete,
  InputLabel,
  FormControl,
  TextField,
  Box,
  FormHelperText,
  Typography,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Table,
  Divider,
  FormControlLabel,
  Switch,
  Checkbox,
  Tooltip
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddressModal from 'sections/apps/invoice/AddressModal';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'store';
import { toggleCustomerPopup, selectCountry, reviewInvoicePopup } from 'store/reducers/invoice';
import { customerPopup } from 'store/reducers/invoice';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import { useTheme } from '@mui/material/styles';
import { v4 as UIDV4 } from 'uuid';
import { InvoiceHeader_main, InvoiceLine } from 'types/invoiceDetails';
import { createInvoiceRequest, getInvoiceDefaultStatus } from 'api/services/SalesService';
import { openSnackbar } from 'store/reducers/snackbar';
import { CountryType } from 'types/invoice';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';
// third party
import * as yup from 'yup';
import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';
import { useNavigate } from 'react-router';
import VendorAddressModel from 'sections/apps/bill/VendorAddressModel';
import { useEffect, useState } from 'react';
import { getAllProducts } from 'api/services/InventoryService';

const validationSchema = yup.object({
  id: yup.string().required('Invoice ID is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
  status: yup.string().required('Status selection is required'),
  invoiceDate: yup.date().required('Invoice date is required'),
  due_date: yup
    .date()
    .when('invoiceDate', (invoiceDate, schema) => {
      return invoiceDate && schema.min(invoiceDate, "Due date can't be before invoice date");
    })
    .required('Due date is required'),
  customerInfo: yup
    .object({
      firstName: yup.string().required('Invoice receiver information is required')
    })
    .required('Invoice receiver information is required'),
  invoice_detail: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Product name is required'),
        description: yup.string(),
        qty: yup.number().min(1, 'Quantity must be at least 1'),
        price: yup.number().min(0, 'Price must be at least 0')
      })
    )
    .required('Invoice details is required')
    .min(1, 'Invoice must have at least 1 item'),
  discount: yup.number().min(0, 'Discount must be at least 0'),
  tax: yup.number().min(0, 'Tax must be at least 0'),
  note: yup.string().max(500, 'Notes cannot exceed 500 characters')
});

// ==============================|| INVOICE - CREATE ||============================== //

const Createinvoice = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { open, isCustomerOpen, country, countries, isOpen } = useSelector((state) => state.invoice);
  const notesLimit: number = 500;
  const navigation = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [showGSTRates, setShowGSTRates] = useState(true);
  const [discountFees, setDiscountFees] = useState(true);
  const [defaultGSTRates, setDefaultGSTRates] = useState();
  const [defaultStatus, setDefaultStatus] = useState();

  const handlerCreate = (values: any) => {
    const invoice: InvoiceHeader_main = {
      id: Math.floor(Math.random() * 90000) + 10000,
      invoiceNumber: values.invoiceNumber,
      customer_name: values.cashierInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(Math.round(Math.random() * 10)),
      discount: Number(values.discount),
      tax: Number(values.tax),
      invoiceDate: format(values.invoiceDate, 'yyyy-MM-dd'),
      dueDate: format(values.due_date, 'yyyy-MM-dd'),

      quantity: Number(
        values.invoice_detail?.reduce((sum: any, i: any) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      invoiceStatusId: 'f247baba-2aa4-4adf-9bd1-fa2dd8dd0d4d',
      totalAmount: Number(values.totalAmount),
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      note: values.note,
      clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      currency: 'INR',
      paymentTerm: 6,
      coaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      billPaymentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      customerId: values.customerInfo.id,
      invoiceDetails: undefined,
      invoiceVoucher: 'YP002'
    };

    invoice.lines = values.invoice_detail.map((invoiceItem: any) => {
      let invoiceLine = {} as InvoiceLine;
      invoiceLine.amount = parseInt(invoiceItem.price) * invoiceItem.quantity;
      invoiceLine.name = invoiceItem.name;
      invoiceLine.description = invoiceItem.description;
      invoiceLine.quantity = invoiceItem.quantity;
      invoiceLine.price = invoiceItem.price;
      return invoiceLine;
    });

    createInvoiceRequest(invoice).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Invoice Added successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      navigation('/sales/invoices/list');
    });
  };

  useEffect(() => {
    getAllProducts('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((productList) => {
        if (Array.isArray(productList)) {
          setProducts(productList);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    getInvoiceDefaultStatus('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((status) => {
        setDefaultStatus(status.initialStatusName);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addNextInvoiceHandler = () => {
    dispatch(
      reviewInvoicePopup({
        isOpen: false
      })
    );
  };

  return (
    <MainCard>
      <Formik
        initialValues={{
          id: 120,
          invoiceNumber: null,
          status: 'Unpaid',
          invoiceDate: new Date(),
          due_date: null,
          cashierInfo: {
            name: 'Belle J. Richter',
            address: '1300 Cooks Mine, NM 87829',
            phone: '305-829-7809',
            email: 'belljrc23@gmail.com'
          },
          customerInfo: {
            phoneNumber: '',
            email: '',
            firstName: '',
            lastName: '',
            city: '',
            gstIn: ''
          },
          invoice_detail: [
            {
              soNo: 0,
              soDate: '',
              name: '',
              description: '',
              quantity: 0,
              price: 0,
              amount: 0,
              discount: 0,
              fees: 0,
              taxableAmount: 0,
              cRt: 0,
              cgstAmount: 0,
              sRt: 0,
              sgstAmount: 0,
              iRt: 0,
              igstAmount: 0
            }
          ],
          discount: 0,
          tax: 0,
          note: '',
          totalAmount: 0
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const subtotal = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.price * Math.floor(curr.quantity));
            else return prev;
          }, 0);
          const taxRate = (values.tax * subtotal) / 100;
          const cgstAmount = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.cgstAmount);
            else return prev;
          }, 0);
          const discountRate = (values.discount * subtotal) / 100;
          const grandAmount = subtotal - discountRate + taxRate;
          values.totalAmount = grandAmount;
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Status</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          padding: '8px',
                          '&:hover': {
                            border: '1px solid #757575'
                          }
                        }}
                      >
                        <Typography>{defaultStatus}</Typography>
                      </Box>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice No.</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        name="invoiceNumber"
                        id="invoiceNumber"
                        value={values.invoiceNumber}
                        onChange={handleChange}
                        inputProps={{
                          maxLength: 16
                        }}
                      />
                    </FormControl>
                  </Stack>
                  {touched.invoiceNumber && errors.invoiceNumber && (
                    <FormHelperText error={true}>{errors.invoiceNumber as string}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.invoiceDate && errors.invoiceDate)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="MM/dd/yyyy"
                          value={values.invoiceDate}
                          onChange={(newValue) => setFieldValue('invoiceDate', newValue)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.invoiceDate && errors.invoiceDate && (
                    <FormHelperText error={true}>{errors.invoiceDate as string}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Due Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.due_date && errors.due_date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format="MM/dd/yyyy"
                          value={values.due_date}
                          onChange={(newValue) => setFieldValue('due_date', newValue)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.due_date && errors.due_date && <FormHelperText error={true}>{errors.due_date as string}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">From:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{values?.cashierInfo?.name}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.address}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.email}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.phone}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }} color="grey.200">
                          <VendorAddressModel
                            open={open}
                            setOpen={(value) =>
                              dispatch(
                                toggleCustomerPopup({
                                  open: value
                                })
                              )
                            }
                            handlerVendorAddress={(address) => setFieldValue('vendorInfo', address)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">To:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{`${values?.customerInfo?.firstName} ${values?.customerInfo?.lastName}`}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.city}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.phoneNumber}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.email}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.gstIn}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign="right" color="grey.200">
                          <Button
                            size="small"
                            startIcon={<PlusOutlined />}
                            color="secondary"
                            variant="outlined"
                            onClick={() =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: true
                                })
                              )
                            }
                          >
                            Add
                          </Button>
                          <AddressModal
                            open={isCustomerOpen}
                            setOpen={(value) =>
                              dispatch(
                                customerPopup({
                                  isCustomerOpen: value
                                })
                              )
                            }
                            handlerAddress={(value) => setFieldValue('customerInfo', value)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                  {touched.customerInfo && errors.customerInfo && (
                    <FormHelperText error={true}>{errors?.customerInfo?.firstName as string}</FormHelperText>
                  )}
                </Grid>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="h5">
                      Detail <span style={{ color: 'grey', fontSize: '0.9em' }}>(Note : )</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
                    <FormControlLabel
                      control={<Switch checked={showGSTRates} onChange={() => setShowGSTRates(!showGSTRates)} name="showGSTRates" />}
                      label="GST Rates"
                    />
                    <FormControlLabel
                      control={<Switch checked={discountFees} onChange={() => setDiscountFees(!discountFees)} name="discountFees" />}
                      label="Discount/Fees"
                    />
                    <Tooltip title="Default GSt Rates">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={defaultGSTRates}
                            onChange={() => setDefaultGSTRates(defaultGSTRates)} // Update the state with the new value
                            name="defaultGSTRates"
                          />
                        }
                        label=""
                      />
                    </Tooltip>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <FieldArray
                    name="invoice_detail"
                    render={({ remove, push }) => {
                      return (
                        <>
                          <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Sr No</TableCell>
                                  <TableCell>So No</TableCell>
                                  <TableCell>So Date</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell>Qty</TableCell>
                                  <TableCell>Price</TableCell>
                                  {discountFees && (
                                    <>
                                      <TableCell>Fees</TableCell>
                                      <TableCell>Discount</TableCell>
                                    </>
                                  )}
                                  <TableCell>Taxable Amt</TableCell>
                                  {showGSTRates && (
                                    <>
                                      <TableCell>C Rt</TableCell>
                                      <TableCell>S Rt</TableCell>
                                      <TableCell>I Rt</TableCell>
                                    </>
                                  )}
                                  <TableCell>CGST Amt</TableCell>
                                  <TableCell>SGST Amt</TableCell>
                                  <TableCell>IGST Amt</TableCell>
                                  <TableCell align="right">Total Amt</TableCell>
                                  <TableCell align="right">Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values.invoice_detail?.map((item: any, index: number) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{values.invoice_detail.indexOf(item) + 1}</TableCell>
                                    <InvoiceItem
                                      key={item.id}
                                      id={item.id}
                                      index={index}
                                      soNo={item.soNo}
                                      soDate={item.soDate}
                                      name={item.name}
                                      description={item.description}
                                      qty={item.quantity}
                                      price={item.price}
                                      fees={item.fees}
                                      discount={item.discount}
                                      taxableAmount={item.taxableAmount}
                                      cgst={item.cgst}
                                      sgst={item.sgst}
                                      igst={item.igst}
                                      onDeleteItem={(index: number) => remove(index)}
                                      onEditItem={handleChange}
                                      Blur={handleBlur}
                                      errors={errors}
                                      touched={touched}
                                      products={products}
                                      setFieldValue={setFieldValue}
                                    />
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Divider />
                          {touched.invoice_detail && errors.invoice_detail && !Array.isArray(errors?.invoice_detail) && (
                            <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                              <FormHelperText error={true}>{errors.invoice_detail as string}</FormHelperText>
                            </Stack>
                          )}
                          <Grid container justifyContent="space-between">
                            <Grid item xs={12} md={8}>
                              <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                <Button
                                  color="primary"
                                  startIcon={<PlusOutlined />}
                                  onClick={() =>
                                    push({
                                      id: UIDV4(),
                                      name: '',
                                      description: '',
                                      quantity: 1,
                                      price: '1.00'
                                    })
                                  }
                                  variant="dashed"
                                  sx={{ bgcolor: 'transparent !important' }}
                                >
                                  Add Item
                                </Button>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Grid item xs={12}>
                                <Stack spacing={2}>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                    <Typography>{country?.prefix + '' + subtotal.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>CGST Tax Amount:</Typography>
                                    <Typography>{country?.prefix + '' + cgstAmount.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>SGST TaxA mount:</Typography>
                                    <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>IGST Tax Amount:</Typography>
                                    <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>After Fees:</Typography>
                                    <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>After Discount:</Typography>
                                    <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1">Grand Total:</Typography>
                                    <Typography variant="subtitle1">
                                      {grandAmount % 1 === 0
                                        ? country?.prefix + '' + grandAmount
                                        : country?.prefix + '' + grandAmount.toFixed(2)}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Notes</InputLabel>
                    <TextField
                      placeholder="Address"
                      rows={3}
                      value={values.note}
                      multiline
                      name="note"
                      onChange={handleChange}
                      inputProps={{
                        maxLength: notesLimit
                      }}
                      helperText={`${values.note.length} / ${notesLimit}`}
                      sx={{
                        width: '100%',
                        '& .MuiFormHelperText-root': {
                          mr: 0,
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>Set Currency*</InputLabel>
                    <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                      <Autocomplete
                        id="country-select-demo"
                        fullWidth
                        options={countries}
                        defaultValue={countries[2]}
                        value={countries.find((option: CountryType) => option.code === country?.code)}
                        onChange={(event, value) => {
                          dispatch(
                            selectCountry({
                              country: value
                            })
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.code && (
                              <img loading="lazy" width="20" src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} alt="flag" />
                            )}
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => {
                          const selected = countries.find((option: CountryType) => option.code === country?.code);
                          return (
                            <TextField
                              {...params}
                              name="phoneCode"
                              placeholder="Select"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    {selected && selected.code !== '' && (
                                      <img
                                        style={{ marginRight: 6 }}
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                                        alt="flag"
                                      />
                                    )}
                                  </>
                                )
                              }}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      // disabled={values.status === '' || !isValid}
                      sx={{ color: 'secondary.dark' }}
                      onClick={() =>
                        dispatch(
                          reviewInvoicePopup({
                            isOpen: true
                          })
                        )
                      }
                    >
                      Preview
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{ color: 'secondary.dark' }}>
                      Save
                    </Button>
                    <Button color="primary" variant="contained" type="submit">
                      Create & Send
                    </Button>
                    <InvoiceModal
                      isOpen={isOpen}
                      setIsOpen={(value: any) =>
                        dispatch(
                          reviewInvoicePopup({
                            isOpen: value
                          })
                        )
                      }
                      key={values.invoiceNumber}
                      invoiceInfo={{
                        ...values,
                        subtotal,
                        taxRate,
                        discountRate,
                        grandAmount
                      }}
                      items={values?.invoice_detail}
                      onAddNextInvoice={addNextInvoiceHandler}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default Createinvoice;
