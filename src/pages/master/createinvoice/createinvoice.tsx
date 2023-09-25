import { Button, Grid, Stack } from '@mui/material';

import MainCard from 'components/MainCard';

import {
  Autocomplete,
  InputLabel,
  FormControl,
  TextField,
  MenuItem,
  Box,
  Select,
  FormHelperText,
  Typography,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Table,
  Divider
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddressModal from 'sections/apps/invoice/AddressModal';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'store';
import { toggleCustomerPopup, selectCountry, reviewInvoicePopup } from 'store/reducers/invoice';
import { customerPopup } from 'store/reducers/invoice';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import { useTheme } from '@mui/material/styles';
import { v4 as UIDV4 } from 'uuid';
import { InvoiceHeader_main, InvoiceLine } from 'types/invoiceDetails';
import { createInvoiceRequest } from 'api/services/SalesService';
import { openSnackbar } from 'store/reducers/snackbar';
import { CountryType } from 'types/invoice';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';
// third party
// import * as yup from 'yup';
import { format } from 'date-fns';

import { FieldArray, Form, Formik } from 'formik';
import { useNavigate } from 'react-router';

// const validationSchema = yup.object({
//   customerInfo: yup
//     .object({
//       name: yup.string().required('Invoice receiver information is required')
//     })
//     .required('Invoice receiver information is required'),
//   status: yup.string().required('Status selection is required'),
//   invoice_detail: yup
//     .array()
//     .required('Invoice details is required')
//     .of(
//       yup.object().shape({
//         name: yup.string().required('Product name is required')
//       })
//     )
//     .min(1, 'Invoice must have at least 1 items')
// });

// ==============================|| INVOICE - CREATE ||============================== //

const Createinvoice = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { open, isCustomerOpen, country, countries, isOpen } = useSelector((state) => state.invoice);
  const notesLimit: number = 500;
  const navigation = useNavigate();

  const handlerCreate = (values: any) => {
    const invoice: InvoiceHeader_main = {
      id: Math.floor(Math.random() * 90000) + 10000,
      invoiceNumber: String(values.invoiceNumber),
      customer_name: values.cashierInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(Math.round(Math.random() * 10)),
      discount: Number(values.discount),
      tax: Number(values.tax),
      invoiceDate: format(values.invoiceDate, 'yyyy-MM-dd'), // Replace with your desired date
      dueDate: format(values.due_date, 'yyyy-MM-dd'), // Replace with your desired date

      quantity: Number(
        values.invoice_detail?.reduce((sum: any, i: any) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      totalAmount: 1000,
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      note: values.note,
      clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      currency: 'INR',
      paymentTerm: 10,
      billStatusId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      vendorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      coaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      billPaymentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      customerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      invoiceDetails: undefined,
      invoiceVoucher: 'YP001'
    };

    invoice.lines = values.invoice_detail.map((invoiceItem: any) => {
      let invoiceLine = {} as InvoiceLine;
      invoiceLine.amount = parseInt(invoiceItem.price) * invoiceItem.qty;
      invoiceLine.name = invoiceItem.name;
      invoiceLine.description = invoiceItem.description;
      invoiceLine.quantity = invoiceItem.qty;
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
      navigation('/invoice/list');
    });
  };

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
          invoiceNumber: '',
          status: '',
          invoiceDate: new Date(),
          due_date: '',
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
            lastName: ''
          },
          invoice_detail: [
            {
              name: '',
              description: '',
              qty: 0,
              price: 0,
              amount: 0
            }
          ],
          discount: 0,
          tax: 0,
          note: ''
        }}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const subtotal = values?.invoice_detail.reduce((prev, curr: any) => {
            if (curr.name.trim().length > 0) return prev + Number(curr.price * Math.floor(curr.qty));
            else return prev;
          }, 0);
          const taxRate = (values.tax * subtotal) / 100;
          const discountRate = (values.discount * subtotal) / 100;
          const totalAmount = subtotal - discountRate + taxRate;
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice Id</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        required
                        type="number"
                        name="invoiceNumber"
                        id="invoiceNumber"
                        value={values.invoiceNumber}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Status</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <Select
                        value={values.status}
                        displayEmpty
                        name="status"
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <Box sx={{ color: 'secondary.400' }}>Select status</Box>;
                          }
                          return selected;
                          // return selected.join(', ');
                        }}
                        onChange={handleChange}
                        error={Boolean(errors.status && touched.status)}
                      >
                        <MenuItem disabled value="">
                          Select status
                        </MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  {touched.status && errors.status && <FormHelperText error={true}>{errors.status}</FormHelperText>}
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
                            <Typography color="secondary">{values?.cashierInfo?.phone}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.email}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }} color="grey.200">
                          <Button
                            variant="outlined"
                            startIcon={<EditOutlined />}
                            color="secondary"
                            onClick={() =>
                              dispatch(
                                toggleCustomerPopup({
                                  open: true
                                })
                              )
                            }
                            size="small"
                          >
                            Change
                          </Button>
                          <AddressModal
                            open={open}
                            setOpen={(value) =>
                              dispatch(
                                toggleCustomerPopup({
                                  open: value
                                })
                              )
                            }
                            handlerAddress={(address) => setFieldValue('cashierInfo', address)}
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
                            <Typography color="secondary">{values?.customerInfo?.phoneNumber}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.email}</Typography>
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

                <Grid item xs={12}>
                  <Typography variant="h5">Detail</Typography>
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
                                  <TableCell>#</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell>Qty</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell align="right">Amount</TableCell>
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
                                      name={item.name}
                                      description={item.description}
                                      qty={item.qty}
                                      price={item.price}
                                      onDeleteItem={(index: number) => remove(index)}
                                      onEditItem={handleChange}
                                      Blur={handleBlur}
                                      errors={errors}
                                      touched={touched}
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
                                      qty: 1,
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
                              <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Discount(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="discount"
                                      id="discount"
                                      placeholder="0.0"
                                      value={values.discount}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Tax(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="tax"
                                      id="tax"
                                      placeholder="0.0"
                                      value={values.tax}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Stack spacing={2}>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Sub Total:</Typography>
                                    <Typography>{country?.prefix + '' + subtotal.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Discount:</Typography>
                                    <Typography variant="h6" color={theme.palette.success.main}>
                                      {country?.prefix + '' + discountRate.toFixed(2)}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.grey[500]}>Tax:</Typography>
                                    <Typography>{country?.prefix + '' + taxRate.toFixed(2)}</Typography>
                                  </Stack>
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle1">Grand Total:</Typography>
                                    <Typography variant="subtitle1">
                                      {totalAmount % 1 === 0
                                        ? country?.prefix + '' + totalAmount
                                        : country?.prefix + '' + totalAmount.toFixed(2)}
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
                        totalAmount
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
