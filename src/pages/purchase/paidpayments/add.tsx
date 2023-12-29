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
import { IBill } from 'types/bill';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BillPaymentHeader, BillPaymentLine } from 'types/billiingDetails';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { createPaidPaymentRequest, getAllBills, getAllVendors } from 'api/services/BillService';
import BillPaymentItem from 'sections/apps/bill/BillPaymentItem';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// constant
const getInitialValues = (paidPayment: FormikValues | null) => {
  const newPaidPayment = {
    vendornames: '',
    clientId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    vendorId: '',
    vendorName: '',
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
  paidpayment?: any;
  onCancel: () => void;
  data: IBill;
}

const AddPaidPayment = ({ paidpayment, onCancel }: Props) => {
  const PaidPaymentSchema = Yup.object().shape({
    vendorName: Yup.string().max(255).required('Please Enter vendor Name'),
    amount: Yup.string()
      .matches(/^\d+(\.\d{0,2})?$/, 'Use only two decimal places')
      .required('Please Enter Amount'),
    description: Yup.string().max(255).required('Please Enter Description')
  });

  const [vendornames, setVendorNames] = useState<any>();
  const [selectedVendorBills, setSelectedVendorBills] = useState<IBill[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [bills, setBills] = useState<IBill[]>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalSettledAmount, setTotalSettledAmount] = useState<number>(0);
  const [remainingTotalamount, setRemainingTotalamount] = useState<number>(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [totalAmountOfBill, settotalAmountOfBill] = useState<number>(0);

  useEffect(() => {
    getAllVendors('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((vendorList) => {
        if (Array.isArray(vendorList)) {
          const vendorData = vendorList.map((vendor) => ({
            id: vendor.id,
            name: `${vendor.firstName} ${vendor.lastName}`
          }));
          setVendorNames(vendorData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedVendorId && selectedVendorId !== '') {
      getAllBills('3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .then((billList) => {
          if (Array.isArray(billList)) {
            var list = billList.filter(
              (e) => e.vendorId === selectedVendorId && (e.billStatus === 'Approved' || e.billStatus === 'Partially Paid')
            );
            setBills(list);
            const total = list.reduce((acc, current) => acc + current.amount, 0);
            setTotalAmount(total);
            // Update the selectedVendorBills state with the fetched bill details
            setSelectedVendorBills(list);
          } else {
            console.error('API response is not an array:', billList);
          }
        })
        .catch((error) => {
          console.error('Error fetching bill data:', error);
        });
    }
  }, [selectedVendorId]);

  const addCommas = (number: number) => {
    const formattedNumber = new Intl.NumberFormat('en-IN').format(number);
    return formattedNumber;
  };

  useEffect(() => {
    settotalAmountOfBill(selectedVendorBills.reduce((acc, bill) => acc + bill.totalAmount, 0));
    let totalSettledAmount = selectedVendorBills.reduce((acc, bill) => acc + bill.setteledAmount, 0);
    setTotalSettledAmount(totalSettledAmount);
    setRemainingTotalamount(totalAmountOfBill - totalSettledAmount);
  }, [selectedVendorBills, totalAmountOfBill]);

  useEffect(() => {
    const remainingAmount = totalPaidAmount > totalAmountOfBill ? totalPaidAmount - remainingTotalamount : 0;
    setAdvanceAmount(remainingAmount);
  }, [totalPaidAmount, totalAmount, totalAmountOfBill, remainingTotalamount]);

  const formik = useFormik({
    initialValues: getInitialValues(paidpayment!),
    validationSchema: PaidPaymentSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const piadPaymentData = {
          clientId: values.clientId,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          transactionId: values.transactionId,
          coaId: values.coaId,
          description: values.description,
          amount: values.amount,
          setteledAmount: values.setteledAmount
        };
        if (paidpayment) {
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
          const response = await createPaidPaymentRequest(piadPaymentData);
          if (response === 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Paid Payment added successfully.',
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
    const bill: BillPaymentHeader = {
      id: '',
      companyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      vendorId: '',
      vendorName: '',
      billDate: new Date(),
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      amount: Number(values.amount),
      payingAmount: Number(values.payingAmount),
      description: '',
      paymentMode: '',
      paymentThrough: ''
    };
    bill.lines = values.bill_payment_detail.map((billItem: any) => {
      let billPaymentLine = {} as BillPaymentLine;
      billPaymentLine.billNumber = billItem.billNumber;
      billPaymentLine.billDate = billItem.billDate;
      billPaymentLine.dueDate = billItem.dueDate;
      billPaymentLine.billStatusId = billItem.billStatusId;
      billPaymentLine.billStatus = billItem.billStatus;
      billPaymentLine.billAmount = billItem.billAmount;
      billPaymentLine.setteledAmount = billItem.setteledAmount;
      billPaymentLine.payingAmount = billItem.payingAmount;
      return billPaymentLine;
    });
  };
  return (
    <MainCard>
      <Formik
        initialValues={{
          bill_payment_detail: [
            {
              billNumber: 0,
              billDate: '',
              dueDate: '',
              status: '',
              amount: 0,
              setteledAmount: 0,
              payingAmount: 0
            }
          ]
        }}
        validationSchema={PaidPaymentSchema}
        onSubmit={(values) => {
          handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const formattedTotalAmount = addCommas(totalAmountOfBill);
          const formattedtotalSettledAmount = addCommas(totalSettledAmount);
          const formattedremainingTotalamount = addCommas(remainingTotalamount);
          const formattedtotalPaidAmount = addCommas(totalPaidAmount);
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
                          <InputLabel sx={{ mb: 0.5 }}>Vendor Name</InputLabel>
                          <FormControl sx={{ width: '100%' }}>
                            {vendornames && vendornames.length > 0 ? (
                              <Autocomplete
                                id="controllable-states-demo"
                                options={(vendornames || []) as any[]}
                                getOptionLabel={(option: any) => `${option.name}`}
                                onChange={(event, newValue) => {
                                  if (newValue && newValue.id) {
                                    setSelectedVendorId(newValue.id);
                                  } else {
                                    setSelectedVendorId(null);
                                  }
                                  handleChange({ target: { name: 'vendorName', value: newValue ? newValue.name : '' } });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            ) : (
                              <Box display="flex" flexDirection="row" alignItems="left" justifyContent="left" height="100px">
                                <CircularProgress size={30} thickness={4} />
                                <Grid flexDirection={'column'}>
                                  <Typography variant="body1" style={{ marginTop: '32x' }}>
                                    Loading Vendor Names,
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
                          <InputLabel sx={{ mb: 0.5 }}>Remaining Bill Amount</InputLabel>
                          <TextField
                            disabled
                            sx={{ width: '100%', textAlign: 'right' }}
                            id="totalAmount"
                            value={remainingTotalamount}
                            placeholder={String(totalAmount)}
                            inputProps={{
                              style: { textAlign: 'right' },
                              inputMode: 'numeric',
                              readOnly: true
                            }}
                            type="number"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <InputLabel sx={{ mb: 0.5 }}>Total Paying Amount</InputLabel>
                          <TextField
                            sx={{ width: '100%', textAlign: 'right' }}
                            id="amount"
                            {...getFieldProps('totalAmount')}
                            inputProps={{
                              style: { textAlign: 'right' },
                              inputMode: 'numeric',
                              onInput: (e: any) => {
                                var totalPayingAmount = Number(e.currentTarget.value);
                                setTotalPaidAmount(totalPayingAmount);
                                if (totalPayingAmount > 0) {
                                  selectedVendorBills?.forEach((element, index) => {
                                    var pendingAmount = selectedVendorBills[index].totalAmount - selectedVendorBills[index].setteledAmount;
                                    if (totalPayingAmount >= pendingAmount) {
                                      selectedVendorBills[index].payingAmount = pendingAmount;
                                    } else if (totalPayingAmount > 0) {
                                      selectedVendorBills[index].payingAmount = totalPayingAmount;
                                    } else {
                                      selectedVendorBills[index].payingAmount = 0;
                                    }
                                    totalPayingAmount = totalPayingAmount - pendingAmount;
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
                        title={`Bill's of ${
                          (selectedVendorId && vendornames
                            ? vendornames.find((vendor: { id: any }) => vendor.id === selectedVendorId)?.name
                            : '') || ''
                        }`}
                      ></MainCard>
                      <MainCard>
                        <Grid item xs={12}>
                          <FieldArray
                            name="bill_detail"
                            render={({ remove, push }) => {
                              return (
                                <>
                                  <MainCard
                                    content={false}
                                    title={`Bill's of ${
                                      (selectedVendorId && vendornames
                                        ? vendornames.find((vendor: { id: any }) => vendor.id === selectedVendorId)?.name
                                        : '') || ''
                                    }`}
                                  >
                                    {bills && bills.length > 0 ? (
                                      <TableContainer>
                                        <Table sx={{ minWidth: 650 }}>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Bill No.
                                              </TableCell>
                                              <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Bill Date
                                              </TableCell>
                                              <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Due Date
                                              </TableCell>
                                              <TableCell align="left" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Status
                                              </TableCell>
                                              <TableCell align="right" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Bill Amt
                                              </TableCell>
                                              <TableCell align="right" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Setteled Amt
                                              </TableCell>
                                              <TableCell align="right" sx={{ padding: '2px 0px', width: '50px' }}>
                                                Rmn. Amt
                                              </TableCell>
                                              <TableCell align="right" sx={{ padding: '2px 0px', width: '50px', textAlign: 'right' }}>
                                                Paying Amt
                                              </TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {selectedVendorBills?.map((item: any, index: number) => (
                                              <TableRow key={item.id}>
                                                <BillPaymentItem
                                                  key={item.id}
                                                  id={item.id}
                                                  index={index}
                                                  billNumber={item.billNumber}
                                                  billDate={item.billDate}
                                                  dueDate={item.dueDate}
                                                  billStatus={item.billStatus}
                                                  billAmt={item.totalAmount}
                                                  setteledAmount={item.setteledAmount}
                                                  remainingAmount={item.remainingAmount}
                                                  payingAmt={item.payingAmount}
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
                                        {`No bills available for the  ${
                                          (selectedVendorId && vendornames
                                            ? vendornames.find((vendor: { id: any }) => vendor.id === selectedVendorId)?.name
                                            : '') || ''
                                        }`}
                                      </Typography>
                                    )}
                                  </MainCard>
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
                                  Pay Bill's
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

export default AddPaidPayment;
