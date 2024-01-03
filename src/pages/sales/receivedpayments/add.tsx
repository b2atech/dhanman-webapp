// material-ui
import {
  Stack,
  FormControl,
  Grid,
  InputLabel,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Autocomplete,
  Box,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  TextareaAutosize,
  Button
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Form, FieldArray, useFormik, FormikValues, Formik } from 'formik';
import {} from 'utils/react-table';

// project imports
import MainCard from 'components/MainCard';
import { IInvoice } from 'types/invoice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InvoicePaymentHeader, IInvoicePaymentLine } from 'types/invoiceDetails';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { createReceivedPaymentRequest, getAllInvoiceHeadersByCustomerId, getAllCustomers } from 'api/services/SalesService';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import InvoicePaymentItem from 'sections/apps/invoice/InvoicePaymentItem';

// constant
const getInitialValues = (paidPayment: FormikValues | null) => {
  const newPaidPayment = {
    customernames: '',
    clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    customerId: '',
    customerName: '',
    transactionId: '',
    coaId: '',
    description: '',
    amount: '',
    totalAmount: '',
    setteledAmount: ''
  };

  return newPaidPayment;
};

// ==============================|| Paid Payment ADD / EDIT ||============================== //
export interface Props {
  receivedPayment?: any;
  onCancel: () => void;
  data: IInvoice;
}

const AddReceivedPayment = ({ receivedPayment, onCancel }: Props) => {
  const PaidPaymentSchema = Yup.object().shape({
    customerName: Yup.string().max(255).required('Please Enter customer Name'),
    amount: Yup.string()
      .matches(/^\d+(\.\d{0,2})?$/, 'Use only two decimal places')
      .required('Please Enter Amount'),
    description: Yup.string().max(255).required('Please Enter Description')
  });

  const [customernames, setCustomerNames] = useState<any>();
  const [selectedCustomerInvoices, setSelectedCustomerInvoices] = useState<IInvoice[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalSettledAmount, setTotalSettledAmount] = useState<number>(0);
  const [remainingTotalamount, setRemainingTotalamount] = useState<number>(0);
  const [totalReceivedAmount, setTotalReceivedAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [totalAmountOfInvoice, setTotalAmountOfInvoice] = useState<number>(0);

  useEffect(() => {
    getAllCustomers('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((customerList) => {
        if (Array.isArray(customerList)) {
          const customerData = customerList.map((customer) => ({
            id: customer.id,
            name: `${customer.firstName} ${customer.lastName}`
          }));
          setCustomerNames(customerData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCustomerId && selectedCustomerId !== '') {
      getAllInvoiceHeadersByCustomerId(selectedCustomerId)
        .then((invoiceList) => {
          if (Array.isArray(invoiceList)) {
            setInvoices(invoiceList);
            const total = invoiceList.reduce((acc, current) => acc + current.totalAmount, 0);
            setTotalAmount(total);
            setSelectedCustomerInvoices(invoiceList);
          } else {
            console.error('API response is not an array:', invoiceList);
          }
        })
        .catch((error) => {
          console.error('Error fetching invoice data:', error);
        });
    }
  }, [selectedCustomerId]);

  const addCommas = (number: number) => {
    const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
    return formattedNumber;
  };

  useEffect(() => {
    setTotalAmountOfInvoice(selectedCustomerInvoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0));
    let totalSettledAmount = selectedCustomerInvoices.reduce((acc, invoice) => acc + invoice.setteledAmount, 0);
    setTotalSettledAmount(totalSettledAmount);
    setRemainingTotalamount(totalAmountOfInvoice - totalSettledAmount);
  }, [selectedCustomerInvoices, totalAmountOfInvoice]);

  useEffect(() => {
    const remainingAmount = totalReceivedAmount > remainingTotalamount ? totalReceivedAmount - remainingTotalamount : 0;
    setAdvanceAmount(remainingAmount);
  }, [totalReceivedAmount, totalAmount, totalAmountOfInvoice, remainingTotalamount]);

  const formik = useFormik({
    initialValues: getInitialValues(receivedPayment!),
    validationSchema: PaidPaymentSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const receivedPaymentData = {
          clientId: values.clientId,
          customerId: values.customerId,
          customerName: values.customerName,
          transactionId: values.transactionId,
          coaId: values.coaId,
          description: values.description,
          amount: values.amount,
          setteledAmount: values.setteledAmount
        };
        if (receivedPayment) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Paid Payment updated successfully.',
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          const response = await createReceivedPaymentRequest(receivedPaymentData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Received Payment added successfully.',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            window.location.reload();
          }
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { getFieldProps } = formik;

  const handlerCreate = (values: any) => {
    const invoice: InvoicePaymentHeader = {
      id: '',
      companyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      customerId: '',
      customerName: '',
      invoiceDate: new Date(),
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      amount: Number(values.amount),
      receivingAmount: Number(values.receivingAmount),
      description: '',
      paymentMode: '',
      paymentThrough: ''
    };
    invoice.lines = values.invoice_payment_detail.map((invoiceItem: any) => {
      let invoicePaymentLine = {} as IInvoicePaymentLine;
      invoicePaymentLine.invoicelNumber = invoiceItem.invoicelNumber;
      invoicePaymentLine.invoiceDate = invoiceItem.invoiceDate;
      invoicePaymentLine.dueDate = invoiceItem.dueDate;
      invoicePaymentLine.invoiceStatusId = invoiceItem.invoiceStatusId;
      invoicePaymentLine.invoiceStatus = invoiceItem.invoiceStatus;
      invoicePaymentLine.invoiceAmount = invoiceItem.invoiceAmount;
      invoicePaymentLine.setteledAmount = invoiceItem.setteledAmount;
      invoicePaymentLine.receivingAmount = invoiceItem.receivingAmount;
      return invoicePaymentLine;
    });
  };
  return (
    <MainCard>
      <Formik
        initialValues={{
          invoice_payment_detail: [
            {
              invoicelNumber: 0,
              invoiceDate: '',
              dueDate: '',
              status: '',
              totalAmount: 0,
              setteledAmount: 0,
              receivingAmount: 0
            }
          ]
        }}
        validationSchema={PaidPaymentSchema}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const formattedTotalAmount = addCommas(totalAmountOfInvoice);
          const formattedtotalSettledAmount = addCommas(totalSettledAmount);
          const formattedremainingTotalamount = addCommas(remainingTotalamount);
          const formattedtotalPaidAmount = addCommas(totalReceivedAmount);
          const formattedadvanceAmount = addCommas(advanceAmount);

          return (
            <Form onSubmit={handleSubmit}>
              <Grid item xs={12} sm={5} md={4}>
                <Grid container justifyContent="flex-end">
                  <Stack spacing={1}>
                    {/* <InputLabel sx={{ color: 'grey', fontSize: '0.95rem' }}>Status : {defaultStatus}</InputLabel> */}
                  </Stack>
                </Grid>
              </Grid>
              <Form onSubmit={handleSubmit}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={12}>
                    <Grid container spacing={1} direction="column">
                      <Grid container spacing={1.5} direction="row" sx={{ marginBottom: 2.5 }}>
                        <Grid item xs={6}>
                          <InputLabel sx={{ mb: 0.5 }}>Customer Name</InputLabel>
                          <FormControl sx={{ width: '100%' }}>
                            {customernames && customernames.length > 0 ? (
                              <Autocomplete
                                id="controllable-states-demo"
                                options={(customernames || []) as any[]}
                                getOptionLabel={(option: any) => `${option.name}`}
                                onChange={(event, newValue) => {
                                  if (newValue && newValue.id) {
                                    setSelectedCustomerId(newValue.id);
                                  } else {
                                    setSelectedCustomerId(null);
                                  }
                                  handleChange({ target: { name: 'customerName', value: newValue ? newValue.name : '' } });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            ) : (
                              <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px">
                                <CircularProgress size={30} thickness={4} />
                                <Grid flexDirection={'column'}>
                                  <Typography variant="body1" style={{ marginTop: '32x' }}>
                                    Loading Customer Names,
                                  </Typography>
                                  <Typography variant="body1" style={{ marginTop: '32x' }}>
                                    Please Wait...!
                                  </Typography>
                                </Grid>
                              </Box>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <InputLabel sx={{ mb: 0.5 }}>Date</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker format="DD-MM-YYYY" />
                          </LocalizationProvider>
                        </Grid>

                        <Grid item xs={2}>
                          <InputLabel sx={{ mb: 0.5 }}>Remaining Invoice Amount</InputLabel>
                          <TextField
                            disabled
                            sx={{ width: '100%', textAlign: 'right' }}
                            id="totalAmount"
                            value={`₹ ${remainingTotalamount.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}`}
                            placeholder={String(totalAmount)}
                            inputProps={{
                              style: { textAlign: 'right' },
                              inputMode: 'numeric',
                              readOnly: true
                            }}
                            type="text"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <InputLabel sx={{ mb: 0.5 }}>Total Receiving Amount</InputLabel>
                          <TextField
                            sx={{ width: '100%', textAlign: 'right' }}
                            id="amount"
                            {...getFieldProps('totalAmount')}
                            inputProps={{
                              style: { textAlign: 'right' },
                              inputMode: 'numeric',
                              onInput: (e: any) => {
                                var totalReceivingAmount = Number(e.currentTarget.value);
                                setTotalReceivedAmount(totalReceivingAmount);
                                if (totalReceivingAmount > 0) {
                                  selectedCustomerInvoices?.forEach((element, index) => {
                                    var pendingAmount =
                                      selectedCustomerInvoices[index].totalAmount - selectedCustomerInvoices[index].setteledAmount;
                                    if (totalReceivingAmount >= pendingAmount) {
                                      selectedCustomerInvoices[index].receivingAmount = pendingAmount;
                                    } else if (totalReceivingAmount > 0) {
                                      selectedCustomerInvoices[index].receivingAmount = totalReceivingAmount;
                                    } else {
                                      selectedCustomerInvoices[index].receivingAmount = 0;
                                    }
                                    totalReceivingAmount = totalReceivingAmount - pendingAmount;
                                  });
                                }
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1.5} direction="row" sx={{ marginBottom: 2.5 }}>
                        <Grid item xs={3} sx={{ width: 50 }}>
                          <Stack spacing={0}>
                            <InputLabel sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>Payment Mode</InputLabel>
                            <Select label="Payment Mode">
                              <MenuItem value={10}>Cash</MenuItem>
                              <MenuItem value={20}>Cheque</MenuItem>
                              <MenuItem value={30}>NEFT</MenuItem>
                              <MenuItem value={40}>RTGS</MenuItem>
                              <MenuItem value={50}>UPI</MenuItem>
                            </Select>
                          </Stack>
                        </Grid>
                        <Grid item xs={3} sx={{ width: '50%' }}>
                          <Stack spacing={0}>
                            <InputLabel sx={{ mb: 0.5 }}>Payment Through</InputLabel>
                            <Select label="Payment Through">
                              <MenuItem value={10}>Liability</MenuItem>
                              <MenuItem value={20}>Expense</MenuItem>
                              <MenuItem value={30}>Revenue</MenuItem>
                              <MenuItem value={40}>Asset</MenuItem>
                            </Select>
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel sx={{ mb: 0.5 }}>Description</InputLabel>
                          <TextareaAutosize
                            id="description"
                            minRows={1.5}
                            maxRows={10}
                            placeholder="Enter Description"
                            style={{
                              width: '100%',
                              resize: 'vertical',
                              border: '1px solid #ced4da',
                              borderRadius: '4px',
                              padding: '8px',
                              fontFamily: 'inherit'
                            }}
                          />
                        </Grid>
                      </Grid>
                      <MainCard
                        content={false}
                        title={`Invoice's of ${
                          (selectedCustomerId && customernames
                            ? customernames.find((customer: { id: any }) => customer.id === selectedCustomerId)?.name
                            : '') || ''
                        }`}
                      ></MainCard>
                      <MainCard>
                        <Grid item xs={12}>
                          <FieldArray
                            name="invoice_detail"
                            render={({ remove, push }) => {
                              return (
                                <>
                                  {invoices && invoices.length > 0 ? (
                                    <TableContainer>
                                      <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Invoice No.
                                            </TableCell>
                                            <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Invoice Date
                                            </TableCell>
                                            <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Due Date
                                            </TableCell>
                                            <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Status
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Invoice Amt
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Setteled Amt
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '2px 0px', width: '50px' }}>
                                              Rmn. Amt
                                            </TableCell>
                                            <TableCell align="right" sx={{ padding: '2px 0px', width: '50px', textAlign: 'right' }}>
                                              Receiving Amt
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {selectedCustomerInvoices?.map((item: any, index: number) => (
                                            <TableRow key={item.id}>
                                              <InvoicePaymentItem
                                                key={item.id}
                                                id={item.id}
                                                index={index}
                                                invoiceNumber={item.invoiceNumber}
                                                invoiceDate={item.invoiceDate}
                                                dueDate={item.dueDate}
                                                invoiceStatus={item.invoiceStatus}
                                                invoiceAmount={item.totalAmount}
                                                setteledAmount={item.setteledAmount}
                                                remainingAmount={item.remainingAmount}
                                                receivingAmount={item.receivingAmount}
                                                onDeleteItem={(index: number) => remove(index)}
                                                onEditItem={handleChange}
                                                Blur={handleBlur}
                                                errors={errors}
                                                touched={touched}
                                                setFieldValue={setFieldValue}
                                                InputProps={item.inputProps}
                                              />
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  ) : (
                                    <Typography variant="body1" color={'error'}>
                                      {`No invoices available for the  ${
                                        (selectedCustomerId && customernames
                                          ? customernames.find((customer: { id: any }) => customer.id === selectedCustomerId)?.name
                                          : '') || ''
                                      }`}
                                    </Typography>
                                  )}
                                  <Divider />
                                </>
                              );
                            }}
                          />
                        </Grid>
                      </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1} direction="row">
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                          <Grid paddingTop={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1} sx={{ marginTop: 2, paddingRight: '50px' }}>
                                <Stack paddingRight={1} direction="row" justifyContent="space-between" alignItems="right">
                                  <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                                    Grand Total :
                                  </Typography>
                                  <Typography paddingLeft={5}>
                                    ₹{' '}
                                    {Number(formattedTotalAmount.replace(/,/g, '')).toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </Typography>
                                </Stack>
                                <Stack paddingRight={1} direction="row" justifyContent="space-between" alignItems="right">
                                  <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                                    Previously Settled Amount :
                                  </Typography>

                                  <Typography paddingLeft={5}>
                                    ₹{' '}
                                    {Number(formattedtotalSettledAmount.replace(/,/g, '')).toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </Typography>
                                </Stack>
                                <Stack paddingRight={1} direction="row" justifyContent="space-between" alignItems="right">
                                  <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                                    Remaining Amount Total :
                                  </Typography>
                                  <Typography paddingLeft={5}>
                                    ₹{' '}
                                    {Number(formattedremainingTotalamount.replace(/,/g, '')).toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </Typography>
                                </Stack>
                                <Stack paddingRight={1} direction="row" justifyContent="space-between" alignItems="right">
                                  <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                                    Amount Paid :
                                  </Typography>
                                  <Typography paddingLeft={5}>
                                    ₹{' '}
                                    {Number(formattedtotalPaidAmount.replace(/,/g, '')).toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </Typography>
                                </Stack>
                                <Stack paddingRight={1} direction="row" justifyContent="space-between" alignItems="right">
                                  <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                                    Advance Amount Paid :
                                  </Typography>
                                  <Typography paddingLeft={5}>
                                    ₹{' '}
                                    {Number(formattedadvanceAmount.replace(/,/g, '')).toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>
                            <Grid item xs={12}>
                              <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-end" sx={{ mt: 8 }}>
                                <Button variant="outlined" color="secondary">
                                  Cancel
                                </Button>
                                <Button variant="contained" sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}>
                                  Pay Invoices
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </Form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default AddReceivedPayment;
